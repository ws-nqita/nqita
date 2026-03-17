# NQITA — Agent Runtime

## Overview

The Agent Runtime is the brain behind Nqita. It runs as a background process, monitors OS signals, drives the curiosity system, manages the mode state machine, and interfaces with the LLM backend to generate responses.

It is designed to run indefinitely without meaningfully impacting system resources.

---

## Process Model

The Agent Runtime runs as a separate process from the Sprite Layer. This isolation prevents LLM latency from causing sprite animation stutters, and ensures the visual layer remains responsive even when the agent is busy.

```
┌──────────────────────┐       IPC socket       ┌────────────────────────┐
│   Sprite Process     │ ◄────────────────────► │   Agent Runtime        │
│  (Electron/Tauri/Qt) │                        │  (Node.js / Rust)      │
└──────────────────────┘                        └────────────────────────┘
                                                         │
                                              ┌──────────┼──────────┐
                                              ▼          ▼          ▼
                                        OS Signals   LLM API   KV Memory
```

### Process Priority

The Agent Runtime must run at idle/below-normal priority. It should never compete with foreground applications.

| Platform | How to set |
|----------|-----------|
| Windows | `SetPriorityClass(IDLE_PRIORITY_CLASS)` |
| macOS | `setpriority(PRIO_PROCESS, 0, 20)` or `nice -n 20` |
| Linux | `nice -n 19` or `ionice -c 3` |

In Node.js, the process can lower its own priority:
```javascript
// Node.js — requires the `os` module and platform-specific bindings
// or a native addon like `node-os-utils`
process.nextTick(() => {
  try { process.setUncaughtExceptionCaptureCallback(null); } catch {}
  // Priority lowering via child_process.exec or native bindings
});
```

In Rust/Tauri, use the `libc` crate:
```rust
unsafe { libc::setpriority(libc::PRIO_PROCESS, 0, 19); }
```

---

## Event Loop

The Agent Runtime is entirely event-driven. There are no spin loops.

```
External signals (OS APIs, window events)
         ↓
   Event Queue (bounded, FIFO)
         ↓
   Debounce / dedup filter
         ↓
   Curiosity Engine (probability gate)
         ↓
   Mode State Machine (checks current mode)
         ↓
   LLM Interface (generates response if needed)
         ↓
   IPC → Sprite Layer (trigger animation / bubble / mini browser)
```

Polling intervals (for signals that cannot be pushed):
- Window title poll: 2-second interval
- Idle detection: 30-second interval
- Notification scan (fallback): 5-second interval

All polling is done with `setTimeout`/`setInterval` (or equivalent), not busy loops.

---

## Browser Activity Detection

Nqita detects browser activity through OS-level accessibility APIs. She does **not** inject scripts into web pages, parse the DOM, or use browser extensions for this purpose. The signal is intentionally coarse.

### What she detects
- Active window: application name
- Active window title: typically contains page title or tab title
- (Optional) URL via accessibility tree inspection

### Platform-specific implementation

#### Windows — WinEvent Hooks

```c
// SetWinEventHook with EVENT_OBJECT_FOCUS and EVENT_SYSTEM_FOREGROUND
// Callback receives hwnd of focused window
// Use GetWindowText(hwnd, ...) to read window title
HWINEVENTHOOK hook = SetWinEventHook(
    EVENT_SYSTEM_FOREGROUND, EVENT_SYSTEM_FOREGROUND,
    NULL, WinEventProc, 0, 0,
    WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS
);
```

To get the URL from a browser, traverse the accessibility tree:
```
IAccessible → ROLE_SYSTEM_TOOLBAR → child with URL bar role → accValue
```
Supported for Chrome, Firefox, Edge via standard accessibility APIs.

#### macOS — Accessibility API

```swift
// Request accessibility permission first (Accessibility in System Preferences)
let app = NSWorkspace.shared.frontmostApplication
let pid = app?.processIdentifier

let axApp = AXUIElementCreateApplication(pid)
var focusedWindow: CFTypeRef?
AXUIElementCopyAttributeValue(axApp, kAXFocusedWindowAttribute, &focusedWindow)

var title: CFTypeRef?
AXUIElementCopyAttributeValue(focusedWindow as! AXUIElement, kAXTitleAttribute, &title)
```

URL detection from browsers: traverse the AX tree to find the URL bar element (`AXTextField` with identifier matching known browser URL bar roles).

#### Linux — AT-SPI2 (atspi)

```python
import pyatspi

def on_focus(event):
    app_name = event.source.get_application().name
    title = event.source.name
    # Check if it's a browser, inspect URL bar child

registry = pyatspi.Registry
registry.registerEventListener(on_focus, 'object:state-changed:focused')
pyatspi.main()
```

For X11 window focus events without atspi:
```bash
xdotool getactivewindow getwindowname
```

For Wayland, use the ext-foreign-toplevel-list-v1 protocol if the compositor supports it.

---

## Signal Sources Summary

| Signal | Windows | macOS | Linux |
|--------|---------|-------|-------|
| Active window title | WinEvent `EVENT_SYSTEM_FOREGROUND` | `NSWorkspace` + Accessibility API | X11 `_NET_ACTIVE_WINDOW` or atspi |
| Browser URL | IAccessible tree walk | AXUIElement tree walk | atspi tree walk |
| System notifications | `ToastNotification` COM API | `NSUserNotificationCenter` / UNUserNotification | libnotify / dbus |
| Idle time | `GetLastInputInfo` | `IOHIDGetSystemActivityState` | X11 `XScreenSaverQueryInfo` |
| App focus changes | WinEvent hooks | `NSWorkspace` notifications | atspi / X11 events |

---

## Memory Management

Conversation memory is stored in KV (Cloudflare KV or a local LevelDB equivalent).

Key format: `mem:<userId>:<sessionId>`  
Value: JSON array of `{role, content, ts}` objects  
Max messages per session: **40** (oldest messages are trimmed on write)  
TTL: **7 days** from last write  

```typescript
// Memory is non-fatal — if KV is unavailable, the agent runs without memory
async function getMemory(userId: string, sessionId: string): Promise<Message[]> {
  try {
    const raw = await kv.get(`mem:${userId}:${sessionId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
```

### Memory TTL Configuration

| TTL | Behavior |
|-----|----------|
| 7 days (default) | Sessions expire after 7 days of inactivity |
| 0 (disabled) | No persistence; memory is session-only |
| Custom | Set `MEMORY_TTL_SECONDS` in configuration |

---

## Crash Recovery

If the Agent Runtime crashes, it should restart automatically and resume gracefully.

The recommended approach is a watchdog process:

```bash
# Simple watchdog (bash)
while true; do
  nqita-agent &
  AGENT_PID=$!
  wait $AGENT_PID
  EXIT_CODE=$?
  if [ $EXIT_CODE -ne 0 ]; then
    echo "Agent exited with $EXIT_CODE, restarting in 3s..."
    sleep 3
  fi
done
```

On startup after a crash, the runtime should:
1. Read persisted mode state from disk
2. Restore last known mode
3. Send a "woke up" signal to the Sprite Layer
4. Sprite Layer plays the `reaction` animation and shows bubble: **"Nqita woke up."**

### Platform-level supervision

| Platform | Supervision mechanism |
|----------|--------------------- |
| Windows | Windows Service + `SC_ACTION_RESTART` on failure |
| macOS | launchd plist with `KeepAlive: true` |
| Linux | systemd unit with `Restart=on-failure` |

### Graceful shutdown

On SIGTERM/SIGINT:
1. Flush in-memory reaction log to disk
2. Write current mode state to disk
3. Close IPC socket cleanly
4. Exit 0

---

## IPC Protocol

The Sprite Layer and Agent Runtime communicate over a local Unix domain socket (macOS/Linux) or named pipe (Windows) using newline-delimited JSON.

```
Socket path: /tmp/nqita-agent.sock  (macOS/Linux)
Pipe name:   \\.\pipe\nqita-agent   (Windows)
```

### Message Schema

From Sprite → Agent:
```json
{ "type": "USER_HOVER", "ts": 1710000000 }
{ "type": "USER_CLICK", "ts": 1710000001 }
{ "type": "MODE_CHANGE_REQUEST", "mode": "RESEARCH", "ts": 1710000002 }
{ "type": "BUBBLE_DISMISSED", "ts": 1710000003 }
```

From Agent → Sprite:
```json
{ "type": "TRIGGER_BUBBLE", "text": "Hmm… that looks interesting.", "duration": 5000 }
{ "type": "TRIGGER_MINI_BROWSER", "url": "https://example.com" }
{ "type": "SET_ANIMATION", "state": "researching" }
{ "type": "SET_MODE", "mode": "RESEARCH" }
{ "type": "UPDATE_TASK_QUEUE", "tasks": [] }
```

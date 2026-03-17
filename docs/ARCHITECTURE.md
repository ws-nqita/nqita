# NQITA — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Desktop Surface                          │
│                                                                 │
│   ┌──────────────────────────────────────────────────────┐      │
│   │         LAYER 1 — SPRITE LAYER (OS Overlay)          │      │
│   │   Transparent window · always-on-top · click-through │      │
│   │                                                      │      │
│   │   [Nqita sprite]  ← animation state machine          │      │
│   │        ↕  (events: click, hover, proximity)          │      │
│   │   ┌──────────────────────────────────────────────┐   │      │
│   │   │     LAYER 2 — INTERACTION LAYER              │   │      │
│   │   │  [Bubble]  [Mini Browser]  [Full View]       │   │      │
│   │   └────────────────────┬─────────────────────────┘   │      │
│   └────────────────────────┼─────────────────────────────┘      │
│                            │ IPC (local socket / named pipe)    │
│   ┌────────────────────────┼─────────────────────────────┐      │
│   │   LAYER 3 — CURIOSITY SYSTEM + AGENT RUNTIME         │      │
│   │                        │                             │      │
│   │   OS Signal Monitor ───┤                             │      │
│   │   (window focus,       │                             │      │
│   │    tab titles,         ↓                             │      │
│   │    notifications)   Event Queue                      │      │
│   │                        │                             │      │
│   │                   Probability Filter                 │      │
│   │                        │                             │      │
│   │                   Mode State Machine                 │      │
│   │                        │                             │      │
│   │                   Agent Runtime ←→ KV_MEMORY         │      │
│   │                   (Cloudflare Worker / local LLM)    │      │
│   └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 1 — Sprite Layer

### Purpose

The Sprite Layer is responsible for rendering Nqita as a visible presence on the desktop. It manages the OS-level window, sprite rendering, animation state, and user input passthrough.

### Window Management

Nqita lives in a frameless, transparent, always-on-top window positioned on the desktop surface. The window is click-through by default — user input passes through to whatever is beneath. Interaction zones (areas where Nqita can be clicked or hovered) are explicit exceptions to this passthrough.

**Implementation options:**

| Approach | Window API | Notes |
|----------|-----------|-------|
| Electron | `BrowserWindow` with `transparent`, `alwaysOnTop`, `setIgnoreMouseEvents` | Best cross-platform support. ~150 MB bundle overhead. |
| Tauri | `WebviewWindow` with Rust `set_ignore_cursor_events` | Preferred long-term. ~10–15 MB. Rust backend for OS integration. |
| Qt native | `Qt::FramelessWindowHint \| Qt::WindowTransparentForInput` | Most performant. Highest platform complexity. |

**Platform-specific overlay APIs:**

| Platform | Approach |
|----------|----------|
| Windows | `WS_EX_LAYERED \| WS_EX_TRANSPARENT` via Win32 |
| macOS | `NSPanel` with `NSWindowStyleMaskNonactivatingPanel`, `NSWindowCollectionBehaviorCanJoinAllSpaces` |
| Linux (X11) | `_NET_WM_WINDOW_TYPE_DESKTOP`, shaped window via XShape |
| Linux (Wayland) | `wlr-layer-shell` protocol (wlroots compositors); `gtk-layer-shell` library |

### Sprite Rendering Pipeline

```
Sprite Sheet (PNG)
      ↓
Animation State Machine
  → selects current sequence (idle_a, walk_left, curious, …)
  → tracks frame index, frame duration
      ↓
requestAnimationFrame loop
  → gated at ≤30 fps (target frame budget: ~33ms)
  → renders current frame to Canvas / WebView
  → if frame takes >50ms: skip next frame (backoff)
      ↓
Composited to OS window
```

See [SPRITE_SYSTEM.md](./SPRITE_SYSTEM.md) for sprite format, animation names, and frame budgets.

### Frame Budget

| Metric | Target |
|--------|--------|
| Max frame rate | 30 fps |
| CPU at idle | < 2% |
| RAM footprint | < 100 MB |
| Process priority | Idle / Below Normal |

---

## Layer 2 — Interaction Layer

### Three UI Modes

#### Bubble Mode

The default interaction surface. A pixel-art speech bubble appears above Nqita's head, containing a short text message.

- Triggered by: curiosity reactions, user hover, direct query
- Duration: 3–8 seconds, then fade out
- Content: short text, ≤ 80 characters
- Rendered as: HTML/CSS overlay or Canvas sprite

Data flow:
```
Agent Runtime → generates response text
      ↓
Bubble Renderer → displays above sprite
      ↓
Auto-dismiss timer → clears after TTL
```

#### Mini Browser Mode

Nqita opens a small browser window. She is animated sitting at a pixel-art desk, typing and reading. The browser shows what she is actively researching.

- Triggered by: entering Research mode, curiosity trigger with browser signal
- Size: approximately 400×300px, resizable
- Content: embedded WebView navigating to a URL or showing a search result
- Animation: switches to `researching` sprite state

Data flow:
```
Curiosity signal (URL/topic detected)
      ↓
Agent Runtime → determines query
      ↓
Mini Browser opens → navigates to URL
      ↓
Sprite → switches to `researching` animation
      ↓
Bubble (optional): "Let me look at that…"
```

#### Full View Mode

Expands to a full side panel or window. Shows:

- Nqita's terminal output (agent command log)
- Active browser session (what she is viewing)
- Task queue (pending and completed tasks)
- Agent logs (LLM reasoning, tool calls)
- Memory view (recent conversation context)

This mode is the observability surface. Everything Nqita is doing is visible here.

### Communication with Agent Runtime

The Interaction Layer communicates with the Agent Runtime over a local IPC channel:

- **Electron**: `ipcRenderer` / `ipcMain` bridge
- **Tauri**: Tauri event system (`invoke`, `emit`, `listen`)
- **Standalone**: Unix domain socket (macOS/Linux) or named pipe (Windows)

Message types:
```
sprite → runtime:  USER_HOVER, USER_CLICK, MODE_CHANGE_REQUEST
runtime → sprite:  TRIGGER_BUBBLE(text), TRIGGER_MINI_BROWSER(url), SET_ANIMATION(state),
                   SHOW_FULL_VIEW, UPDATE_TASK_QUEUE(tasks)
```

---

## Layer 3 — Curiosity System

See [CURIOSITY_SYSTEM.md](./CURIOSITY_SYSTEM.md) for full specification.

### Signal Sources

| Signal | Source API |
|--------|-----------|
| Active window title | OS accessibility API (platform-specific) |
| Browser tab URL + title | macOS: Accessibility API; Windows: WinEvent hooks; Linux: atspi/AT-SPI2 |
| System notifications | OS notification APIs |
| Application focus changes | OS window focus events |
| Idle time | OS idle detection API |

### Probability Model

```
base_rate = 0.15  (15%)

modifiers:
  + if recent_idle_minutes > 10: +0.05
  - if reaction_count_last_hour > 3: -0.10
  - if current_mode == PASSIVE: -0.08
  + if current_mode == RESEARCH: +0.05
  - if muted: reaction_probability = 0

final_probability = clamp(base_rate + modifiers, 0.0, 0.35)
```

### Event Queue

Signals arrive asynchronously and are placed in an ordered event queue. The queue processes one event per cooldown window to prevent reaction spam.

---

## Mode System Architecture

See [MODES.md](./MODES.md) for full mode specification.

### State Machine (simplified)

```
           ┌─────────┐
    ┌──────►  PASSIVE ◄──────┐
    │      └────┬────┘       │
    │           │ user triggers / auto
    │      ┌────▼──────┐     │
    │      │ ASSISTANT │     │
    │      └────┬──────┘     │
    │           │            │
    │      ┌────▼──────┐     │
    │      │ RESEARCH  │     │
    │      └────┬──────┘     │
    │           │            │
    │      ┌────▼──────┐     │
    └───── │   YOLO    ├─────┘
           └───────────┘
```

Any mode can transition directly to any other mode on explicit user command. Automatic transitions follow the flow above. See [MODES.md](./MODES.md) for full transition rules.

---

## IPC Between Layers

```
Sprite Process                     Agent Runtime Process
─────────────────────────────────────────────────────
[Animation Loop]                   [Event Loop]
[Input Handler]  ←─── socket ───►  [Signal Monitor]
[Bubble Renderer]                  [Curiosity Engine]
[Mini Browser]                     [Mode State Machine]
[Full View]                        [LLM Interface]
                                   [KV Memory]
```

The Sprite Layer and Agent Runtime run as separate processes to prevent agent latency from affecting sprite rendering. They communicate over a local socket with a lightweight JSON-RPC protocol.

---

## Data Stores

| Store | What is stored | TTL | Backend |
|-------|---------------|-----|---------|
| KV_MEMORY | Conversation messages per session (max 40 messages) | 7 days | Cloudflare KV or local LevelDB |
| Mode state | Current mode, last transition timestamp | Persistent | Local JSON file |
| Preferences | Reaction rate, mute state, cooldowns, sprite position | Persistent | Local JSON file |
| Reaction log | Timestamp and type of last N reactions | Session | In-memory ring buffer |

Conversation memory uses the key pattern `mem:<userId>:<sessionId>`. Each entry is a JSON array of `{role, content, ts}` objects, trimmed to the most recent 40 messages before writes.

---

## Platform API (existing)

The Cloudflare Worker platform API (Hono-based) serves as the hosted backend for Nqita. It is an independent component — the desktop sprite layer can call it remotely or use a local LLM runtime.

See [docs/api.md](./api.md) for the API reference.

# NQITA — Curiosity System

## Overview

The Curiosity System is what makes Nqita feel alive. It monitors OS-level signals, decides whether they are worth reacting to, and—if the probability gate passes—tells the Agent Runtime to generate a reaction.

The goal is to be interesting without being annoying. The system is tuned to react rarely enough that each reaction feels meaningful.

---

## Signal Sources

Nqita monitors signals through OS accessibility APIs. She does not inject into browser sessions or parse DOM trees.

### Signal Types

| Signal | Description | Priority |
|--------|-------------|----------|
| `BROWSER_URL_CHANGE` | Active browser tab URL changed | High |
| `BROWSER_TITLE_CHANGE` | Page title changed in active browser | High |
| `APP_FOCUS_CHANGE` | User switched to a different application | Medium |
| `NOTIFICATION_RECEIVED` | System notification appeared | Medium |
| `WINDOW_TITLE_CHANGE` | Active window title changed (non-browser) | Low |
| `SYSTEM_IDLE_START` | User has been idle for ≥ N minutes | Low |
| `SYSTEM_IDLE_END` | User returned from idle | Low |

### How Signals Are Captured

See [AGENT_RUNTIME.md](./AGENT_RUNTIME.md) for platform-specific implementation details.

Quick reference:
- **Windows:** WinEvent hooks (`SetWinEventHook`), IAccessible tree for browser URLs
- **macOS:** `NSWorkspace` notifications, Accessibility API (`AXUIElement`)
- **Linux:** X11 `_NET_ACTIVE_WINDOW` property changes, AT-SPI2 for app titles, atspi for accessibility tree

---

## Probability Model

Every incoming signal passes through a probability gate before triggering a reaction.

### Base Rate

```
base_rate = 0.15  (15%)
```

The base rate is the starting probability for any signal, before modifiers are applied.

### Modifier Stack

Modifiers are additive. They are applied in order and the result is clamped to `[0.0, 0.35]`.

```
modifier_1: +0.05  if system_idle_minutes > 10
              (Nqita is more reactive when you haven't done much recently)

modifier_2: -0.10  if reaction_count_last_hour > 3
              (backs off if she has already reacted several times recently)

modifier_3: -0.08  if current_mode == PASSIVE
              (less reactive in passive mode)

modifier_4: +0.05  if current_mode == RESEARCH
              (more reactive in research mode, that's the point)

modifier_5: -0.05  if signal_priority == LOW
              (low-priority signals are less likely to trigger)

modifier_6: +0.08  if signal_priority == HIGH and current_mode in [ASSISTANT, RESEARCH]
              (high-priority signals in active modes get a boost)
```

### Final Calculation

```
probability = clamp(base_rate + sum(modifiers), 0.0, 0.35)

roll = random(0.0, 1.0)

if roll < probability:
    trigger_reaction(signal)
else:
    discard(signal)
```

In YOLO mode, the probability model is replaced with a fixed rate of 0.30 and modifiers are ignored (except the global mute flag).

---

## Cooldown System

After any reaction fires, a cooldown prevents another reaction for a minimum period. This ensures Nqita does not fire back-to-back reactions.

### Global Cooldown

A minimum time between any two reactions, regardless of signal type.

| Mode | Global cooldown |
|------|----------------|
| Passive | 120 seconds |
| Assistant | 60 seconds |
| Research | 45 seconds |
| YOLO | 20 seconds |

### Per-Signal Cooldown

Some signals have their own independent cooldown. This prevents the same signal type from triggering repeatedly, even if the global cooldown has reset.

| Signal | Per-signal cooldown |
|--------|-------------------|
| `BROWSER_URL_CHANGE` | 30 seconds |
| `BROWSER_TITLE_CHANGE` | 60 seconds (same domain) |
| `APP_FOCUS_CHANGE` | 20 seconds |
| `NOTIFICATION_RECEIVED` | 45 seconds |
| `SYSTEM_IDLE_END` | 120 seconds |

### Cooldown State

Cooldown state is tracked in an in-memory structure. It does not persist across restarts.

```typescript
interface CooldownState {
  globalCooldownUntil: number;       // Unix timestamp ms
  perSignal: Map<SignalType, number>; // signal → cooldownUntil
}
```

---

## Reaction Types

When the probability gate passes and cooldowns allow, a reaction fires. The type of reaction depends on the signal, the current mode, and a secondary probability roll.

### Reaction Type Selection

```
Given: signal type, current mode

1. Get candidate reaction types for this signal + mode combination
2. Roll against each candidate's weight
3. Select the first that passes (priority order: BUBBLE > MINI_BROWSER > ANIMATE_ONLY)
```

### Reaction Type Definitions

| Reaction | Description | Modes |
|----------|-------------|-------|
| `BUBBLE` | Short text bubble above Nqita's head | All |
| `MINI_BROWSER` | Opens Mini Browser, navigates to relevant URL | Research, YOLO |
| `ANIMATE_ONLY` | Plays an animation without text (e.g., `curious` head tilt) | All |
| `WANDER` | Nqita walks toward the edge of the screen in the direction of the active window | Passive, YOLO |
| `EXCITED` | Plays `excited` animation, optionally with bubble | Research, YOLO, Assistant |

### Signal-to-Reaction Mapping

| Signal | Reaction (by mode) |
|--------|-------------------|
| `BROWSER_URL_CHANGE` (YouTube) | Passive: `WANDER`; Assistant: `BUBBLE`; Research: `MINI_BROWSER`; YOLO: `MINI_BROWSER` + `EXCITED` |
| `BROWSER_URL_CHANGE` (generic) | Passive: none; Assistant: `ANIMATE_ONLY`; Research: `BUBBLE` |
| `APP_FOCUS_CHANGE` | All: `ANIMATE_ONLY` (`curious`) |
| `NOTIFICATION_RECEIVED` | Passive: none; Assistant: `BUBBLE` |
| `SYSTEM_IDLE_START` | All: `sleeping` animation |
| `SYSTEM_IDLE_END` | All: `reaction` animation + optional bubble |

### Example Bubble Texts

These are samples. The actual text is generated by the LLM with the signal as context.

| Trigger | Example bubble |
|---------|---------------|
| YouTube URL | *"Hmm… that looks interesting."* |
| News article | *"Oh, something happened."* |
| GitHub PR page | *"Reviewing? I can help with that."* |
| Long idle end | *"Welcome back."* |
| Random (YOLO) | *"I was just thinking about something."* |

---

## Mute / DND System

### Global Mute

When muted, the probability gate is forced to 0 for all signals. No reactions fire. Nqita continues to animate (idle loops) but will not speak or open the mini browser.

Global mute can be toggled:
- Via the system tray icon
- Via keyboard shortcut (configurable)
- Via the Full View panel

Mute state persists across restarts.

### Per-Signal Mute

Individual signal types can be muted independently. For example, a user might want notification reactions disabled but browser reactions enabled.

```json
// ~/.config/nqita/preferences.json
{
  "mute": {
    "global": false,
    "signals": {
      "NOTIFICATION_RECEIVED": true,
      "SYSTEM_IDLE_END": false
    }
  }
}
```

### DND (Do Not Disturb) Integration

On platforms that expose a DND/Focus mode API, Nqita should automatically respect it:

| Platform | DND detection |
|----------|--------------|
| macOS | `NSDistributedNotificationCenter` — `com.apple.notificationcenterui.dndstart/end` |
| Windows | Focus Assist — registry key `HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\CloudStore\...` |
| Linux | `org.freedesktop.Notifications.Inhibit` via D-Bus |

When system DND is active, Nqita enters a soft mute: she will not generate bubbles or open the mini browser, but she continues animating at low energy (idle loops only).

---

## Testing the Curiosity System

### Simulating Signals in Development

A development mode provides a signal injection API over the IPC socket:

```json
// Inject a test signal via IPC
{
  "type": "DEV_INJECT_SIGNAL",
  "signal": {
    "type": "BROWSER_URL_CHANGE",
    "data": {
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "title": "Rick Astley - Never Gonna Give You Up"
    }
  }
}
```

A test CLI tool is planned:

```bash
nqita-dev inject --signal BROWSER_URL_CHANGE --url "https://youtube.com" --title "Test Video"
nqita-dev inject --signal SYSTEM_IDLE_END
nqita-dev inject --signal NOTIFICATION_RECEIVED --text "Build succeeded"
```

### Forcing Reactions (Bypass Probability)

In development, the probability gate can be bypassed:

```json
{ "type": "DEV_FORCE_REACTION", "reactionType": "BUBBLE", "text": "Test message" }
{ "type": "DEV_FORCE_REACTION", "reactionType": "MINI_BROWSER", "url": "https://example.com" }
```

### Viewing Curiosity State

The Full View panel (in development mode) includes a Curiosity Debug tab showing:
- Current probability value with modifier breakdown
- Global and per-signal cooldown timers (countdown)
- Last 10 signals received (with pass/fail result)
- Reaction log (last 20 reactions, type + timestamp)

### Unit Testing

The probability model and cooldown system are pure functions and are fully unit-testable without OS signals:

```typescript
import { computeReactionProbability } from '../src/curiosity/probability';
import { CooldownManager } from '../src/curiosity/cooldown';

test('backs off after 3 reactions in an hour', () => {
  const state = { reactionCountLastHour: 4, idleMinutes: 0, mode: 'ASSISTANT' };
  const p = computeReactionProbability('BROWSER_URL_CHANGE', state);
  expect(p).toBeLessThan(0.10);
});

test('global cooldown blocks reaction', () => {
  const cooldown = new CooldownManager();
  cooldown.recordReaction('ASSISTANT');
  expect(cooldown.isBlocked()).toBe(true);
});
```

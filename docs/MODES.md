# NQITA — Modes

## Overview

Nqita has four operating modes that determine how frequently she reacts, what she does with her time, and how aggressively she engages with what you're doing. Modes are user-controlled and persist across restarts.

---

## The Four Modes

### Passive

Nqita is in the background. She is present but mostly quiet.

- Reaction probability: reduced (~7%)
- Wandering: occasional (once every 5–15 minutes)
- Observations: rare, only on highly relevant signals
- Sprite: primarily plays `idle_*` variants, occasional `observing`
- Research: never initiates
- Bubble: rare, short

**Use when:** You want her present but not actively engaging. Focus work. Deep sessions.

---

### Assistant

Nqita is actively helpful. She monitors context and offers assistance.

- Reaction probability: normal (10–15%)
- Wandering: rare — she stays focused
- Observations: regular, context-relevant
- Sprite: `idle_a`, `curious`, `bubble_idle` when active
- Research: responds to direct queries; limited autonomous research
- Bubble: moderate frequency, content-relevant

**Use when:** You want suggestions, summaries, and contextual help while working.

---

### Research

Nqita opens her mini browser and goes digging. She's interested in what you're doing and wants to learn more about it.

- Reaction probability: elevated (~20%)
- Wandering: none — she's working
- Observations: frequent
- Sprite: `researching` (at desk), `curious`, `excited` when she finds something
- Mini Browser: opens automatically on relevant signals
- Bubble: regular updates — "Found something interesting."
- Agent logs: visible in Full View if open

**Use when:** You want Nqita to actively explore the context of what you're doing and surface relevant information.

---

### YOLO

Autonomy maxed. Nqita does what she wants. She may ignore you.

- Reaction probability: she decides
- Wandering: frequent and unpredictable
- Observations: whatever catches her interest — not necessarily related to your work
- Sprite: full range, unpredictable
- Research: autonomous — she picks her own topics
- Bubble: on her own schedule
- User requests: acknowledged but not prioritized

**Use when:** You want her to be wild. No guarantees about relevance. She's a free agent.

> *"Let Nqita be wild."*

---

## State Machine

```
         USER SETS MODE (any time, from any mode)
         ┌──────────────────────────────────────┐
         ▼                                      │
    ┌─────────┐                                 │
    │ PASSIVE │ ◄──── default / user sets ──────┤
    └────┬────┘                                 │
         │                                      │
         │ user triggers / auto (signal + threshold)
         ▼                                      │
    ┌───────────┐                               │
    │ ASSISTANT │ ◄──── user sets ──────────────┤
    └─────┬─────┘                               │
          │                                     │
          │ user triggers / sustained activity  │
          ▼                                     │
    ┌──────────┐                                │
    │ RESEARCH │ ◄──── user sets ───────────────┤
    └─────┬────┘                                │
          │                                     │
          │ user triggers                       │
          ▼                                     │
    ┌──────────┐                                │
    │   YOLO   │ ◄──── user sets ───────────────┘
    └──────────┘
```

### Automatic Transitions

Only one automatic transition is defined: Passive → Assistant when Nqita is directly addressed (a hotkey, voice trigger, or click). All other automatic mode changes are optional features that can be configured per-user.

All other transitions require explicit user action.

---

## Mode Transitions

### User-Triggered

Users can switch modes:
- Via a mode selector in the Full View panel
- Via a keyboard shortcut (configurable)
- Via a right-click context menu on the sprite
- Via a system tray menu (Windows/macOS/Linux)

### Mode Persistence

The active mode is written to disk on every transition. On startup, the last mode is restored.

File: `~/.config/nqita/state.json`
```json
{
  "mode": "RESEARCH",
  "lastTransition": "2024-11-01T12:00:00Z"
}
```

If the state file is missing or corrupt, Nqita defaults to Passive mode.

---

## Mode Configuration

Each mode supports per-mode configuration. These are stored in `~/.config/nqita/preferences.json`.

```json
{
  "modes": {
    "PASSIVE": {
      "reactionProbability": 0.07,
      "wanderIntervalMinutes": [5, 15],
      "cooldownSeconds": 120
    },
    "ASSISTANT": {
      "reactionProbability": 0.13,
      "wanderIntervalMinutes": null,
      "cooldownSeconds": 60
    },
    "RESEARCH": {
      "reactionProbability": 0.20,
      "wanderIntervalMinutes": null,
      "cooldownSeconds": 45,
      "autoOpenMiniBrowser": true
    },
    "YOLO": {
      "reactionProbability": 0.30,
      "wanderIntervalMinutes": [1, 5],
      "cooldownSeconds": 20,
      "autoOpenMiniBrowser": true
    }
  }
}
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `reactionProbability` | `float 0–1` | Base probability of reacting to a signal |
| `wanderIntervalMinutes` | `[min, max] \| null` | Range for random wander triggers; null disables wandering |
| `cooldownSeconds` | `int` | Minimum seconds between reactions |
| `autoOpenMiniBrowser` | `bool` | Whether to auto-open Mini Browser on relevant signals |

---

## Mode-Specific Behaviors

### Sprite Animations by Mode

| Mode | Dominant animations |
|------|-------------------|
| Passive | `idle_a`, `idle_b`, `idle_c`, `idle_d`, `sleeping` (on long idle) |
| Assistant | `idle_a`, `curious`, `bubble_idle`, `reaction` |
| Research | `researching`, `curious`, `excited` |
| YOLO | Full range, random selection weighted toward energetic animations |

### Reaction Types by Mode

| Reaction type | Passive | Assistant | Research | YOLO |
|---------------|---------|-----------|----------|------|
| Bubble comment | Rare | Common | Moderate | Frequent |
| Open Mini Browser | Never | Rare | Common | Frequent |
| Wander to edge | Rare | Never | Never | Frequent |
| Play excited animation | Never | Rare | Moderate | Common |

---

## Adding a New Mode

To add a mode to Nqita:

1. **Define the mode** in `src/modes/index.ts`:
```typescript
export const MODES = ['PASSIVE', 'ASSISTANT', 'RESEARCH', 'YOLO', 'MY_NEW_MODE'] as const;
export type Mode = typeof MODES[number];
```

2. **Add default configuration** in `src/modes/defaults.ts`:
```typescript
MY_NEW_MODE: {
  reactionProbability: 0.12,
  wanderIntervalMinutes: [3, 10],
  cooldownSeconds: 90,
  autoOpenMiniBrowser: false,
}
```

3. **Add mode behavior** in `src/modes/behaviors.ts`:
- Define which sprite animations are used
- Define which reaction types are enabled
- Define any mode-specific logic

4. **Add a mode icon** in the sprite assets:
- Optional: a visual indicator in the system tray / Full View panel

5. **Update transition rules** in `src/modes/transitions.ts` if the mode has special entry/exit conditions.

6. **Add mode to UI** in the mode selector component.

7. **Write tests** in `src/modes/__tests__/MY_NEW_MODE.test.ts`.

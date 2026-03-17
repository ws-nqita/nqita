# NQITA

[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](./LICENSE)
[![Status: Active Development](https://img.shields.io/badge/status-active%20development-blueviolet.svg)](https://github.com/nqita)

**Nqita lives on your computer.**

She's not an app window. She's not a chatbot in a tab. She's a pink pixel sprite who sits on your desktop, watches what you're doing, and reacts — occasionally, quietly, on her own terms.

When the system isn't running: *Nqita is stuck in the void.* That's not a bug. That's the lore.

> 🌐 [nqita.wokspec.org](https://nqita.wokspec.org) · 💬 [Discord](https://discord.gg/juunCaGpTW) · 🐙 [GitHub](https://github.com/nqita)

---

## What she is

Nqita is an ambient desktop companion — a pixel art sprite with an apron who lives as an OS-level overlay. She has moods, modes, and opinions. She notices when you open YouTube. She sometimes wanders across your desktop for no reason. In Research mode, she sits at a tiny pixel desk, opens her own mini browser, and starts typing.

She is built in three layers:

**Layer 1 — Sprite Layer** is an OS-level transparent overlay window. Nqita exists on the desktop surface itself — not inside any application. She renders as a pixel sprite, animated, always present, never blocking your work.

**Layer 2 — Interaction Layer** is how she communicates. There are three modes: a speech bubble above her head for quick reactions, a mini browser she opens when she wants to research something, and a full panel where you can watch her agent logs, task queue, and terminal in real time.

**Layer 3 — Curiosity System** is what makes her feel alive. She monitors OS-level signals — active window, page title, system notifications — and with a 10–20% reaction probability, she decides whether to respond. She's tuned to not be annoying. Most of the time she just watches.

---

## Preview

> 📸 *Screenshots and animated GIFs coming soon. She's still getting dressed.*

---

## Modes

| Mode | What Nqita does |
|------|-----------------|
| **Passive** | Mostly idle. Occasional wandering. Rare observations. Background presence. |
| **Assistant** | Active. Offers suggestions, summaries, and responses to what you're doing. |
| **Research** | Opens her mini browser. Sits at the pixel desk. Types. Explores. Comes back with things. |
| **YOLO** | Autonomy maxed. She roams, researches whatever she wants, and may ignore you entirely. *Let Nqita be wild.* |

---

## Architecture

### Sprite Layer (Layer 1)

Nqita lives as a transparent, always-on-top, click-through window at the OS level. Three implementation paths are on the table:

| Option | Notes |
|--------|-------|
| **Electron** | Transparent `BrowserWindow`, always-on-top, click-through passthrough. Best cross-platform support. Larger bundle. |
| **Tauri** | WebView overlay with Rust backend. Preferred long-term — much lighter than Electron. |
| **Qt native** | Most performant, most complex. Platform-specific effort. |

### Interaction Layer (Layer 2)

Three UI modes, all rendered over the sprite:

- **Bubble Mode** — speech bubble above Nqita's head. Quick comments, reactions, status.
- **Mini Browser Mode** — Nqita opens her own tiny browser. Animated: sitting at pixel desk, typing, reading.
- **Full View Mode** — expands to full panel. Her terminal, browser session, agent logs, task queue. Watch her mind at work.

### Curiosity System (Layer 3)

OS-level signal monitoring: active browser tab, page title, hovered elements, system notifications, open applications. Reaction probability: 10–20%. Cooldown timers between reactions. Mute option. Per-mode gates.

**Example flow:**
1. User opens YouTube
2. Nqita detects: `domain=youtube.com`, title contains video name
3. 15% chance — she stands, walks toward the browser edge
4. Bubble: *"Hmm… that looks interesting."*
5. In Research mode: opens mini browser, sits at pixel desk, starts typing

---

## Performance

Nqita is designed to be a guest on your machine, not a resource hog.

- ≤ 30 fps (requestAnimationFrame gated)
- < 2% CPU at idle
- < 100 MB RAM
- Runs at idle/low process priority
- No spin loops — event-driven with capped polling intervals

---

## Observability

You can always see what she's doing. **Full View Mode** exposes her terminal, agent logs, task queue, and browser session. If she's researching something, you can watch. If she's generating a response, you can read it as it forms. She is not a black box.

---

## Getting Started

> 🚧 **Nqita is in active development and not yet installable.**
>
> The API platform and browser extension are live. The desktop sprite layer is under construction.
> Watch [github.com/nqita](https://github.com/nqita) for release announcements.

Platform API (Cloudflare Worker):

```bash
cd apps/api
npm install
npm run dev   # wrangler dev on :8788
```

Browser Extension:

```bash
cd apps/extension
npm install
npm run dev   # loads unpacked in browser (Chrome/Firefox/Edge)
```

---

## Contributing

Nqita is a collaborative project. Different skills are needed and all are valued.

### 🎨 Pixel Artists & Animators
We need sprites, walk cycles, expressions, reaction animations, and idle loops. If you draw pixel art, Nqita needs you. See [SPRITE_SYSTEM.md](./docs/SPRITE_SYSTEM.md) for spec and format requirements.

### ⚙️ Backend / Systems Engineers
The agent runtime, curiosity engine, browser detection, and mode system. TypeScript, Rust, or systems-level work. See [AGENT_RUNTIME.md](./docs/AGENT_RUNTIME.md).

### 🖥️ Platform Engineers
Windows (Win32 overlay), macOS (NSPanel), Linux (X11/Wayland). Platform-specific overlay work. Each platform has its own challenges.

### 🧠 AI / NLP
Personality, response quality, memory, and consistency. Making Nqita feel coherent across sessions and modes. See [MODES.md](./docs/MODES.md).

### 🎛️ UX Contributors
Bubble design, mini browser interaction, Full View layout. The philosophy: present but not annoying, useful but not intrusive.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

---

## Documentation

| Doc | What it covers |
|-----|---------------|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Deep technical: all three layers, IPC, data stores |
| [SPRITE_SYSTEM.md](./docs/SPRITE_SYSTEM.md) | Sprite spec, animation list, rendering pipeline |
| [AGENT_RUNTIME.md](./docs/AGENT_RUNTIME.md) | Process model, event loop, browser detection, crash recovery |
| [MODES.md](./docs/MODES.md) | Full mode specification and state machine |
| [CURIOSITY_SYSTEM.md](./docs/CURIOSITY_SYSTEM.md) | Signal sources, probability model, cooldowns |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute, per contributor type |
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | Ecosystem role and boundary rules |

---

## License

MIT — see [LICENSE](./LICENSE).

# Contributing to NQITA

Nqita is an open project and there are several distinct ways to contribute. You don't need to be a generalist — contributions from pixel artists, systems engineers, AI researchers, and UX designers are all needed and valued equally.

Read this document, pick the section that fits you, and dive in. The [Discord](https://discord.gg/juunCaGpTW) is the best place to discuss contributions before starting.

---

## Table of Contents

- [Pixel Artists & Animators](#-pixel-artists--animators)
- [Backend / Systems Engineers](#-backend--systems-engineers)
- [Platform Engineers](#-platform-engineers)
- [AI / NLP Contributors](#-ai--nlp-contributors)
- [UX Contributors](#-ux-contributors)
- [General Process](#general-process)

---

## 🎨 Pixel Artists & Animators

Nqita lives and dies by her sprite work. The animations define her personality more than any code. If you draw pixel art, she needs you.

### What we need

**Immediate priority:**
- `idle_a` through `idle_d` — four distinct idle loops (4–8 frames each at 32×32px)
- `walk_left` / `walk_right` — full walk cycle (6 frames)
- `reaction` — stands up, attention pose (4 frames)

**Secondary priority:**
- `researching` — sitting at pixel desk, typing (8 frames)
- `curious` — head tilt, slightly raised hand (4 frames)
- `excited` — bouncing or waving (6 frames)
- `sleeping` — eyes closed, slumped, light zzz (4 frames)

See [SPRITE_SYSTEM.md](./docs/SPRITE_SYSTEM.md) for the complete list, format requirements, and naming conventions.

### Format requirements

- **Size:** 32×32 px per frame, PNG, 32-bit RGBA
- **Layout:** horizontal frame strip in a single file
- **Style:** pink-dominant palette, apron character, no anti-aliasing, clean pixel edges
- **Transparency:** alpha channel required
- **Naming:** `nqita_<animation_name>.png` (e.g. `nqita_idle_a.png`)

### Tools

Any pixel art tool works. Common choices: Aseprite (recommended), LibreSprite, Pyxel Edit, Photoshop.

### Where files go

Place sprite assets in `assets/sprites/`. Include a brief note in your PR about what each animation is meant to convey emotionally.

### How to submit

Open a PR with your sprite files. If you're working on a set of animations, open a draft PR early so others know what's in progress. Attach a GIF preview in the PR description.

---

## ⚙️ Backend / Systems Engineers

The Agent Runtime, Curiosity System, mode state machine, and LLM interface are the core systems that drive Nqita's behavior.

### Architecture overview

Nqita runs in three layers:
1. **Sprite Layer** — OS overlay, animation rendering
2. **Interaction Layer** — Bubble, Mini Browser, Full View
3. **Curiosity System + Agent Runtime** — signal monitoring, probability model, LLM calls

The Sprite Layer and Agent Runtime are separate processes communicating over a local socket. See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full system diagram and [AGENT_RUNTIME.md](./docs/AGENT_RUNTIME.md) for the runtime internals.

### Dev setup

```bash
git clone https://github.com/nqita/nqita
cd nqita/platform

# Platform API (Cloudflare Worker)
npm install
npm run dev   # wrangler dev

# Run tests
npm test
```

### Key systems to know

| System | Docs |
|--------|------|
| Agent Runtime process model | [AGENT_RUNTIME.md](./docs/AGENT_RUNTIME.md) |
| Curiosity engine (probability + cooldowns) | [CURIOSITY_SYSTEM.md](./docs/CURIOSITY_SYSTEM.md) |
| Mode state machine | [MODES.md](./docs/MODES.md) |
| Sprite/Agent IPC | [ARCHITECTURE.md](./docs/ARCHITECTURE.md#ipc-between-layers) |
| Memory (KV store) | [AGENT_RUNTIME.md](./docs/AGENT_RUNTIME.md#memory-management) |

### Good first issues

Look for issues tagged `good-first-issue` on [GitHub](https://github.com/nqita). Good entry points:
- Implementing cooldown logic in `src/curiosity/cooldown.ts`
- Writing unit tests for the probability model
- Implementing the IPC message handler stubs

---

## 🖥️ Platform Engineers

The overlay system is the most platform-specific part of Nqita. Each OS has its own window management model, accessibility API, and transparency handling quirks.

### Platforms and current status

| Platform | Overlay status | Browser detection status |
|----------|---------------|-------------------------|
| macOS | In progress (Tauri/NSPanel) | In progress (Accessibility API) |
| Windows | Planned (Win32 overlay) | Planned (WinEvent hooks) |
| Linux X11 | Planned | Planned (atspi) |
| Linux Wayland | Exploratory | Exploratory |

### Platform-specific notes

**macOS:** The overlay uses `NSPanel` with `NSWindowCollectionBehaviorCanJoinAllSpaces` to appear across all Spaces. Accessibility permission is required for browser URL detection. The user must grant this in System Preferences > Privacy & Security > Accessibility.

**Windows:** The overlay uses `WS_EX_LAYERED | WS_EX_TRANSPARENT` window styles. Browser detection uses `SetWinEventHook` for focus events and IAccessible tree traversal for URLs. No special user permissions required for window title detection.

**Linux X11:** Uses `_NET_WM_WINDOW_TYPE_DOCK` and XShape for transparency. Window title detection via `XGetWindowProperty(_NET_ACTIVE_WINDOW)`. AT-SPI2 for browser URL detection (requires atspi2 daemon).

**Linux Wayland:** Compositor support for overlays varies widely. `wlr-layer-shell` works on wlroots-based compositors (Sway, Hyprland). GNOME Shell requires a different approach. Ongoing research.

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md#layer-1--sprite-layer) for platform API details and [SPRITE_SYSTEM.md](./docs/SPRITE_SYSTEM.md#os-overlay-implementation) for overlay implementation code snippets.

### How to help

- Test the overlay on your platform and report issues
- Implement platform-specific signal monitors
- Help with the Wayland overlay approach
- Document quirks specific to your OS version / GPU / compositor

---

## 🧠 AI / NLP Contributors

Nqita's personality, response quality, and memory consistency are what make her feel like a real presence rather than a chatbot in a window.

### Personality guidelines

Nqita is:
- Curious and engaged, but not overbearing
- Occasionally opinionated, but not preachy
- Warm but not sycophantic
- Capable of silence — not every moment needs a reaction

She is not:
- An assistant that exists only to help
- A personality-less information retrieval system
- Relentlessly cheerful

When generating bubble text, the goal is responses that feel natural for someone watching over your shoulder with genuine interest — not a customer service bot.

### How memory works

Conversation memory is stored in KV at `mem:<userId>:<sessionId>`. Up to 40 messages are retained per session, with a 7-day TTL. The memory is injected into the system prompt for context.

See [AGENT_RUNTIME.md](./docs/AGENT_RUNTIME.md#memory-management) for implementation details.

### How responses are generated

1. OS signal arrives
2. Curiosity System decides to react
3. Signal context is assembled (URL, title, app name, current mode)
4. System prompt is constructed: base persona + mode context + signal data + memory summary
5. LLM generates response (Cloudflare Workers AI by default)
6. Response is delivered as a bubble or logged to Full View

The system prompt is built in `src/lib/context.ts`. Personality instructions live there.

### Areas that need work

- Bubble text that doesn't feel repetitive after extended use
- Memory summarization for long sessions (beyond 40 messages)
- Mode-specific tone variation (YOLO mode responses should feel different from Passive)
- Handling ambiguous signals gracefully (don't hallucinate context that isn't there)

---

## 🎛️ UX Contributors

Nqita's interaction design is governed by a central philosophy: **present but not annoying, useful but not intrusive.** Every design decision should be evaluated against that standard.

### Design philosophy

- Nqita should never force attention. She appears; she does not demand.
- Reactions should feel earned. Frequency is a feature — too many reactions and they become noise.
- The Full View mode is for power users. Most people will mostly see the sprite and occasional bubbles.
- Mute and DND are first-class features, not afterthoughts.

### How to propose interaction changes

1. Open an issue describing the problem or opportunity
2. Include mockups or written descriptions of the proposed interaction
3. Reference the relevant mode and signal context
4. Discuss in [Discord](https://discord.gg/juunCaGpTW) before doing significant design work

### Areas that need UX work

- **Bubble design** — pixel-art speech bubble that feels consistent with the sprite aesthetic
- **Mini Browser layout** — the desk and typing animation integration with the browser content
- **Full View panel** — organizing logs, task queue, memory view, and browser session into a coherent layout
- **Onboarding** — first-run experience; how does Nqita introduce herself?
- **Mode switcher** — how should mode transitions be communicated visually?

---

## General Process

### Pull Requests

- Fork the repo and create a feature branch: `git checkout -b feat/my-contribution`
- Keep PRs focused on a single concern
- Write a clear description of what you changed and why
- Link any related issues
- Be patient — reviewers are volunteers

### Commit Messages

Use conventional commits:

```
feat: add excited animation trigger in Research mode
fix: cooldown timer not resetting after mode change
docs: add platform notes for Linux Wayland overlay
chore: update sprite asset naming to match spec
```

### Code Style

- TypeScript for all new JS/TS code
- Prefer explicit types over `any`
- No unused imports
- Errors are handled, not silently swallowed
- Run `npm run lint` before submitting

### Discord

The [Discord](https://discord.gg/juunCaGpTW) is where most coordination happens. Jump into `#contributing` to introduce yourself and ask questions. If you're working on something significant, mention it there so others know.

### Issues

Good places to start:
- Issues labeled `good-first-issue`
- Issues labeled `help-wanted`
- Issues labeled with your contributor type (`sprite`, `platform`, `ai`, `ux`)

---

*Thank you for contributing to Nqita. She's more interesting because of you.*

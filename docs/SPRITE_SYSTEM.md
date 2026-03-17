# NQITA — Sprite System

## Sprite Sheet Specification

### Format

| Property | Value |
|----------|-------|
| File format | PNG, 32-bit RGBA |
| Sprite size | 32×32 px per frame (base), 64×64 px optional HiDPI variant |
| Sheet layout | Horizontal strip per animation sequence |
| Naming convention | `nqita_<animation>[@2x].png` |
| Color palette | Pink-dominant, limited palette (~16–32 colors), no anti-aliasing |
| Background | Transparent (alpha channel required) |

### File Naming Convention

```
assets/sprites/
  nqita_idle_a.png          # idle variant A (4-frame strip)
  nqita_idle_b.png          # idle variant B
  nqita_idle_c.png          # idle variant C
  nqita_idle_d.png          # idle variant D
  nqita_walk_left.png       # walk cycle, left direction
  nqita_walk_right.png      # walk cycle, right direction
  nqita_sit.png             # sit down / settle
  nqita_curious.png         # head tilt, looking around
  nqita_excited.png         # bouncing/waving
  nqita_sleeping.png        # eyes closed, slumped
  nqita_researching.png     # at desk, typing
  nqita_reaction.png        # stands up, attention
  nqita_bubble_idle.png     # talking / bubble visible
  nqita_distracted.png      # looking away
  nqita_observing.png       # leaning forward, watching

  # HiDPI variants (optional, 64×64px)
  nqita_idle_a@2x.png
  ...
```

---

## Required Animations

### Priority 1 — Core (required before first release)

| Animation | Frames | FPS | Loop | Notes |
|-----------|--------|-----|------|-------|
| `idle_a` | 4 | 4 | Yes | Subtle breathing, blink |
| `idle_b` | 6 | 4 | Yes | Looks left, returns |
| `idle_c` | 6 | 4 | Yes | Adjusts apron |
| `idle_d` | 8 | 4 | Yes | Yawns or stretches |
| `walk_left` | 6 | 8 | Yes | Full walk cycle, left |
| `walk_right` | 6 | 8 | Yes | Full walk cycle, right (can mirror `walk_left`) |
| `reaction` | 4 | 8 | No | Stands up from idle, attention pose |

### Priority 2 — Interaction (required for full feature set)

| Animation | Frames | FPS | Loop | Notes |
|-----------|--------|-----|------|-------|
| `sit` | 4 | 6 | No | Transition into sitting |
| `researching` | 8 | 6 | Yes | At pixel desk, typing. Used in Mini Browser mode. |
| `curious` | 4 | 4 | No | Head tilt, hand raised slightly |
| `excited` | 6 | 10 | No | Bouncing or waving |
| `bubble_idle` | 4 | 4 | Yes | Neutral talking pose while bubble is visible |

### Priority 3 — Ambient (nice to have)

| Animation | Frames | FPS | Loop | Notes |
|-----------|--------|-----|------|-------|
| `sleeping` | 4 | 2 | Yes | Eyes closed, zzz — fires during system idle |
| `distracted` | 6 | 4 | No | Looks away, daydreaming |
| `observing` | 4 | 4 | Yes | Leaning forward, watching |

---

## OS Overlay Implementation

### Electron

```javascript
const win = new BrowserWindow({
  transparent: true,
  frame: false,
  alwaysOnTop: true,
  skipTaskbar: true,
  resizable: false,
  webPreferences: { nodeIntegration: true }
});

// Click-through by default; enable interaction on hover
win.setIgnoreMouseEvents(true, { forward: true });

// Re-enable input on interaction zones
ipcMain.on('set-interactive', () => win.setIgnoreMouseEvents(false));
ipcMain.on('set-passthrough', () => win.setIgnoreMouseEvents(true, { forward: true }));
```

The renderer uses a `<canvas>` element to draw sprite frames. Mouse position is tracked globally; when the cursor enters the sprite bounding box, the main process is notified to switch off click-through.

### Tauri

```rust
// src-tauri/src/main.rs
let window = tauri::Builder::default()
    .setup(|app| {
        let win = app.get_window("sprite").unwrap();
        win.set_decorations(false)?;
        win.set_always_on_top(true)?;
        win.set_skip_taskbar(true)?;
        // Transparent background via window config in tauri.conf.json
        Ok(())
    });
```

```json
// tauri.conf.json
{
  "windows": [{
    "label": "sprite",
    "transparent": true,
    "decorations": false,
    "alwaysOnTop": true
  }]
}
```

Click-through is managed via `window.set_ignore_cursor_events(true/false)` called from the Rust side in response to frontend events.

### Platform Notes

| Platform | Overlay mechanism | Known issues |
|----------|------------------|-------------|
| Windows | `WS_EX_LAYERED \| WS_EX_TRANSPARENT` | DPI scaling on HiDPI monitors |
| macOS | `NSPanel`, `NSWindowCollectionBehaviorCanJoinAllSpaces` | Spaces/Mission Control visibility settings |
| Linux X11 | `_NET_WM_WINDOW_TYPE_DOCK` or shaped window | Compositor required for transparency |
| Linux Wayland | `wlr-layer-shell` or `gtk-layer-shell` | Compositor support varies |

---

## Rendering Loop

```javascript
const TARGET_FPS = 30;
const FRAME_BUDGET_MS = 1000 / TARGET_FPS; // ~33ms

let lastFrameTime = 0;
let frameSkipCount = 0;

function renderLoop(timestamp) {
  const elapsed = timestamp - lastFrameTime;

  if (elapsed >= FRAME_BUDGET_MS) {
    // Backoff: if the last frame took >50ms, skip one render cycle
    if (elapsed > 50 && frameSkipCount < 2) {
      frameSkipCount++;
    } else {
      frameSkipCount = 0;
      renderFrame();
      lastFrameTime = timestamp;
    }
  }

  requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
```

`renderFrame()` draws the current animation frame to the canvas. The animation state machine advances the frame index based on the sequence's configured FPS, independently of the render loop.

### Load-Based Backoff

When the system is under CPU pressure (detected via `performance.now()` drift or a dedicated system load monitor), the renderer drops to 15 fps automatically.

```javascript
// Every 10 seconds, measure average frame time
// If avg > 45ms: reduce target to 15fps
// If avg < 25ms and current target is 15fps: restore to 30fps
```

---

## Click-Through Handling

By default, the sprite window ignores all mouse input. User input passes through to whatever is underneath.

**Interaction zones** are regions where Nqita can be clicked or hovered. They are defined as bounding boxes relative to the sprite's current position:

```javascript
const interactionZones = [
  { x: 0, y: 0, w: 32, h: 32, action: 'select' },       // whole sprite — click to focus
  { x: 8, y: 0, w: 16, h: 8, action: 'bubble-dismiss' } // head area — dismiss bubble
];
```

When the cursor enters an interaction zone, the window disables click-through and forwards the event to the interaction handler. When the cursor leaves, click-through is re-enabled.

This ensures Nqita is never accidentally in the way of normal desktop work.

---

## Performance Targets

| Metric | Target | How to measure |
|--------|--------|---------------|
| CPU at idle (sprite visible, no animation) | < 1% | `top` / Task Manager / Activity Monitor |
| CPU during active animation | < 2% | Same |
| RAM usage (renderer process) | < 80 MB | Process memory via OS tools |
| Frame render time | < 10 ms | `performance.now()` in render loop |
| Time to first frame | < 500 ms from launch | Stopwatch from process start |

### Profiling

**Electron:**
Open DevTools in the renderer (`win.webContents.openDevTools()`). Use the Performance tab to record a 5-second trace during animation. Look for long tasks (>33ms) in the main thread.

**Tauri:**
Use system profilers (`Instruments` on macOS, `perf` on Linux, `WPR` on Windows) on the WebView2/WebKit process.

**CPU benchmarking:**
```bash
# macOS / Linux — sample CPU usage of the sprite process over 30 seconds
pidstat -p <PID> 1 30

# Windows — use Get-Process in PowerShell
Get-Process nqita | Select-Object CPU, WorkingSet
```

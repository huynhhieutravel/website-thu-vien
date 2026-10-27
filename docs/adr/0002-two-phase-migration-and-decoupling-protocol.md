# 0002 - Two-Phase Migration and Engine Decoupling Protocol

## Status: Approved (2026-10-27)

## Context
When cloning dynamic, award-winning web applications (like Orvane, Meridian, Pace, Norrvik), two recurring failure modes occurred:
1. **Errors in the Original Clone Route:** The original site was built as a Next.js dynamic app. When saved statically, links to server-side image optimization endpoints (`/_next/image?url=...`), dynamic API routes, or React 18 hydration expectation caused broken images, infinite preloaders, or console hydration errors.
2. **Breakdowns in the Astro Native Route:** When converting the page to Astro native components, previous agents attempted to "run Next.js client bundles inside Astro" or blindly copied HTML without understanding where the interactive 3D WebGL engine lived. When React hydration failed, agents deleted scripts to clear console errors, which inadvertently destroyed the interactive 3D WebGL drone.

## Decision
We enforce a strict **Two-Phase Migration & Decoupling Protocol** for all current and future website conversions:

### Phase 1: Isolated Raw Freeze (Cover Gốc)
- Keep the crawled HTML and bundles completely intact in `v2/src/raw/`.
- Sanitize server-only dependencies statically (e.g. rewrite `/_next/image?url=X` to direct asset paths `X` via regex/AST transforms).
- Serve under a dedicated route (e.g. `/orvane-original`).
- Use headless Chrome with hardware GPU acceleration to capture baseline screenshots across all scroll checkpoints.
- This route serves as the immutable **Visual Ground Truth Baseline**.

### Phase 2: Architectural Deconstruction & Engine Decoupling (Astro Native)
- **Identify Interactive Engines Early:** Audit the source before componentization. Separate static DOM markup from runtime engines (WebGL, Three.js, Canvas, GSAP Tickers).
- **Decouple the Engine:** Extract the render loop and animation ticker out of framework lifecycles (`useEffect`, React state) into a standalone native module (`mount(canvas)`, `onMeasure(fn)`, `subscribe(fn)`).
- **Astro Native Layout:** The Astro layout provides pure HTML structure and a dedicated `<canvas>`, without any React root (`<div id="__next">`) or framework hydration scripts.
- **Client Script Binding:** Launch the decoupled engine using standard browser DOM events (`DOMContentLoaded`, `ResizeObserver`, scroll listeners).

### Phase 3: Strict Visual QA Gate
- No task is marked complete without running a real GPU-enabled browser to capture and inspect screenshots of both routes at identical scroll positions.
- Verify that interactive features (3D WebGL, text reveals, dials) match the Ground Truth Baseline.

## Consequences
- Eliminates recurring React hydration crashes (#418) permanently.
- Completely prevents accidental loss of 3D WebGL scenes or complex canvas animations.
- Provides a clear, repeatable standard operating procedure (SOP) for all future clone projects.

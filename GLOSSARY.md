# Glossary

### Orvane 3D Stage
The central Three.js WebGL canvas (`class ea`) rendered at `fixed left-0 top-0 z-20` across the entire viewport. It procedurally models the Orvane L4 autonomous drone with 4 spinning rotors, dual LiDAR sensors, camera gimbal, dynamic shadows, and laser sweep cones. It synchronizes with scroll progress to transition the drone through each section (`Hero`, `Promise`, `Gear`, `Numbers`, `Solutions`, `Capabilities`, `Controller`, `Terrain`, `Footer`).

### Astro Native Route (`/orvane`)
The componentized, clean Astro implementation (`v2/src/pages/orvane.astro`) split into modular components (`Hero.astro`, `Gear.astro`, `Solutions.astro`, etc.) and native client scripts, optimized for standalone performance without Next.js framework lock-in.

### Original Clone Route (`/orvane-original`)
The raw, 1-to-1 cloned implementation (`v2/src/pages/orvane-original.astro`) that mounts the untouched Next.js/Turbopack bundle via raw HTML streaming (`set:html={rawHtml}`).

### Two-Phase Migration Workflow
The mandatory 2-step protocol for cloning and migrating modern web applications:
1. **Phase 1 (Cover Gốc / Raw Freeze Clone):** Capture and serve the website 1-to-1 exactly as crawled, fixing only environment-specific dead ends (such as remote image endpoints). Establish this as the *Visual Ground Truth Baseline*.
2. **Phase 2 (Astro Native Route):** Deconstruct HTML into Astro components, extract standalone engines (WebGL/Canvas/Ticker), and eliminate framework hydration runtime.

### Hydration Boundary Clash
The fatal conflict that occurs when a monolithic client-side framework (React/Next.js) attempts to hydrate HTML emitted by a multi-page compiler (Astro). React requires exact byte-for-byte matching of DOM structure, whitespace, and comment nodes (`<!-- -->`). When Astro optimizes or components re-render, React hydration aborts with error #418 and wipes the interactive tree.

### Engine Decoupling Pattern
The architectural practice of extracting interactive WebGL, Canvas, and animation ticker loops from framework lifecycles (`useEffect`, `onMounted`) into pure JavaScript modules with explicit lifecycle methods: `mount(canvas)`, `step(progress)`, `resize(w, h)`, and `destroy()`.

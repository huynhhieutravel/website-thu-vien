# 0001 - Orvane Standalone Three.js 3D Stage on Astro Native

## Status: Implemented & Verified (2026-10-27)

## Context
The original Orvane site features an interactive 3D WebGL drone stage (`class ea` in Three.js) rendered on a viewport-fixed canvas. When migrating to Astro native components (`/orvane`), running the full Next.js/React 18 hydration caused text mismatch errors (`Minified React error #418`) due to Astro's compiler stripping inline whitespace and comment nodes (`<!-- -->`). Completely removing Next.js scripts eliminated the error but inadvertently removed the 3D drone engine.

## Decision
For `/orvane` (Astro Native Route), we decouple the Three.js 3D WebGL stage from Next.js and React 18. The 3D stage (`class ea`) is mounted directly to the fixed canvas (`<canvas class="pointer-events-none fixed left-0 top-0 z-20 block">`) via a standalone client script that measures scroll positions across the native Astro sections and animates the 3D drone.

## Consequences
- Preserves 100% component-based native Astro architecture.
- Eliminates React 18 hydration mismatch errors permanently.
- Restores 60fps real-time 3D drone flight, propeller rotation, and LiDAR cone effects across all scroll sections.
- The raw clone route (`/orvane-original`) remains untouched as the 1-to-1 reference implementation.

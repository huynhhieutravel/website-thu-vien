# Glossary

### Orvane 3D Stage
The central Three.js WebGL canvas (`class ea`) rendered at `fixed left-0 top-0 z-20` across the entire viewport. It procedurally models the Orvane L4 autonomous drone with 4 spinning rotors, dual LiDAR sensors, camera gimbal, dynamic shadows, and laser sweep cones. It synchronizes with scroll progress to transition the drone through each section (`Hero`, `Promise`, `Gear`, `Numbers`, `Solutions`, `Capabilities`, `Controller`, `Terrain`, `Footer`).

### Astro Native Route (`/orvane`)
The componentized, clean Astro implementation (`v2/src/pages/orvane.astro`) split into modular components (`Hero.astro`, `Gear.astro`, `Solutions.astro`, etc.) and native client scripts, optimized for standalone performance without Next.js framework lock-in.

### Original Clone Route (`/orvane-original`)
The raw, 1-to-1 cloned implementation (`v2/src/pages/orvane-original.astro`) that mounts the untouched Next.js/Turbopack bundle via raw HTML streaming (`set:html={rawHtml}`).

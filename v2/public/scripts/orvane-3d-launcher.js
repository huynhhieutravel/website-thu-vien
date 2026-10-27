// v2/public/scripts/orvane-3d-launcher.js
// Standalone Three.js 3D WebGL Drone Stage Launcher for Orvane (Astro Native)

(function () {
  'use strict';

  // 1. Trigger Turbopack Module 5972 -> 36038 (Orvane 3D Drone Engine)
  (globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([
    "entry-orvane-launcher",
    {
      otherChunks: [
        "static/chunks/10cczt~50scth.js",
        "static/chunks/0gkpr.jrv0.2d.js",
        "static/chunks/0tcltbvz695lz.js",
        "static/chunks/07hb.czss9cjk.js"
      ],
      runtimeModuleIds: [5972]
    }
  ]);

  // 2. Auto-mount Drone Stage on Fixed Canvas
  function mount() {
    const canvas = document.getElementById('orvane-3d-stage') || document.querySelector('canvas.fixed');
    if (canvas && typeof window.__mountOrvaneStage === 'function' && !canvas.__mounted) {
      canvas.__mounted = true;
      try {
        window.__mountOrvaneStage(canvas);
        console.log('[orvane] 3D Drone Stage mounted and rendering successfully!');
      } catch (err) {
        console.error('[orvane] Error mounting 3D stage:', err);
      }
    }
  }

  // Poll until module is evaluated and DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  const pollInterval = setInterval(() => {
    if (typeof window.__mountOrvaneStage === 'function' && (document.getElementById('orvane-3d-stage') || document.querySelector('canvas.fixed'))) {
      mount();
      clearInterval(pollInterval);
    }
  }, 40);

  setTimeout(() => clearInterval(pollInterval), 6000);
})();

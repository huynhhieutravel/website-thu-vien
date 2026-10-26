/**
 * Norrvik Architecture & Building Intelligence
 * Interactive Client Engine:
 * 1. Preloader point registration & countdown
 * 2. Real-time timezone clocks (Stockholm, Lisbon, New York)
 * 3. Mobile & Desktop Navigation Drawer
 * 4. 4-Scene Switcher (Capture, Energy, Living, Archive)
 * 5. High-Performance 3D Lidar Point Cloud Canvas with Orbit Controls
 * 6. Manifesto word-by-word scroll reveal
 * 7. Platform sticky scroll synchronization
 * 8. Motion pause toggle
 */

(function() {
  'use strict';

  function init() {
    initPreloader();
    initClocks();
    initMenu();
    initScenes();
    initHeroLidarCanvas();
    initPlatformLidarCanvas();
    initManifestoReveal();
    initPlatformScroll();
    initMotionToggle();
  }

  // 1. PRELOADER
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const counterEl = preloader.querySelector('.tabular-nums');
    const canvas = preloader.querySelector('canvas');
    let count = 0;
    let animFrame;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      const width = canvas.width = window.innerWidth;
      const height = canvas.height = window.innerHeight;

      // Draw random scanner dots
      const points = [];
      for (let i = 0; i < 180; i++) {
        points.push({
          x: width * 0.5 + (Math.random() - 0.5) * Math.min(width, 600),
          y: height * 0.5 + (Math.random() - 0.5) * Math.min(height, 500),
          alpha: Math.random() * 0.8 + 0.2,
          radius: Math.random() * 1.5 + 0.5
        });
      }

      function drawPreloader() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#f59e0b';
        points.forEach(p => {
          ctx.globalAlpha = p.alpha * Math.min(1, count / 80);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      drawPreloader();
    }

    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 8) + 4;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        if (counterEl) counterEl.textContent = '100';

        setTimeout(() => {
          preloader.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.7s';
          preloader.style.opacity = '0';
          setTimeout(() => {
            preloader.style.display = 'none';
            document.documentElement.removeAttribute('data-intro-stage');
          }, 700);
        }, 300);
      } else {
        if (counterEl) counterEl.textContent = count.toString().padStart(3, '0');
      }
    }, 45);
  }

  // 2. WORLD CLOCKS (Stockholm, Lisbon, NYC)
  function initClocks() {
    function updateTimes() {
      const now = new Date();

      function formatTz(timeZone) {
        try {
          return new Intl.DateTimeFormat('en-GB', {
            timeZone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).format(now);
        } catch (e) {
          return now.toTimeString().split(' ')[0];
        }
      }

      const sto = formatTz('Europe/Stockholm');
      const lis = formatTz('Europe/Lisbon');
      const nyc = formatTz('America/New_York');

      // Header STO clock
      const headerTime = document.querySelector('header time');
      if (headerTime) headerTime.textContent = sto;

      // Menu and footer timezone grids
      document.querySelectorAll('.grid').forEach(grid => {
        const text = grid.innerText;
        if (text.includes('Stockholm')) {
          const t = grid.querySelectorAll('p')[1];
          if (t && t.textContent.includes(':')) t.textContent = sto;
        } else if (text.includes('Lisbon')) {
          const t = grid.querySelectorAll('p')[1];
          if (t && t.textContent.includes(':')) t.textContent = lis;
        } else if (text.includes('New York')) {
          const t = grid.querySelectorAll('p')[1];
          if (t && t.textContent.includes(':')) t.textContent = nyc;
        }
      });
    }

    updateTimes();
    setInterval(updateTimes, 1000);
  }

  // 3. NAVIGATION DRAWER
  function initMenu() {
    const openBtn = document.querySelector('button[aria-label="Open menu"]');
    const menu = document.getElementById('site-menu');
    if (!menu) return;

    const closeBtn = menu.querySelector('button');

    function openMenu() {
      menu.classList.remove('invisible', 'opacity-0');
      menu.classList.add('visible', 'opacity-100');
      menu.setAttribute('aria-hidden', 'false');
      menu.removeAttribute('inert');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // Animate menu items
      const items = menu.querySelectorAll('nav[aria-label="Site"] li');
      items.forEach((item, idx) => {
        setTimeout(() => {
          item.classList.remove('translate-y-3', 'opacity-0');
          item.classList.add('translate-y-0', 'opacity-100');
        }, idx * 40);
      });
    }

    function closeMenu() {
      menu.classList.remove('visible', 'opacity-100');
      menu.classList.add('invisible', 'opacity-0');
      menu.setAttribute('aria-hidden', 'true');
      menu.setAttribute('inert', '');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 4. SCENE CONTROLLER
  const SCENES = [
    {
      num: '01',
      tag: '(01) Capture / Project / Live lidar',
      line1: 'The ground truth',
      line2: 'for every building.',
      desc: 'Norrvik scans, measures and models every structure we touch, then keeps the model alive after handover, measured to the millimetre.',
      points: '318 420 000',
      coverage: '100.0%',
      area: '9 400 m²',
      building: 'Hallmark Library / Umeå',
      fig: 'Fig. 01 / Hallmark Library / Point cloud',
      linkText: 'Explore a live model',
      linkHref: '/live-model?building=hallmark-library'
    },
    {
      num: '02',
      tag: '(02) Energy / Thermal / Heat loss mapping',
      line1: 'Warm air mapped,',
      line2: 'cold air kept out.',
      desc: 'Thermal sensors register west-facing envelope losses before fit-out, verified against night surveys.',
      points: '184 210 000',
      coverage: '98.4%',
      area: '7 800 m²',
      building: 'Casa Mares / Lisbon',
      fig: 'Fig. 02 / Casa Mares / Thermal array',
      linkText: 'Inspect thermal model',
      linkHref: '/live-model?building=casa-mares'
    },
    {
      num: '03',
      tag: '(03) Living / Acoustic / Occupancy tracking',
      line1: 'Spaces that listen',
      line2: 'before they speak.',
      desc: 'Real-time occupancy sensors and acoustic arrays stream spatial density to fine-tune air circulation.',
      points: '242 090 000',
      coverage: '99.2%',
      area: '5 200 m²',
      building: 'Ostra Cultural Hall / Gdańsk',
      fig: 'Fig. 03 / Ostra Hall / Acoustic cloud',
      linkText: 'View sensor feed',
      linkHref: '/live-model?building=ostra-cultural-hall'
    },
    {
      num: '04',
      tag: '(04) Archive / Studio index / Fifty-year record',
      line1: 'Every survey kept',
      line2: 'for the next decade.',
      desc: 'Millions of raw point cloud files and structural decision records cataloged for permanent access.',
      points: '412 800 000',
      coverage: '100.0%',
      area: '12 000 m²',
      building: 'Studio Index / Stockholm & Lisbon',
      fig: 'Fig. 04 / Studio Index / Lattice archive',
      linkText: 'Access archive lattice',
      linkHref: '/atlas'
    }
  ];

  let currentSceneIdx = 0;

  function initScenes() {
    const prevBtns = document.querySelectorAll('button[aria-label="Previous scene"]');
    const nextBtns = document.querySelectorAll('button[aria-label="Next scene"]');
    const sceneNavBtns = document.querySelectorAll('nav[aria-label="Scenes"] button');
    const mobileSceneBtns = document.querySelectorAll('.desk\\:hidden button[aria-label^="Scene"]');

    function applyScene(idx) {
      currentSceneIdx = (idx + SCENES.length) % SCENES.length;
      const data = SCENES[currentSceneIdx];

      // Update Hero Text
      const tagEl = document.querySelector('.hero-copy p.hud');
      if (tagEl) tagEl.textContent = data.tag;

      const line1 = document.querySelector('.hero-copy h1 .reveal-line:nth-child(1) .reveal-inner');
      const line2 = document.querySelector('.hero-copy h1 .reveal-line:nth-child(2) .reveal-inner');
      if (line1) line1.textContent = data.line1;
      if (line2) line2.textContent = data.line2;

      const descEl = document.querySelector('.hero-copy p.body-copy');
      if (descEl) descEl.textContent = data.desc;

      const linkEl = document.querySelector('.hero-copy a[href*="live-model"]');
      if (linkEl) {
        linkEl.setAttribute('href', data.linkHref);
        const span = linkEl.querySelector('span');
        if (span) span.childNodes[0].textContent = data.linkText;
      }

      // Update Top HUD labels
      const figLabel = document.querySelector('.cf-stage .hud.text-ink span:first-child');
      if (figLabel) figLabel.textContent = data.fig;

      // Update stats counters
      const dls = document.querySelectorAll('dl');
      dls.forEach(dl => {
        const dds = dl.querySelectorAll('dd .tabular-nums');
        if (dds[0]) dds[0].textContent = data.points;
        if (dds[1]) dds[1].textContent = data.coverage;
        if (dds[2]) dds[2].textContent = data.area;
      });

      // Update Desktop scene buttons
      sceneNavBtns.forEach((btn, i) => {
        const isCur = i === currentSceneIdx;
        btn.setAttribute('aria-current', isCur ? 'true' : 'false');
        btn.className = btn.className.replace(/text-ink|text-mute/g, isCur ? 'text-ink' : 'text-mute');
        const numSpan = btn.querySelector('.transition-colors');
        if (numSpan) {
          numSpan.className = numSpan.className.replace(/text-signal|text-mute/g, isCur ? 'text-signal' : 'text-mute');
        }
        const bar = btn.querySelector('span[aria-hidden="true"]');
        if (bar && bar.style) {
          bar.style.transform = isCur ? 'scaleX(1)' : 'scaleX(0)';
        }
      });

      // Update Mobile scene indicator
      const mobileStatus = document.querySelector('.desk\\:hidden p[aria-live="polite"]');
      if (mobileStatus) {
        mobileStatus.innerHTML = `<span class="text-signal">${data.num}</span><span class="text-mute">/ 04</span><span class="truncate">${data.tag.split('/')[1]?.trim() || ''}</span>`;
      }
      mobileSceneBtns.forEach((b, i) => {
        const isCur = i === currentSceneIdx;
        b.setAttribute('aria-current', isCur ? 'true' : 'false');
        const bar = b.querySelector('span');
        if (bar) bar.className = `block h-px w-full transition-colors duration-300 ${isCur ? 'bg-signal' : 'bg-hairline'}`;
      });

      // Notify 3D canvas of scene switch
      if (window.__nvSwitchScene) {
        window.__nvSwitchScene(currentSceneIdx);
      }
    }

    prevBtns.forEach(b => b.addEventListener('click', () => applyScene(currentSceneIdx - 1)));
    nextBtns.forEach(b => b.addEventListener('click', () => applyScene(currentSceneIdx + 1)));

    sceneNavBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => applyScene(i));
    });

    mobileSceneBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => applyScene(i));
    });

    // Keyboard Arrow navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') applyScene(currentSceneIdx + 1);
      if (e.key === 'ArrowLeft') applyScene(currentSceneIdx - 1);
    });
  }

  // 5. HERO 3D LIDAR POINT CLOUD CANVAS (60 FPS Native WebGL / 2.5D Renderer)
  function initHeroLidarCanvas() {
    const stage = document.querySelector('.cf-stage');
    if (!stage) return;

    let canvas = stage.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'absolute inset-0 h-full w-full pointer-events-auto';
      stage.insertBefore(canvas, stage.firstChild);
    }

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      width = canvas.width = stage.clientWidth;
      height = canvas.height = stage.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Procedural Point Cloud Generator
    let particles = [];
    let yaw = 36;
    let pitch = 32;
    let targetYaw = 36;
    let targetPitch = 32;
    let isDragging = false;
    let startX = 0, startY = 0;
    let scanLine = 0;
    let isPaused = false;

    function generatePoints(sceneType) {
      const pts = [];
      const cols = 28;
      const rows = 28;
      const layers = 5;

      for (let l = 0; l < layers; l++) {
        const yBase = (l - 2) * 32;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const x = (i - cols / 2) * 16;
            const z = (j - rows / 2) * 16;

            // Form architectural geometry
            let keep = false;
            if (l === 0) keep = (i % 3 === 0 && j % 3 === 0); // Ground grid
            else if (l === 1 || l === 2) keep = (i === 4 || i === cols - 5 || j === 4 || j === rows - 5); // Walls
            else if (l === 3) keep = (i % 2 === 0); // Beams / Trusses
            else if (l === 4) keep = (i > 8 && i < cols - 8 && j > 8 && j < rows - 8); // Skylight roof

            // Add building variation per scene
            if (sceneType === 1) { // Thermal Casa Mares
              keep = keep && (Math.sin(i * 0.4) > -0.2);
            } else if (sceneType === 2) { // Cultural Hall
              keep = keep && (Math.cos(j * 0.3) > -0.4);
            } else if (sceneType === 3) { // Archive Lattice
              keep = (i % 4 === 0 && j % 4 === 0);
            }

            if (keep) {
              pts.push({
                x0: x,
                y0: yBase,
                z0: z,
                x: x,
                y: yBase,
                z: z,
                color: (l === 3) ? '#f59e0b' : (sceneType === 1 ? '#38bdf8' : '#e2e8f0'),
                size: l === 3 ? 1.8 : 1.2,
                alpha: Math.random() * 0.5 + 0.5
              });
            }
          }
        }
      }

      // Add ground ring scan points
      for (let a = 0; a < Math.PI * 2; a += 0.08) {
        const r = 260 + Math.random() * 14;
        pts.push({
          x0: Math.cos(a) * r,
          y0: 80,
          z0: Math.sin(a) * r,
          x: Math.cos(a) * r,
          y: 80,
          z: Math.sin(a) * r,
          color: '#64748b',
          size: 1,
          alpha: 0.35
        });
      }

      return pts;
    }

    particles = generatePoints(0);

    window.__nvSwitchScene = function(idx) {
      particles = generatePoints(idx);
    };

    // Orbit Drag Interaction
    stage.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      stage.setPointerCapture?.(e.pointerId);
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      targetYaw += dx * 0.4;
      targetPitch = Math.max(5, Math.min(80, targetPitch - dy * 0.3));
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener('pointerup', (e) => {
      isDragging = false;
      try { stage.releasePointerCapture?.(e.pointerId); } catch(err) {}
    });

    // Render loop
    const readoutYawPitch = document.querySelector('.intro-readout p.text-ink span');
    const readoutScan = document.querySelector('.intro-readout p.text-mute span');

    function render() {
      if (!isPaused) {
        // Inertia damping
        yaw += (targetYaw - yaw) * 0.08;
        pitch += (targetPitch - pitch) * 0.08;

        if (!isDragging) {
          targetYaw += 0.12; // Gentle auto-orbit
        }

        scanLine = (scanLine + 1.2) % (width + 200);
      }

      ctx.clearRect(0, 0, width, height);

      const radYaw = (yaw * Math.PI) / 180;
      const radPitch = (pitch * Math.PI) / 180;
      const cosY = Math.cos(radYaw);
      const sinY = Math.sin(radYaw);
      const cosP = Math.cos(radPitch);
      const sinP = Math.sin(radPitch);

      const fov = 420;
      const cx = width / 2;
      const cy = height / 2 + 30;

      // Draw scan plane line
      const scanX = scanLine - 100;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      // Project and draw 3D points
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 3D Rotation
        const rx = p.x0 * cosY - p.z0 * sinY;
        const rz = p.x0 * sinY + p.z0 * cosY;
        const ry = p.y0 * cosP - rz * sinP;
        const finalZ = p.y0 * sinP + rz * cosP + 450;

        if (finalZ <= 10) continue;

        const scale = fov / finalZ;
        const px = cx + rx * scale;
        const py = cy + ry * scale;

        // Scanner highlight wave
        const distToScan = Math.abs(px - scanX);
        const scanBoost = distToScan < 30 ? (1 - distToScan / 30) : 0;

        ctx.fillStyle = scanBoost > 0 ? '#f59e0b' : p.color;
        ctx.globalAlpha = Math.min(1, p.alpha + scanBoost * 0.6);

        const r = (p.size * scale * (1 + scanBoost * 0.8));
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.7, r), 0, Math.PI * 2);
        ctx.fill();
      }

      // Update HUD
      if (readoutYawPitch) {
        const yNorm = Math.round(((yaw % 360) + 360) % 360).toString().padStart(3, '0');
        const pNorm = Math.round(pitch).toString().padStart(2, '0');
        readoutYawPitch.textContent = `Yaw ${yNorm} / Pitch ${pNorm}`;
      }
      if (readoutScan) {
        const pct = Math.round((scanLine / (width + 200)) * 100).toString().padStart(3, '0');
        readoutScan.textContent = `Scan 0${currentSceneIdx + 1} / ${pct}%`;
      }

      requestAnimationFrame(render);
    }

    render();
  }

  // 6. PLATFORM STICKY LIDAR CANVAS
  function initPlatformLidarCanvas() {
    const container = document.querySelector('#platform .sticky div[role="img"]');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 h-full w-full';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let angle = 0;
    function drawPlatformCanvas() {
      angle += 0.01;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      ctx.fillStyle = '#f59e0b';

      for (let i = 0; i < 90; i++) {
        const a = i * 0.2 + angle;
        const r = 60 + (i % 6) * 24;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a * 0.8) * (r * 0.6);

        ctx.globalAlpha = 0.2 + (i % 5) * 0.15;
        ctx.beginPath();
        ctx.arc(x, y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(drawPlatformCanvas);
    }
    drawPlatformCanvas();
  }

  // 7. MANIFESTO WORD REVEAL ON SCROLL
  function initManifestoReveal() {
    const words = document.querySelectorAll('.manifesto-word');
    const manifestoSec = document.getElementById('manifesto');
    if (!words.length || !manifestoSec) return;

    window.addEventListener('scroll', () => {
      const rect = manifestoSec.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));

      const activeWordCount = Math.floor(scrollProgress * words.length);
      words.forEach((w, i) => {
        if (i <= activeWordCount) {
          w.style.color = '#FBF9F1';
          w.style.opacity = '1';
        } else {
          w.style.color = '#4A4843';
          w.style.opacity = '0.35';
        }
      });

      // Update vertical progress line
      const bar = manifestoSec.querySelector('.origin-top');
      if (bar) {
        bar.style.transform = `scaleY(${scrollProgress})`;
      }
    }, { passive: true });
  }

  // 8. PLATFORM STEP SCROLL SYNCHRONIZATION
  function initPlatformScroll() {
    const steps = document.querySelectorAll('#platform ol li[data-step]');
    const indicators = document.querySelectorAll('#platform .sticky .bottom-8 span');
    const figNum = document.querySelector('#platform .sticky .hud.text-ink');

    window.addEventListener('scroll', () => {
      let activeIndex = 0;
      steps.forEach((step, i) => {
        const rect = step.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5) {
          activeIndex = i;
        }
      });

      // Highlight active step
      steps.forEach((s, idx) => {
        const isCur = idx === activeIndex;
        const card = s.querySelector('div[data-reveal]');
        if (card) {
          card.classList.toggle('desk:opacity-35', !isCur);
        }
        const num = s.querySelector('.transition-colors');
        if (num) {
          num.className = `transition-colors duration-500 ${isCur ? 'text-signal' : 'text-mute'}`;
        }
      });

      // Update sticky indicators
      indicators.forEach((ind, idx) => {
        const isCur = idx === activeIndex;
        const line = ind.querySelector('.h-px');
        const text = ind.querySelector('.hud');
        if (line) line.className = `h-px w-full transition-colors duration-500 ${isCur ? 'bg-signal' : 'bg-hairline'}`;
        if (text) text.className = `hud transition-colors duration-500 ${isCur ? 'text-ink' : 'text-mute'}`;
      });

      if (figNum) {
        figNum.innerHTML = `Fig. 07.${activeIndex + 1} / Capture`;
      }
    }, { passive: true });
  }

  // 9. MOTION TOGGLE
  function initMotionToggle() {
    const pauseBtns = document.querySelectorAll('button[aria-label="Pause all motion"], button[aria-label="Pause scene"]');
    let isPaused = false;

    pauseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        isPaused = !isPaused;
        btn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
        btn.setAttribute('title', isPaused ? 'Resume all motion' : 'Pause all motion');
        document.documentElement.setAttribute('data-motion', isPaused ? 'paused' : 'running');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

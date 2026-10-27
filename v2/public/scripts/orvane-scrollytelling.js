/**
 * Orvane Autonomous LiDAR Drones - Native Scrollytelling & Interactive Engine
 * Provides authentic 60fps text-reveal, mask-inner title reveals, radar dials,
 * authentic LiDAR solutions visualization & tab interactivity.
 */
(function() {
  'use strict';

  function clamp(val, min = 0, max = 1) {
    return Math.min(max, Math.max(min, val));
  }

  function initOrvane() {
    // -------------------------------------------------------------
    // 1. MASK-INNER HEADINGS REVEAL (Gear, Solutions, Capabilities, etc.)
    // -------------------------------------------------------------
    const maskInners = document.querySelectorAll('.mask-inner[data-mask-inner], .mask-inner');
    const sectionsWithMask = document.querySelectorAll('section');

    function updateMaskInners() {
      const vh = window.innerHeight;
      sectionsWithMask.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const mask = sec.querySelector('.mask-inner');
        if (mask) {
          // If section is within viewport
          if (rect.top <= vh * 0.85 && rect.bottom >= vh * 0.15) {
            mask.style.transform = 'translateY(0%)';
            mask.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
          }
        }
      });
    }

    // -------------------------------------------------------------
    // 2. SCROLLYTELLING TEXT REVEAL & PROGRESS COUNTERS
    // -------------------------------------------------------------
    const promiseSection = document.getElementById('promise');
    const gearSection = document.getElementById('gear');
    const numbersSection = document.getElementById('numbers');
    const solutionsSection = document.getElementById('solutions');
    const softwareSection = document.getElementById('software');

    function createTextRevealer(container) {
      if (!container) return () => {};
      const words = Array.from(container.querySelectorAll('[data-reveal-word], .reveal-word'));
      const totalWords = words.length;
      const r = 2.4;

      return function(progress) {
        const s = clamp(progress) * (totalWords + r);
        for (let i = 0; i < totalWords; i++) {
          const n = clamp((s - i) / r);
          // Interpolate rgb(198, 205, 208) -> rgb(29, 42, 49)
          const red = Math.round(198 - 169 * n);
          const green = Math.round(205 - 163 * n);
          const blue = Math.round(208 - 159 * n);
          words[i].style.color = `rgb(${red}, ${green}, ${blue})`;
        }
      };
    }

    const revealPromise = createTextRevealer(promiseSection?.querySelector('#promise-title'));
    const revealGear = createTextRevealer(gearSection?.querySelector('[data-anchor="gear-copy"]'));
    const revealSoftware = createTextRevealer(softwareSection);

    // SVG Circular Progress Counters (Promise 01 and Gear 02)
    const promiseCircle = promiseSection?.querySelector('circle[stroke-dasharray]');
    const gearCircle = gearSection?.querySelector('circle[stroke-dasharray]');
    const circumference = 131.94689;

    function getSectionProgress(section) {
      if (!section) return 0;
      const rect = section.getBoundingClientRect();
      const scrollableDist = section.offsetHeight - window.innerHeight;
      if (scrollableDist <= 0) return 0;
      const topOffset = -rect.top;
      return clamp(topOffset / scrollableDist);
    }

    // -------------------------------------------------------------
    // 3. NUMBERS RADAR DIAL & STATS HIGHLIGHTING
    // -------------------------------------------------------------
    const numbersStatCols = numbersSection?.querySelectorAll('.grid.h-full > div') || [];
    const numbersLabelSpan = numbersSection?.querySelector('[aria-live="polite"]');
    const numbersSvg = numbersSection?.querySelector('svg[viewBox="-112 -112 224 224"]');

    function updateNumbers(progress) {
      if (!numbersSection) return;
      // 3 Phases: 0 -> 0.33, 0.33 -> 0.66, 0.66 -> 1.0
      let activeIndex = 0;
      let labelText = 'ECHOES';

      if (progress >= 0.66) {
        activeIndex = 2;
        labelText = 'REACH';
      } else if (progress >= 0.33) {
        activeIndex = 1;
        labelText = 'ACCURACY';
      }

      if (numbersLabelSpan && numbersLabelSpan.textContent !== labelText) {
        numbersLabelSpan.textContent = labelText;
      }

      numbersStatCols.forEach((col, i) => {
        const isActive = (i === activeIndex);
        col.style.transition = 'color 0.35s ease';
        col.style.color = isActive ? '#1d2a31' : '#c6cdd0';
      });
    }

    // -------------------------------------------------------------
    // 4. SOLUTIONS 4 TABS & AUTHENTIC LIDAR SENSOR CANVASES
    // -------------------------------------------------------------
    const solutionsImages = [
      '/images/orvane/solution-energy.png',
      '/images/orvane/solution-infrastructure.png',
      '/images/orvane/solution-industry.png',
      '/images/orvane/solution-geospatial.png'
    ];

    const loadedImages = [];
    solutionsImages.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages[idx] = img;
        drawSolutionCanvas(idx);
      };
    });

    function drawSolutionCanvas(tabIndex) {
      if (!solutionsSection) return;
      const panel = solutionsSection.querySelector('[data-anchor="solutions-panel"]');
      if (!panel) return;
      const canvases = panel.querySelectorAll('canvas');
      const c = canvases[tabIndex];
      const img = loadedImages[tabIndex];
      if (!c || !img) return;

      const ctx = c.getContext('2d');
      if (!ctx) return;

      const w = c.width = panel.clientWidth || 573;
      const h = c.height = panel.clientHeight || 348;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
    }

    let currentSolutionsIndex = -1;

    function selectSolutionsTab(index) {
      if (index === currentSolutionsIndex) return;
      currentSolutionsIndex = index;
      if (!solutionsSection) return;

      const tabs = solutionsSection.querySelectorAll('button[role="tab"]');
      const indicator = solutionsSection.querySelector('span[aria-hidden="true"].bg-ink');
      const stepCounter = solutionsSection.querySelector('.label-mono.hidden.text-haze span');

      tabs.forEach((tab, i) => {
        const isSelected = (i === index);
        tab.setAttribute('aria-selected', String(isSelected));
        tab.style.color = isSelected ? '#1d2a31' : '#9aa3a8';
        if (isSelected && indicator) {
          indicator.style.width = tab.offsetWidth + 'px';
          indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
          indicator.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        }
      });

      if (stepCounter) {
        stepCounter.textContent = `0${index + 1}`;
      }

      // Update text descriptions
      const textCols = solutionsSection.querySelectorAll('.grid.content-start > div');
      textCols.forEach((el, i) => {
        el.style.opacity = (i === index) ? '1' : '0';
        el.style.transition = 'opacity 0.4s ease';
      });

      // Update panel canvases clip-paths
      const panelCanvases = solutionsSection.querySelectorAll('[data-anchor="solutions-panel"] canvas');
      panelCanvases.forEach((el, i) => {
        el.style.clipPath = (i === index) ? 'none' : 'inset(100% 0% 0% 0%)';
        el.style.transition = 'clip-path 0.5s cubic-bezier(0.65, 0, 0.35, 1)';
      });

      // Update panel caption labels
      const panelLabels = solutionsSection.querySelectorAll('[data-anchor="solutions-panel"] .grid span.label-mono');
      panelLabels.forEach((el, i) => {
        el.style.opacity = (i === index) ? '1' : '0';
        el.style.transition = 'opacity 0.35s ease';
      });

      // Update filter tags
      const tagLists = solutionsSection.querySelectorAll('.flex.min-h-0.flex-col > .grid > ul');
      tagLists.forEach((el, i) => {
        el.style.opacity = (i === index) ? '1' : '0';
        el.style.transition = 'opacity 0.35s ease';
      });

      drawSolutionCanvas(index);
    }

    if (solutionsSection) {
      const tabs = solutionsSection.querySelectorAll('button[role="tab"]');
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectSolutionsTab(index));
      });
      setTimeout(() => selectSolutionsTab(0), 300);
    }

    // -------------------------------------------------------------
    // 5. GLOBAL SCROLL LISTENER (OPTIMIZED 60FPS VIA RAF)
    // -------------------------------------------------------------
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          // 1. Mask Inners Reveal
          updateMaskInners();

          // 2. Promise
          const pProgress = getSectionProgress(promiseSection);
          revealPromise(pProgress);
          if (promiseCircle) {
            promiseCircle.style.strokeDashoffset = String(circumference * (1 - pProgress));
          }

          // 3. Gear
          const gProgress = getSectionProgress(gearSection);
          revealGear(gProgress);
          if (gearCircle) {
            gearCircle.style.strokeDashoffset = String(circumference * (1 - gProgress));
          }

          // 4. Numbers
          const nProgress = getSectionProgress(numbersSection);
          updateNumbers(nProgress);

          // 5. Solutions (Auto switch tab by scroll progress)
          const sProgress = getSectionProgress(solutionsSection);
          let targetTab = 0;
          if (sProgress >= 0.75) targetTab = 3;
          else if (sProgress >= 0.5) targetTab = 2;
          else if (sProgress >= 0.25) targetTab = 1;
          selectSolutionsTab(targetTab);

          // 6. Software
          const swProgress = getSectionProgress(softwareSection);
          revealSoftware(swProgress);

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      [0, 1, 2, 3].forEach(drawSolutionCanvas);
    });

    // Run once on load
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrvane);
  } else {
    initOrvane();
  }
})();

// v2/public/scripts/liftline-interactive.js
// Complete standalone client-side interactivity for Liftline:
// 1. 30-Second Diagnostic Check ("Tell us what the door is doing.")
// 2. Before/After comparison slider
// 3. Interactive Pricing Estimator (tabs, mutual-exclusion groups, dynamic sums, tab badges, live list)
// 4. Pay Over Time Financing Calculator (amount slider, term buttons, live monthly payment)
// 5. Common Questions FAQ Accordion (expand/collapse with icon rotation)
// 6. Door Collection rail (category filter, prev/next scroll, progress bar, color swatches)
// 7. Header Navigation & Mobile Menu

(function () {
  'use strict';

  // ==========================================
  // 1. 30-SECOND DIAGNOSTIC TOOL (#diagnose)
  // ==========================================
  const DIAGNOSES = [
    {
      id: "spring",
      index: "01",
      title: "Broken spring",
      description: "A loud bang, a door that won't lift, a gap in the coil",
      fix: "Fit both torsion springs as a matched pair, check the cables and rebalance the door.",
      urgency: "Same day. Leave the door closed.",
      level: "high",
      lo: 225,
      hi: 395,
      safety: "With the spring gone, nothing is holding the door's full weight, often 150+ lb. Don't lift it by hand and don't let the opener try.",
      formService: "spring"
    },
    {
      id: "stuck",
      index: "02",
      title: "Won't open or close",
      description: "The opener hums, or the door reverses or sits still",
      fix: "Most often it's misaligned safety sensors, a spring or the opener's force setting. We check all three.",
      urgency: "Within 24 hours",
      level: "medium",
      lo: 95,
      hi: 395,
      formService: "diagnosis-visit"
    },
    {
      id: "track",
      index: "03",
      title: "Off track or crooked",
      description: "One side hangs low, rollers have left the rail",
      fix: "Seat the rollers, straighten or replace the bent track and swap any frayed cables.",
      urgency: "Same day. A loose door can fall.",
      level: "high",
      lo: 175,
      hi: 350,
      safety: "Keep cars and people away from a crooked door and unplug the opener so it stops pulling.",
      formService: "offtrack",
      answers: { urgency: "Today" }
    },
    {
      id: "noisy",
      index: "04",
      title: "Noisy or jerky",
      description: "Grinding, squealing or shaking on the way up",
      fix: "A tune-up: nylon rollers, tightened hinges, lubrication and a balance test.",
      urgency: "This week",
      level: "low",
      lo: 95,
      hi: 285,
      formService: "tune-up"
    },
    {
      id: "opener",
      index: "05",
      title: "Opener trouble",
      description: "Dead remote or keypad, or the motor runs and nothing moves",
      fix: "Repair the gear, logic board or remotes, or move up to a quiet belt-drive smart opener.",
      urgency: "Within 24–48 hours",
      level: "medium",
      lo: 125,
      hi: 900,
      formService: "opener"
    },
    {
      id: "panel",
      index: "06",
      title: "Damaged panel",
      description: "A dent, a crack or a section bent by a car",
      fix: "Replace the damaged section or sections, matched to your door's model and color.",
      urgency: "This week (sooner if it won't seal)",
      level: "low",
      lo: 250,
      hi: 800,
      formService: "panel"
    },
    {
      id: "new",
      index: "07",
      title: "Ready for a new door",
      description: "A fresh look, better insulation, or both",
      fix: "A free in-home measure, three style options, and an install that takes a single day.",
      urgency: "Plan ahead: 1–3 weeks lead time",
      level: "low",
      lo: 1150,
      hi: 4800,
      formService: "new-door"
    }
  ];

  const URGENCY_LEVELS = {
    high: { dot: "bg-ember-soft", label: "Act today" },
    medium: { dot: "bg-amber-soft", label: "Book soon" },
    low: { dot: "bg-moss-soft", label: "Not urgent" }
  };

  let selectedDiagnosisId = null;

  function initDiagnose() {
    const diagnoseSection = document.getElementById('diagnose');
    if (!diagnoseSection) return;

    const radioGroup = diagnoseSection.querySelector('div[role="radiogroup"]');
    const card = diagnoseSection.querySelector('aside, div[aria-live="polite"]');
    if (!radioGroup || !card) return;

    if (diagnoseSection.dataset.diagnoseReady === 'true') {
      renderDiagnoseUI(diagnoseSection);
      return;
    }
    diagnoseSection.dataset.diagnoseReady = 'true';

    // EVENT DELEGATION for clicking symptoms
    radioGroup.addEventListener('click', function (e) {
      const btn = e.target.closest('button[role="radio"]');
      if (!btn) return;
      e.preventDefault();

      // Find matched diagnosis by title or index
      const titleEl = btn.querySelector('.font-heading');
      const title = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
      const numEl = btn.querySelector('.font-mono');
      const num = numEl ? numEl.textContent.trim() : '';

      const diag = DIAGNOSES.find(d => 
        d.id === btn.dataset.symptomId ||
        d.title.toLowerCase() === title ||
        d.index === num
      );

      if (diag) {
        selectedDiagnosisId = (selectedDiagnosisId === diag.id) ? diag.id : diag.id;
        renderDiagnoseUI(diagnoseSection);
      }
    });

    // Keyboard support (Space / Enter / Arrow keys)
    radioGroup.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        const btn = e.target.closest('button[role="radio"]');
        if (btn) {
          e.preventDefault();
          btn.click();
        }
      }
    });

    renderDiagnoseUI(diagnoseSection);
  }

  function renderDiagnoseUI(diagnoseSection) {
    const radioGroup = diagnoseSection.querySelector('div[role="radiogroup"]');
    const card = diagnoseSection.querySelector('div[aria-live="polite"]') || diagnoseSection.querySelector('aside');
    if (!radioGroup || !card) return;

    const buttons = radioGroup.querySelectorAll('button[role="radio"]');
    buttons.forEach((btn, idx) => {
      const titleEl = btn.querySelector('.font-heading');
      const title = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
      const diag = DIAGNOSES.find(d => 
        d.id === btn.dataset.symptomId ||
        d.title.toLowerCase() === title ||
        d.index === (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`)
      );
      if (diag) {
        btn.dataset.symptomId = diag.id;
      }

      const isChecked = diag && diag.id === selectedDiagnosisId;
      btn.setAttribute('aria-checked', isChecked ? 'true' : 'false');

      const numSpan = btn.querySelector('.font-mono');
      const descSpan = btn.querySelector('.font-heading + span');
      const radioOuter = btn.querySelector('span[aria-hidden="true"]');
      const radioInner = radioOuter ? radioOuter.querySelector('span') : null;

      if (isChecked) {
        btn.className = "group flex items-center gap-5 rounded-[22px] border px-5 py-4 text-left transition-[background-color,border-color,color,transform,translate,scale,rotate] duration-300 sm:px-6 sm:py-5 border-ink bg-ink text-cream";
        if (numSpan) numSpan.className = "font-mono text-[12px] transition-colors text-ember-soft";
        if (descSpan) descSpan.className = "mt-1 block text-[14.5px] leading-snug text-cream/65";
        if (radioOuter) radioOuter.className = "flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors border-ember bg-ember";
        if (radioInner) radioInner.className = "size-2 rounded-full bg-cream transition-transform duration-300 scale-100";
      } else {
        btn.className = "group flex items-center gap-5 rounded-[22px] border px-5 py-4 text-left transition-[background-color,border-color,color,transform,translate,scale,rotate] duration-300 sm:px-6 sm:py-5 border-ink/[0.08] bg-card hover:-translate-y-0.5 hover:border-ink/20";
        if (numSpan) numSpan.className = "font-mono text-[12px] transition-colors text-slate";
        if (descSpan) descSpan.className = "mt-1 block text-[14.5px] leading-snug text-slate";
        if (radioOuter) radioOuter.className = "flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors border-ink/20 group-hover:border-ink/40";
        if (radioInner) radioInner.className = "size-2 rounded-full bg-cream transition-transform duration-300 scale-0";
      }
    });

    // Render Right Panel Card
    const currentDiag = DIAGNOSES.find(d => d.id === selectedDiagnosisId);
    let contentContainer = card.querySelector('.diagnose-content-area');
    if (!contentContainer) {
      // Find the inner container that holds the content
      const oldPrompt = card.querySelector('div.relative.flex') || card.querySelector('div.relative:not(.door-grooves):not(.bg-ember\\/25)');
      if (oldPrompt) {
        contentContainer = document.createElement('div');
        contentContainer.className = 'diagnose-content-area relative';
        oldPrompt.parentNode.replaceChild(contentContainer, oldPrompt);
      } else {
        contentContainer = document.createElement('div');
        contentContainer.className = 'diagnose-content-area relative';
        card.appendChild(contentContainer);
      }
    }

    if (!currentDiag) {
      // Empty prompt
      contentContainer.innerHTML = `
        <div class="relative flex h-full min-h-[21rem] flex-col justify-between">
          <span class="flex size-12 items-center justify-center rounded-full border border-cream/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-left size-5 text-ember-soft" aria-hidden="true"><path d="M7 17V7h10"></path><path d="M17 17 7 7"></path></svg>
          </span>
          <p class="max-w-[18ch] font-heading text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.035em] text-cream/90">
            Pick a symptom. The likely fix, how soon to act and a typical price appear here.
          </p>
        </div>
      `;
    } else {
      // Selected symptom details (exact match to user screenshot)
      const urgencyInfo = URGENCY_LEVELS[currentDiag.level] || URGENCY_LEVELS.low;
      contentContainer.innerHTML = `
        <div class="relative animate-in fade-in duration-300">
          <div data-animate="true" class="flex flex-wrap items-center gap-3">
            <span class="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em]">
              <span class="size-2 rounded-full ${urgencyInfo.dot}"></span>
              ${urgencyInfo.label}
            </span>
            <span class="text-sm text-cream/70">${currentDiag.urgency}</span>
          </div>
          <p data-animate="true" class="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">What it usually needs</p>
          <p data-animate="true" class="mt-3 font-heading text-[1.55rem] font-semibold leading-[1.15] tracking-[-0.03em]">${currentDiag.fix}</p>
          <div data-animate="true" class="mt-8 flex items-end justify-between gap-4 border-t border-cream/12 pt-6">
            <div>
              <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">Usual range</p>
              <p class="mt-2 font-heading text-[2.4rem] font-semibold leading-none tracking-[-0.04em]">$${currentDiag.lo.toLocaleString()}–$${currentDiag.hi.toLocaleString()}</p>
            </div>
          </div>
          ${currentDiag.safety ? `
          <p data-animate="true" class="mt-6 flex gap-3 rounded-2xl bg-ember/15 p-4 text-[14px] leading-relaxed text-cream/85">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert mt-0.5 size-4 shrink-0 text-ember-soft" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            ${currentDiag.safety}
          </p>
          ` : ''}
          <div data-animate="true" class="mt-8 flex flex-wrap gap-3">
            <a class="group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform,translate,scale,rotate] duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 bg-ember text-white hover:bg-ember-deep shadow-[0_14px_34px_-16px_rgba(30,58,92,0.6)] h-12 gap-3 pl-5 pr-1.5 text-[15px]" href="/request-service?diagnosis=${currentDiag.id}&entry=diagnosis">
              <span class="relative block overflow-hidden py-0.5">
                <span class="block transition-transform duration-500 ease-expo group-hover/button:-translate-y-[115%]">Quote this fix</span>
                <span aria-hidden="true" class="absolute inset-0 block translate-y-[115%] py-0.5 transition-transform duration-500 ease-expo group-hover/button:translate-y-0">Quote this fix</span>
              </span>
              <span class="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full size-9 bg-white/15 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right size-4 transition-transform duration-500 ease-expo group-hover/button:translate-x-[200%]" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right absolute size-4 -translate-x-[200%] transition-transform duration-500 ease-expo group-hover/button:translate-x-0" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </span>
            </a>
            <a href="tel:5555550148" class="group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform,translate,scale,rotate] duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 border border-white/20 text-cream hover:bg-white/10 h-12 gap-3 pl-5 pr-1.5 text-[15px]">
              <span class="relative block overflow-hidden py-0.5">
                <span class="block transition-transform duration-500 ease-expo group-hover/button:-translate-y-[115%]">Call us</span>
                <span aria-hidden="true" class="absolute inset-0 block translate-y-[115%] py-0.5 transition-transform duration-500 ease-expo group-hover/button:translate-y-0">Call us</span>
              </span>
              <span class="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full size-9 bg-white/10 text-cream">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone size-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </span>
            </a>
          </div>
          <p data-animate="true" class="mt-6 text-[12.5px] leading-relaxed text-cream/45">
            Ranges reflect typical Riverton-area jobs in 2026. Your technician confirms the exact figure with you before any work begins.
          </p>
        </div>
      `;
    }
  }

  // ==========================================
  // 2. BEFORE / AFTER IMAGE SLIDER (#recent-work)
  // ==========================================
  function initBeforeAfterSlider() {
    const containers = document.querySelectorAll('#recent-work figure > div.cursor-ew-resize');
    containers.forEach(container => {
      if (container.dataset.sliderReady === 'true') return;
      container.dataset.sliderReady = 'true';

      const clipDiv = container.querySelector('div.absolute.inset-0[style*="clip-path"]') ||
                      container.querySelector('div.absolute.inset-0');
      const divider = container.querySelector('div.pointer-events-none.absolute.inset-y-0');
      const handle = container.querySelector('div[role="slider"]');

      if (!clipDiv || !divider || !handle) return;

      container.style.touchAction = 'none';
      container.style.userSelect = 'none';
      container.style.webkitUserSelect = 'none';
      handle.style.touchAction = 'none';

      const imgs = container.querySelectorAll('img');
      imgs.forEach(img => {
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none';
        img.style.webkitUserDrag = 'none';
        img.style.pointerEvents = 'none';
      });

      let isDragging = false;
      let pct = 50;

      function update(clientX) {
        const rect = container.getBoundingClientRect();
        if (!rect.width) return;
        const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
        pct = x;
        clipDiv.style.clipPath = `inset(0 ${100 - x}% 0 0)`;
        divider.style.left = `${x}%`;
        handle.style.left = `${x}%`;
        handle.setAttribute('aria-valuenow', Math.round(x));
        handle.setAttribute('aria-valuetext', `${Math.round(x)}% before`);
      }

      function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        try {
          if (e.pointerId && container.setPointerCapture) {
            container.setPointerCapture(e.pointerId);
          }
        } catch (err) {}
        update(clientX);
      }

      function moveDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        update(clientX);
      }

      function stopDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        try {
          if (e.pointerId && container.hasPointerCapture && container.hasPointerCapture(e.pointerId)) {
            container.releasePointerCapture(e.pointerId);
          }
        } catch (err) {}
      }

      container.addEventListener('pointerdown', startDrag);
      window.addEventListener('pointermove', moveDrag);
      window.addEventListener('pointerup', stopDrag);
      window.addEventListener('pointercancel', stopDrag);

      container.addEventListener('touchstart', startDrag, { passive: false });
      window.addEventListener('touchmove', moveDrag, { passive: false });
      window.addEventListener('touchend', stopDrag);
      window.addEventListener('touchcancel', stopDrag);

      container.addEventListener('mousedown', startDrag);
      window.addEventListener('mousemove', moveDrag);
      window.addEventListener('mouseup', stopDrag);

      handle.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          pct = Math.max(0, pct - 5);
          update(container.getBoundingClientRect().left + (container.getBoundingClientRect().width * pct / 100));
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          pct = Math.min(100, pct + 5);
          update(container.getBoundingClientRect().left + (container.getBoundingClientRect().width * pct / 100));
        } else if (e.key === 'Home') {
          e.preventDefault();
          pct = 0;
          update(container.getBoundingClientRect().left);
        } else if (e.key === 'End') {
          e.preventDefault();
          pct = 100;
          update(container.getBoundingClientRect().left + container.getBoundingClientRect().width);
        }
      });
    });
  }

  // ==========================================
  // 3. PRICING ESTIMATOR (#prices)
  // ==========================================
  const PRICE_TABS = [
    { id: "price-tab-springs", label: "Springs" },
    { id: "price-tab-cables-rollers", label: "Cables & rollers" },
    { id: "price-tab-openers", label: "Openers" },
    { id: "price-tab-new-doors", label: "New doors" }
  ];

  const PRICE_ITEMS = [
    { id: "torsion-pair", tab: "Springs", name: "Torsion springs, matched pair", note: "Standard springs, rated for 10,000 cycles", lo: 225, hi: 345, group: "torsion", formService: "spring", answers: { spring_type: "Torsion (above the door)" } },
    { id: "torsion-hc", tab: "Springs", name: "High-cycle torsion springs", note: "Built for 20,000+ cycles, covered for life", lo: 295, hi: 395, group: "torsion", formService: "spring", answers: { spring_type: "Torsion (above the door)" } },
    { id: "extension", tab: "Springs", name: "Extension springs, pair", note: "Fitted with safety cables", lo: 165, hi: 245, formService: "spring", answers: { spring_type: "Extension (along the tracks)" } },
    { id: "cables", tab: "Cables & rollers", name: "Lift cables, pair", note: "Door rebalanced as part of the job", lo: 150, hi: 275, formService: "offtrack" },
    { id: "rollers", tab: "Cables & rollers", name: "Nylon rollers, full set", note: "Sealed bearings for a quieter run", lo: 120, hi: 220, formService: "tune-up" },
    { id: "track", tab: "Cables & rollers", name: "Off-track repair", note: "Rollers reseated, track straightened", lo: 175, hi: 350, formService: "offtrack" },
    { id: "tuneup", tab: "Cables & rollers", name: "Tune-up & safety check", note: "Includes the 21-point inspection", lo: 95, hi: 165, formService: "tune-up" },
    { id: "op-repair", tab: "Openers", name: "Opener repair", note: "Gears, logic boards, sensors or remotes", lo: 125, hi: 295, formService: "opener", answers: { opener_need: "Repair my opener" } },
    { id: "op-chain", tab: "Openers", name: "Chain-drive opener", note: "Supplied and fitted", lo: 450, hi: 600, group: "opener", formService: "opener", answers: { opener_need: "Replace my opener" } },
    { id: "op-belt", tab: "Openers", name: "Belt-drive smart opener", note: "Wi-Fi and battery backup, supplied and fitted", lo: 620, hi: 900, group: "opener", formService: "opener", answers: { opener_need: "Replace my opener" } },
    { id: "op-wall", tab: "Openers", name: "Wall-mount opener", note: "The quietest option, ceiling left clear", lo: 890, hi: 1250, group: "opener", formService: "opener", answers: { opener_need: "Replace my opener" } },
    { id: "panel", tab: "New doors", name: "Replace one damaged panel", note: "Matched to your door's maker and color", lo: 250, hi: 800, formService: "panel" },
    { id: "door-single", tab: "New doors", name: "New single door (9×7)", note: "Fitted, with the old door taken away", lo: 1150, hi: 2400, group: "newdoor", formService: "new-door", answers: { door_size: "Single (about 9 ft wide)" } },
    { id: "door-double", tab: "New doors", name: "New double door (16×7)", note: "Fitted, with the old door taken away", lo: 1800, hi: 4800, group: "newdoor", formService: "new-door", answers: { door_size: "Double (about 16 ft wide)" } }
  ];

  function formatRange(lo, hi) {
    if (lo === hi) return `$${lo.toLocaleString()}`;
    return `$${lo.toLocaleString()}–$${hi.toLocaleString()}`;
  }

  let pricingState = {
    currentTab: "Springs",
    selectedSet: new Set(["torsion-pair"]),
    isSavedToList: false
  };

  function initPriceEstimator() {
    const pricesSection = document.getElementById('prices');
    if (!pricesSection) return;

    const panel = document.getElementById('price-panel');
    const aside = pricesSection.querySelector('aside');
    if (!panel || !aside) return;

    if (pricesSection.dataset.pricingReady === 'true') {
      renderPricingUI(pricesSection);
      return;
    }
    pricesSection.dataset.pricingReady = 'true';

    pricesSection.addEventListener('click', function (e) {
      const tabBtn = e.target.closest('[role="tab"]');
      if (tabBtn && pricesSection.contains(tabBtn)) {
        e.preventDefault();
        const tabText = tabBtn.textContent.replace(/[0-9]/g, '').trim();
        const tabObj = PRICE_TABS.find(t => t.label === tabText || tabBtn.id.includes(t.id.replace('price-tab-', '')));
        if (tabObj && tabObj.label !== pricingState.currentTab) {
          pricingState.currentTab = tabObj.label;
          renderPricingUI(pricesSection);
        }
        return;
      }

      const label = e.target.closest('label[data-item-id]');
      if (label && pricesSection.contains(label)) {
        e.preventDefault();
        const id = label.dataset.itemId;
        const item = PRICE_ITEMS.find(it => it.id === id);
        if (!item) return;

        if (pricingState.selectedSet.has(id)) {
          pricingState.selectedSet.delete(id);
        } else {
          if (item.group) {
            PRICE_ITEMS.forEach(other => {
              if (other.group === item.group && pricingState.selectedSet.has(other.id)) {
                pricingState.selectedSet.delete(other.id);
              }
            });
          }
          pricingState.selectedSet.add(id);
        }
        renderPricingUI(pricesSection);
        return;
      }

      const addBtn = e.target.closest('button[aria-pressed]');
      if (addBtn && aside.contains(addBtn)) {
        e.preventDefault();
        pricingState.isSavedToList = !pricingState.isSavedToList;
        renderPricingUI(pricesSection);
        return;
      }
    });

    renderPricingUI(pricesSection);
  }

  function renderPricingUI(pricesSection) {
    const tabButtons = pricesSection.querySelectorAll('[role="tab"]');
    const panel = document.getElementById('price-panel');
    const aside = pricesSection.querySelector('aside');
    if (!panel || !aside) return;

    const selectionUl = aside.querySelector('ul[aria-live="polite"]');
    const rangeDisplay = aside.querySelector('.font-heading');
    const addToListBtn = aside.querySelector('button[aria-pressed]');
    const quoteLink = aside.querySelector('a[href*="request-service"], button.bg-ember');

    tabButtons.forEach(btn => {
      const tabText = btn.textContent.replace(/[0-9]/g, '').trim();
      const tabObj = PRICE_TABS.find(t => t.label === tabText || btn.id.includes(t.id.replace('price-tab-', '')));
      const actualName = tabObj ? tabObj.label : tabText;
      const isSelected = actualName === pricingState.currentTab;

      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      btn.className = isSelected
        ? "relative flex h-11 items-center justify-center gap-2 rounded-[18px] px-3 text-[14px] font-medium transition-[background-color,color,box-shadow] duration-300 bg-card text-ink shadow-[0_6px_20px_-10px_rgba(21,23,26,0.35)]"
        : "relative flex h-11 items-center justify-center gap-2 rounded-[18px] px-3 text-[14px] font-medium transition-[background-color,color,box-shadow] duration-300 text-slate hover:text-ink";

      const tabCount = PRICE_ITEMS.filter(it => it.tab === actualName && pricingState.selectedSet.has(it.id)).length;
      btn.innerHTML = `${actualName}${tabCount > 0 ? `<span class="flex size-5 items-center justify-center rounded-full bg-ember font-mono text-[10px] text-white">${tabCount}</span>` : ''}`;
    });

    const currentItems = PRICE_ITEMS.filter(it => it.tab === pricingState.currentTab);
    panel.setAttribute('aria-labelledby', `price-tab-${pricingState.currentTab.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);

    panel.innerHTML = currentItems.map(item => {
      const checked = pricingState.selectedSet.has(item.id);
      return `
        <label tabindex="0" class="flex cursor-pointer items-center gap-4 rounded-[20px] border px-4 py-4 transition-[background-color,border-color] duration-300 sm:px-5 ${checked ? 'border-ink/25 bg-ember-tint/50' : 'border-transparent hover:bg-sand/60'}" data-item-id="${item.id}">
          <input type="checkbox" class="peer sr-only" ${checked ? 'checked' : ''} tabindex="-1" />
          <span aria-hidden="true" class="flex size-6 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember ${checked ? 'border-ember bg-ember text-white' : 'border-ink/25 bg-card'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-3.5 transition-transform duration-300 ${checked ? 'scale-100' : 'scale-0'}"><path d="M20 6 9 17l-5-5"></path></svg>
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-[15.5px] font-medium text-ink">${item.name}</span>
            <span class="mt-0.5 block text-[13.5px] text-slate">${item.note}</span>
          </span>
          <span class="shrink-0 font-mono text-[13px] text-ink">${formatRange(item.lo, item.hi)}</span>
        </label>
      `;
    }).join('');

    const selectedList = PRICE_ITEMS.filter(it => pricingState.selectedSet.has(it.id));

    if (selectionUl) {
      if (selectedList.length === 0) {
        selectionUl.innerHTML = `<li class="text-[15px] text-cream/60">Choose anything that sounds like your door. The total builds here.</li>`;
      } else {
        selectionUl.innerHTML = selectedList.map(it => `
          <li class="flex items-baseline justify-between gap-4 border-b border-cream/10 pb-3 text-[14.5px]">
            <span class="text-cream/85">${it.name}</span>
            <span class="shrink-0 font-mono text-[12.5px] text-cream/70">${formatRange(it.lo, it.hi)}</span>
          </li>
        `).join('');
      }
    }

    if (rangeDisplay) {
      if (selectedList.length === 0) {
        rangeDisplay.textContent = "$0";
      } else {
        const totalLo = selectedList.reduce((sum, it) => sum + it.lo, 0);
        const totalHi = selectedList.reduce((sum, it) => sum + it.hi, 0);
        rangeDisplay.textContent = formatRange(totalLo, totalHi);
      }
    }

    if (quoteLink) {
      if (selectedList.length > 0) {
        const primaryService = selectedList[0].formService || 'spring';
        const params = new URLSearchParams({ service: primaryService });
        selectedList.forEach(item => {
          if (item.answers) {
            Object.entries(item.answers).forEach(([k, v]) => params.set(k, v));
          }
        });
        quoteLink.setAttribute('href', `/request-service?${params.toString()}`);
      } else {
        quoteLink.setAttribute('href', '/request-service');
      }
    }

    if (addToListBtn) {
      addToListBtn.setAttribute('aria-pressed', pricingState.isSavedToList ? 'true' : 'false');
      if (pricingState.isSavedToList) {
        addToListBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-4 text-ember-soft"><path d="M20 6 9 17l-5-5"></path></svg>Saved to list`;
      } else {
        addToListBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus size-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>Add to list`;
      }
    }
  }

  // ==========================================
  // 4. PAY OVER TIME FINANCING CALCULATOR (#financing)
  // ==========================================
  const FINANCING_TERMS = [
    { months: 12, apr: 0 },
    { months: 24, apr: 7.99 },
    { months: 36, apr: 9.99 },
    { months: 60, apr: 9.99 }
  ];

  let financeState = {
    amount: 3200,
    termMonths: 60
  };

  function calcMonthlyPayment(amount, months, apr) {
    if (apr === 0) return Math.round(amount / months);
    const r = apr / 100 / 12;
    return Math.round((amount * r) / (1 - Math.pow(1 + r, -months)));
  }

  function initFinancing() {
    const financeSection = document.getElementById('financing');
    if (!financeSection) return;

    const rangeInput = financeSection.querySelector('input[type="range"]');
    const amountDisplay = financeSection.querySelector('.font-heading.text-\\[2rem\\]') || financeSection.querySelector('p.font-heading');
    const termButtons = financeSection.querySelectorAll('div[role="group"] button');
    const monthlyDisplay = financeSection.querySelector('.font-heading.text-\\[3\\.4rem\\]') || financeSection.querySelector('span.font-heading');
    const detailP = financeSection.querySelector('div[aria-live="polite"] .text-right');

    if (!rangeInput) return;

    if (financeSection.dataset.financeReady === 'true') {
      renderFinanceUI();
      return;
    }
    financeSection.dataset.financeReady = 'true';

    function renderFinanceUI() {
      const activeTerm = FINANCING_TERMS.find(t => t.months === financeState.termMonths) || FINANCING_TERMS[3];
      const monthly = calcMonthlyPayment(financeState.amount, activeTerm.months, activeTerm.apr);
      const fillPct = ((financeState.amount - 1000) / (10000 - 1000)) * 100;

      // Update input
      rangeInput.value = financeState.amount;
      rangeInput.setAttribute('aria-valuetext', `$${financeState.amount.toLocaleString()}`);
      rangeInput.style.setProperty('--fill', `${fillPct}%`);

      // Update amount display
      if (amountDisplay) {
        amountDisplay.textContent = `$${financeState.amount.toLocaleString()}`;
      }

      // Update term buttons
      termButtons.forEach(btn => {
        const months = parseInt(btn.textContent.trim(), 10);
        const isActive = months === financeState.termMonths;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (isActive) {
          btn.className = "h-12 rounded-2xl border text-[14px] font-medium transition-colors duration-300 border-cream bg-cream text-ink";
        } else {
          btn.className = "h-12 rounded-2xl border text-[14px] font-medium transition-colors duration-300 border-cream/15 text-cream hover:border-cream/40";
        }
      });

      // Update monthly estimate
      if (monthlyDisplay) {
        monthlyDisplay.textContent = `$${monthly}`;
      }

      // Update APR and payment text
      if (detailP) {
        detailP.innerHTML = `<p>${activeTerm.apr}% APR</p><p>${activeTerm.months} payments</p>`;
      }
    }

    // Range slider input listener
    rangeInput.addEventListener('input', function () {
      financeState.amount = parseInt(this.value, 10) || 3200;
      renderFinanceUI();
    });

    // Term button clicks
    termButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const months = parseInt(this.textContent.trim(), 10);
        if (months) {
          financeState.termMonths = months;
          renderFinanceUI();
        }
      });
    });

    renderFinanceUI();
  }

  // ==========================================
  // 5. COMMON QUESTIONS FAQ ACCORDION (#faq)
  // ==========================================
  function initFaq() {
    const faqSection = document.getElementById('faq');
    if (!faqSection) return;
    if (faqSection.dataset.faqReady === 'true') return;
    faqSection.dataset.faqReady = 'true';

    faqSection.addEventListener('click', function (e) {
      const btn = e.target.closest('button[aria-expanded]');
      if (!btn || !faqSection.contains(btn)) return;
      e.preventDefault();

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const row = btn.closest('.border-b') || btn.parentElement.parentElement;
      const region = row ? row.querySelector('div[role="region"]') : null;
      const iconSpan = btn.querySelector('span.flex.size-10');

      if (isExpanded) {
        // Collapse
        btn.setAttribute('aria-expanded', 'false');
        if (iconSpan) {
          iconSpan.classList.remove('rotate-45', 'border-ink', 'bg-ink', 'text-cream');
          iconSpan.classList.add('border-ink/15', 'text-ink');
        }
        if (region) {
          region.classList.remove('grid-rows-[1fr]', 'opacity-100');
          region.classList.add('grid-rows-[0fr]', 'opacity-0');
        }
      } else {
        // Expand
        btn.setAttribute('aria-expanded', 'true');
        if (iconSpan) {
          iconSpan.classList.remove('border-ink/15', 'text-ink');
          iconSpan.classList.add('rotate-45', 'border-ink', 'bg-ink', 'text-cream');
        }
        if (region) {
          region.classList.remove('grid-rows-[0fr]', 'opacity-0');
          region.classList.add('grid-rows-[1fr]', 'opacity-100');
        }
      }
    });
  }

  // ==========================================
  // 6. DOOR COLLECTION RAIL & SWATCHES (#doors, #collection)
  // ==========================================
  function initDoorsRail() {
    const doorsSection = document.getElementById('doors') || document.getElementById('collection');
    if (!doorsSection) return;
    if (doorsSection.dataset.railReady === 'true') return;
    doorsSection.dataset.railReady = 'true';

    const filterBtns = doorsSection.querySelectorAll('button[type="button"][aria-pressed], div[role="group"] button');
    const scrollContainer = doorsSection.querySelector('.snap-x, div.flex.overflow-x-auto');
    const cards = doorsSection.querySelectorAll('[data-rail-card="true"], article');
    const prevBtn = doorsSection.querySelector('button[aria-label*="previous" i]');
    const nextBtn = doorsSection.querySelector('button[aria-label*="next" i]');
    const progressBar = doorsSection.querySelector('.bg-ink.transition-\\[width\\], div[role="progressbar"] > div');

    if (scrollContainer && progressBar) {
      scrollContainer.addEventListener('scroll', () => {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (maxScroll > 0) {
          const ratio = Math.min(1, Math.max(0, scrollContainer.scrollLeft / maxScroll));
          if (progressBar.style.transform !== undefined) {
            progressBar.style.transform = `scaleX(${ratio})`;
          }
          progressBar.style.width = `${Math.max(12, ratio * 100)}%`;
        }
      }, { passive: true });
    }

    if (prevBtn && scrollContainer) {
      prevBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: -380, behavior: 'smooth' });
      });
    }

    if (nextBtn && scrollContainer) {
      nextBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({ left: 380, behavior: 'smooth' });
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const cat = this.textContent.trim().toLowerCase();
        filterBtns.forEach(b => {
          b.setAttribute('aria-pressed', 'false');
          b.className = "h-10 shrink-0 rounded-full border px-4 text-[14px] font-medium transition-colors duration-300 border-ink/12 text-ink hover:border-ink/35";
        });
        this.setAttribute('aria-pressed', 'true');
        this.className = "h-10 shrink-0 rounded-full border px-4 text-[14px] font-medium transition-colors duration-300 border-ink bg-ink text-cream";

        cards.forEach(card => {
          if (cat === 'all') {
            card.style.display = '';
          } else {
            const cardText = card.textContent.toLowerCase();
            const cardCat = card.getAttribute('data-category')?.toLowerCase() || '';
            card.style.display = (cardCat.includes(cat) || cardText.includes(cat)) ? '' : 'none';
          }
        });
      });
    });

    cards.forEach(card => {
      const radioBtns = card.querySelectorAll('[role="radiogroup"] button, button[role="radio"]');
      const infoP = card.querySelector('p.text-slate') || card.querySelector('p.text-cream\\/65');
      radioBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          const colorName = this.getAttribute('aria-label') || this.getAttribute('title');
          radioBtns.forEach(b => {
            b.setAttribute('aria-checked', 'false');
            b.classList.remove('ring-2', 'ring-ink');
            b.classList.add('ring-1', 'ring-ink/20');
          });
          this.setAttribute('aria-checked', 'true');
          this.classList.remove('ring-1', 'ring-ink/20');
          this.classList.add('ring-2', 'ring-ink');

          if (infoP && colorName) {
            const parts = infoP.textContent.split('·');
            const insulation = parts.length > 1 ? parts.slice(1).join('·') : 'Insulation R-12';
            infoP.textContent = `${colorName} · ${insulation.trim()}`;
          }
        });
      });
    });
  }

  // ==========================================
  // 7. HEADER NAVIGATION & MOBILE MENU
  // ==========================================
  function initHeaderAndMenu() {
    const openBtn = document.querySelector('button[aria-label="Open menu"]');
    const closeBtn = document.querySelector('button[aria-label="Close menu"]');
    const menuDialog = document.querySelector('div[role="dialog"][aria-label="Menu"]');

    if (menuDialog && openBtn && openBtn.dataset.menuReady !== 'true') {
      openBtn.dataset.menuReady = 'true';

      openBtn.addEventListener('click', () => {
        menuDialog.classList.remove('invisible');
        openBtn.setAttribute('aria-expanded', 'true');
        const backdrop = menuDialog.querySelector('div[aria-hidden="true"]');
        if (backdrop) backdrop.style.clipPath = 'inset(0 0 0% 0)';
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const backdrop = menuDialog.querySelector('div[aria-hidden="true"]');
          if (backdrop) backdrop.style.clipPath = 'inset(0 0 100% 0)';
          setTimeout(() => {
            menuDialog.classList.add('invisible');
            openBtn.setAttribute('aria-expanded', 'false');
          }, 500);
        });
      }
    }

    // Desktop Services Dropdown hover/click
    const servicesLink = document.querySelector('header nav a[href="/services"]');
    const dropdownMenu = document.querySelector('header .absolute.inset-x-0.top-full');
    if (servicesLink && dropdownMenu) {
      servicesLink.parentElement.addEventListener('mouseenter', () => {
        dropdownMenu.classList.remove('pointer-events-none', 'invisible', '-translate-y-2', 'opacity-0');
        dropdownMenu.classList.add('pointer-events-auto', 'visible', 'translate-y-0', 'opacity-100');
      });
      dropdownMenu.parentElement.addEventListener('mouseleave', () => {
        dropdownMenu.classList.remove('pointer-events-auto', 'visible', 'translate-y-0', 'opacity-100');
        dropdownMenu.classList.add('pointer-events-none', 'invisible', '-translate-y-2', 'opacity-0');
      });
    }
  }

  // ==========================================
  // MASTER INITIALIZATION & SELF-HEALING
  // ==========================================
  function masterInit() {
    initDiagnose();
    initBeforeAfterSlider();
    initPriceEstimator();
    initFinancing();
    initFaq();
    initDoorsRail();
    initHeaderAndMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', masterInit);
  } else {
    masterInit();
  }

  setTimeout(masterInit, 200);
  setTimeout(masterInit, 800);
  setTimeout(masterInit, 2000);

  try {
    const observer = new MutationObserver(mutations => {
      let needsInit = false;
      for (const m of mutations) {
        if (m.type === 'childList') {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1) {
              if (node.id === 'diagnose' || node.id === 'prices' || node.id === 'recent-work' ||
                  node.id === 'doors' || node.id === 'financing' || node.id === 'faq' ||
                  node.querySelector?.('#diagnose, #prices, #recent-work, #doors, #financing, #faq')) {
                needsInit = true;
                break;
              }
            }
          }
        }
        if (needsInit) break;
      }
      if (needsInit) {
        masterInit();
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

})();

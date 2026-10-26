import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  initSmoothScroll,
  smoothScrollTo,
  renderWindowCanvas,
  initHeroAnimations,
  initFleetAnimations,
  initAdvantagesAccordion,
  initGlobalAnimations,
  initBookingModal,
} from './lib/index.js';

gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scroll
const lenis = initSmoothScroll();
window.lenis = lenis;

// Loader & Hero Initialization
function initLoaderAndHero() {
  const loaderEl = document.querySelector('[role="status"][aria-label="Loading AERIVE"]');
  const progressLine = loaderEl?.querySelector('.bg-champagne');
  const canvas = document.querySelector('#hero canvas');

  // Render Window Canvas mask
  if (canvas) {
    const isMobile = window.innerWidth < 768;
    renderWindowCanvas('/images/aerive/window-clear.png', canvas, isMobile ? 2048 : 2752);
  }

  // Setup hero animations
  const heroAnim = initHeroAnimations();

  // Progress line animation
  const loaderTL = gsap.timeline({
    onComplete: () => {
      loaderEl?.remove();
      heroAnim?.playIntro();
    },
  });

  if (progressLine) {
    loaderTL
      .to(progressLine, { scaleX: 1, duration: 0.7, ease: 'power2.out' })
      .to(progressLine.parentElement, { autoAlpha: 0, duration: 0.35 }, '+=0.1')
      .to(loaderEl, { autoAlpha: 0, duration: 1.2, ease: 'power2.inOut' }, '<');
  } else {
    loaderEl?.remove();
    heroAnim?.playIntro();
  }
}

// About Section Animations
function initAboutSection() {
  const aboutSection = document.querySelector('#about');
  if (!aboutSection) return;

  const revealItems = aboutSection.querySelectorAll('[data-reveal]');
  revealItems.forEach((item) => {
    gsap.fromTo(
      item,
      { autoAlpha: 0, y: 60, filter: 'blur(8px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 92%',
          end: 'top 58%',
          scrub: 1,
          refreshPriority: 9,
        },
      }
    );
  });

  const scrim = document.querySelector('[data-sky="scrim"]');
  if (scrim) {
    gsap.fromTo(
      scrim,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: 1,
        },
      }
    );
  }
}

// Cloud Rise & Header Theme Switch
function initCloudRiseAndLightZone() {
  const cloudRiseEl = document.querySelector('[data-cloud-rise]');
  const lightZoneEl = document.querySelector('[data-light-zone]');
  const globalSection = document.querySelector('#global');
  const skyRoot = document.querySelector('[data-sky-root]');
  const cloudBank = document.querySelector('[data-sky="bank"]');
  const whisper = document.querySelector('[data-sky="whisper"]');
  const veil = document.querySelector('[data-sky="veil"]');

  if (cloudRiseEl && cloudBank && whisper && veil) {
    const cloudTL = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: cloudRiseEl,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1,
        refreshPriority: 8,
      },
    });

    cloudTL
      .fromTo(
        cloudBank,
        { yPercent: 105, scale: 1, autoAlpha: 1 },
        { yPercent: -8, scale: 1.45, ease: 'power1.out', duration: 6 },
        0
      )
      .fromTo(
        whisper,
        { autoAlpha: 0, y: 40, filter: 'blur(8px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.6 },
        2.2
      )
      .to(whisper, { autoAlpha: 0, y: -30, filter: 'blur(6px)', duration: 1.2 }, 4.4)
      .fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.8 }, 4.4);
  }

  // Header Theme Switcher
  if (cloudRiseEl && globalSection) {
    ScrollTrigger.create({
      trigger: cloudRiseEl,
      start: () => `bottom-=${Math.round(0.2 * window.innerHeight)} bottom`,
      endTrigger: globalSection,
      end: 'top 40px',
      refreshPriority: -1,
      onToggle: (self) => {
        document.documentElement.dataset.headerTheme = self.isActive ? 'light' : 'dark';
      },
    });
  }

  // Hide fixed sky-root during light zone
  if (lightZoneEl && skyRoot) {
    ScrollTrigger.create({
      trigger: lightZoneEl,
      start: 'top top',
      end: 'bottom top',
      refreshPriority: -1,
      toggleClass: { targets: skyRoot, className: 'is-covered' },
    });
  }
}

// Inquiries Section Reveal
function initInquiries() {
  const inquiriesSection = document.querySelector('#inquiries');
  if (!inquiriesSection) return;

  const reveals = inquiriesSection.querySelectorAll('[data-reveal]');
  reveals.forEach((r) => {
    gsap.fromTo(
      r,
      { autoAlpha: 0, y: 60, filter: 'blur(8px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: r,
          start: 'top 94%',
          end: 'top 66%',
          scrub: 1,
          refreshPriority: 4,
        },
      }
    );
  });
}

// Navigation & Links
function initNavigation() {
  const menuBtn = document.querySelector('button[aria-label="Open menu"]');
  const closeMenuBtn = document.querySelector('button[aria-label="Close menu"]');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMobileMenu() {
    if (mobileMenu) {
      mobileMenu.removeAttribute('hidden');
      menuBtn?.setAttribute('aria-expanded', 'true');
      lenis?.stop();
    }
  }

  function closeMobileMenu() {
    if (mobileMenu) {
      mobileMenu.setAttribute('hidden', '');
      menuBtn?.setAttribute('aria-expanded', 'false');
      lenis?.start();
    }
  }

  menuBtn?.addEventListener('click', openMobileMenu);
  closeMenuBtn?.addEventListener('click', closeMobileMenu);

  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          closeMobileMenu();
          smoothScrollTo(targetEl);
        }
      }
    });
  });

  // "Back to the window" button in footer
  document.querySelectorAll('button').forEach((btn) => {
    if (btn.textContent.trim().toLowerCase().includes('back to the window')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo(0);
      });
    }
  });

  // Floating mobile CTA
  const floatingBtn = document.querySelector('.fixed.inset-x-0.bottom-\\[max\\(1\\.25rem\\,env\\(safe-area-inset-bottom\\)\\)\\]');
  if (floatingBtn) {
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom top',
      onToggle: (self) => {
        if (self.isActive) {
          floatingBtn.classList.remove('pointer-events-none', 'translate-y-6', 'opacity-0');
          floatingBtn.classList.add('translate-y-0', 'opacity-100');
        } else {
          floatingBtn.classList.remove('translate-y-0', 'opacity-100');
          floatingBtn.classList.add('pointer-events-none', 'translate-y-6', 'opacity-0');
        }
      },
    });
  }
}

// DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  initLoaderAndHero();
  initAboutSection();
  initCloudRiseAndLightZone();
  initFleetSection();
  initAdvantagesAccordion();
  initGlobalAnimations();
  initInquiries();
  initBookingModal();
  initNavigation();

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});

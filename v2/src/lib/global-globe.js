import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initGlobalAnimations({
  globalSection = document.querySelector('#global'),
  stage = globalSection?.querySelector('.stage'),
  title = globalSection?.querySelector('#global-title'),
  globeBox = globalSection?.querySelector('.globe-box'),
  globeImg = globeBox?.querySelector('img'),
  arcs = globalSection?.querySelectorAll('[data-arc]'),
  dots = globalSection?.querySelectorAll('[data-arc-dot]'),
  items = globalSection?.querySelectorAll('[data-global-item]'),
  boardingPass = globalSection?.querySelector('.stage-safe > div.invisible.absolute.bottom-\\[13\\%\\], .stage-safe > div.invisible.absolute.md\\:bottom-\\[11\\%\\]'),
  cities = [
    'London', 'Geneva', 'Nice', 'Mykonos', 'Dubai', 'Marrakech',
    'Cape Town', 'New York', 'Aspen', 'Miami', 'Los Angeles', 'Mexico City',
    'São Paulo', 'Tokyo', 'Singapore', 'Hong Kong', 'Sydney', 'Paris',
    'Milan', 'St. Moritz', 'Maldives', 'Riyadh',
  ],
} = {}) {
  if (!globalSection || !stage || !globeBox) return null;

  if (items) items.forEach((it) => it.classList.remove('invisible'));
  if (boardingPass) boardingPass.classList.remove('invisible');

  const globalTL = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: globalSection,
      start: 'top top',
      end: () => `+=${Math.round(2.2 * window.innerHeight)}`,
      scrub: 1,
      pin: stage,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 5,
    },
  });

  globalTL
    .fromTo(title, { yPercent: 30, autoAlpha: 0.2 }, { yPercent: 0, autoAlpha: 1, ease: 'power2.out', duration: 2.2 }, 0)
    .fromTo(globeBox, { y: () => 0.55 * window.innerHeight, scale: 0.84 }, { y: 0, scale: 1, ease: 'power2.out', duration: 4 }, 0)
    .fromTo(globeImg, { rotation: 10 }, { rotation: -6, duration: 7 }, 0);

  if (arcs?.length) {
    globalTL.fromTo(arcs, { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.35, duration: 2.2 }, 2);
  }

  if (items?.length) {
    globalTL.fromTo(items, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: 'power2.out', stagger: 0.15, duration: 1.3 }, 3);
  }

  if (boardingPass) {
    globalTL.fromTo(
      boardingPass,
      { autoAlpha: 0, y: 160, rotation: 8 },
      { autoAlpha: 1, y: 0, rotation: -3, ease: 'power2.out', duration: 2.2 },
      3.6
    );
  }

  // City Carousel Ticker
  const citySpan = globalSection.querySelector('[data-global-item] .relative.inline-flex span');
  let cityTimer = null;
  let currentCityIdx = 0;

  if (citySpan) {
    cityTimer = setInterval(() => {
      currentCityIdx = (currentCityIdx + 1) % cities.length;
      citySpan.style.opacity = '0';
      citySpan.style.transform = 'translateY(12px)';

      setTimeout(() => {
        citySpan.textContent = cities[currentCityIdx];
        citySpan.style.opacity = '1';
        citySpan.style.transform = 'translateY(0)';
      }, 300);
    }, 2000);
  }

  return {
    timeline: globalTL,
    destroy: () => {
      if (cityTimer) clearInterval(cityTimer);
    },
  };
}

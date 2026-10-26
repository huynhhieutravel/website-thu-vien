import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroAnimations({
  heroSection = document.querySelector('#hero'),
  stage = heroSection?.querySelector('.stage'),
  windowBox = heroSection?.querySelector('.window-box'),
  stageSafe = heroSection?.querySelector('.stage-safe > div'),
  leadChars = heroSection?.querySelectorAll('[data-hero-lead] [data-char]'),
  counterChars = heroSection?.querySelectorAll('[data-hero-counter] [data-char]'),
  bottomMeta = heroSection?.querySelector('.stage-safe > div > div.hidden.md\\:block'),
  scrollCue = heroSection?.querySelector('.stage-safe .bottom-24, .stage-safe .md\\:bottom-\\[9\\%\\]'),
  quoteOverlay = heroSection?.querySelector('.stage-safe > div.invisible'),
  skyZoom = document.querySelector('[data-sky="zoom"]'),
  skySweep = document.querySelector('[data-sky="sweep"]'),
  flyingWordmark = document.querySelector('[data-flying-wordmark]'),
  header = document.querySelector('header'),
} = {}) {
  if (!heroSection || !stage || !windowBox) return null;

  // Initial styling for entrance
  if (leadChars) gsap.set(leadChars, { autoAlpha: 0, yPercent: 35, filter: 'blur(14px)' });
  if (counterChars) gsap.set(counterChars, { autoAlpha: 0, yPercent: 35, filter: 'blur(14px)' });
  if (bottomMeta) gsap.set(bottomMeta, { autoAlpha: 0, y: 24 });
  if (scrollCue) gsap.set(scrollCue, { autoAlpha: 0, y: 24 });

  function playIntro() {
    if (header) {
      header.classList.remove('pointer-events-none', 'opacity-0');
      header.classList.add('opacity-100');
    }

    const introTL = gsap.timeline({ delay: 0.2 });

    if (leadChars) {
      introTL.to(
        leadChars,
        {
          autoAlpha: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power3.out',
          stagger: 0.045,
        },
        0
      );
    }

    if (counterChars) {
      introTL.to(
        counterChars,
        {
          autoAlpha: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power3.out',
          stagger: 0.045,
        },
        0.45
      );
    }

    const heroFooterItems = [bottomMeta, scrollCue].filter(Boolean);
    if (heroFooterItems.length) {
      introTL.to(
        heroFooterItems,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.15,
        },
        0.9
      );
    }

    return introTL;
  }

  // Scroll timeline
  const getTargetScale = () => {
    if (!flyingWordmark) return 1;
    const currentFontSize = parseFloat(window.getComputedStyle(flyingWordmark).fontSize) || 40;
    return (window.innerWidth < 768 ? 19 : 22) / currentFontSize;
  };
  const getTopOffset = () => (window.innerWidth < 768 ? 32 : 40);

  const heroScrollTL = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: () => `+=${Math.round(2.5 * window.innerHeight)}`,
      scrub: 1,
      pin: stage,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 10,
    },
  });

  heroScrollTL
    .to(windowBox, { scale: 5.4, ease: 'power2.in', duration: 6.2 }, 0)
    .to(windowBox, { autoAlpha: 0, duration: 0.6 }, 5.8)
    .to(skyZoom, { scale: 1.15, duration: 7 }, 0)
    .to(stageSafe, { scale: 2.4, autoAlpha: 0, ease: 'power2.in', duration: 3.4 }, 0)
    .to(scrollCue, { autoAlpha: 0, duration: 0.7 }, 0);

  if (skySweep) {
    heroScrollTL
      .fromTo(
        skySweep,
        { xPercent: 30, autoAlpha: 0 },
        { xPercent: -10, autoAlpha: 0.95, ease: 'power1.in', duration: 2.6 },
        2.6
      )
      .to(skySweep, { xPercent: -45, autoAlpha: 0, ease: 'power1.out', duration: 2 }, 5.2);
  }

  if (quoteOverlay) {
    quoteOverlay.classList.remove('invisible');
    heroScrollTL
      .fromTo(
        quoteOverlay,
        { y: 150, scale: 0.85, autoAlpha: 0, filter: 'blur(10px)' },
        { y: 0, scale: 1, autoAlpha: 1, filter: 'blur(0px)', ease: 'power3.out', duration: 3.2 },
        6.1
      )
      .to({}, { duration: 0.7 });
  }

  if (flyingWordmark) {
    heroScrollTL.to(
      flyingWordmark,
      {
        y: () => getTopOffset() - window.innerHeight / 2,
        scale: getTargetScale,
        ease: 'power2.inOut',
        duration: 4.8,
      },
      0.9
    );
  }

  return { scrollTimeline: heroScrollTL, playIntro };
}

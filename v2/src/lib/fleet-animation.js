import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initFleetAnimations({
  fleetSection = document.querySelector('#fleet'),
  stage = fleetSection?.querySelector('.stage'),
  jetBox = fleetSection?.querySelector('.jet-box'),
  title = fleetSection?.querySelector('#fleet-title'),
  titleLines = fleetSection?.querySelectorAll('[data-fleet-line]'),
  floorPlan = fleetSection?.querySelector('[data-floor-plan]'),
  planStrokes = fleetSection?.querySelectorAll('[data-plan-stroke]'),
  leftSpecs = fleetSection?.querySelectorAll('.stage-safe > div.absolute.bottom-\\[12\\%\\] [data-fleet-item], .stage-safe > div.md\\:top-\\[15\\%\\] [data-fleet-item]'),
  rightDesc = fleetSection?.querySelectorAll('.stage-safe > div.right-\\[6vw\\] [data-fleet-item]'),
} = {}) {
  if (!fleetSection || !stage || !jetBox) return null;

  const isMobile = window.innerWidth < 768;
  const finalJetPos = isMobile
    ? { y: () => -0.22 * window.innerHeight, scale: 0.55 }
    : { y: 0, scale: 0.88 };

  if (floorPlan) floorPlan.classList.remove('invisible');
  if (leftSpecs) leftSpecs.forEach((el) => el.classList.remove('invisible'));
  if (rightDesc) rightDesc.forEach((el) => el.classList.remove('invisible'));

  const fleetTL = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: fleetSection,
      start: 'top top',
      end: () => `+=${Math.round(3.2 * window.innerHeight)}`,
      scrub: 1,
      pin: stage,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 7,
    },
  });

  fleetTL
    .fromTo(
      jetBox,
      { y: () => 0.95 * window.innerHeight, rotation: -9, scale: 1.12 },
      { y: 0, rotation: 0, scale: 1, ease: 'power2.out', duration: 4 },
      0
    )
    .fromTo(
      titleLines,
      { y: 0 },
      { y: () => 0.14 * window.innerHeight, stagger: 0.3, duration: 3.6 },
      0
    )
    .to(title, { autoAlpha: 0, duration: 1.2 }, 3.2);

  if (floorPlan) {
    fleetTL.fromTo(floorPlan, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 4.3);
  }

  if (planStrokes?.length) {
    fleetTL.fromTo(
      planStrokes,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.2, stagger: 0.03 },
      4.4
    );
  }

  fleetTL.to(jetBox, { ...finalJetPos, ease: 'power2.inOut', duration: 1.8 }, 6.4);

  if (leftSpecs?.length) {
    fleetTL.fromTo(
      leftSpecs,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, ease: 'power2.out', stagger: 0.12, duration: 1.2 },
      6.7
    );
  }

  if (rightDesc?.length) {
    fleetTL.fromTo(
      rightDesc,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, ease: 'power2.out', stagger: 0.12, duration: 1.2 },
      7
    );
  }

  fleetTL.to({}, { duration: 1 });
  return fleetTL;
}

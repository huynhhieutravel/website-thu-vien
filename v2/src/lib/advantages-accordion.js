import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAdvantagesAccordion({
  advSection = document.querySelector('#advantages'),
  items = [
    { id: 'pets', btnId: 'advantage-pets', panelId: 'advantage-panel-pets', label: 'Pets welcome' },
    { id: 'concierge', btnId: 'advantage-concierge', panelId: 'advantage-panel-concierge', label: '24/7 concierge' },
    { id: 'dining', btnId: 'advantage-dining', panelId: 'advantage-panel-dining', label: 'Onboard dining' },
    { id: 'boarding', btnId: 'advantage-boarding', panelId: 'advantage-panel-boarding', label: 'Effortless boarding' },
  ],
} = {}) {
  if (!advSection) return null;

  // Reveal section header
  const reveals = advSection.querySelectorAll('[data-reveal]');
  reveals.forEach((r) => {
    gsap.fromTo(
      r,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: r,
          start: 'top 92%',
          end: 'top 65%',
          scrub: 1,
        },
      }
    );
  });

  const mediaContainer = advSection.querySelector('[data-advantage-media]');
  const mediaLayers = mediaContainer?.querySelectorAll('div[aria-hidden]');
  const mediaLabel = mediaContainer?.querySelector('p');

  items.forEach((item, index) => {
    const btn = document.getElementById(item.btnId);
    const panel = document.getElementById(item.panelId);

    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      items.forEach((other, otherIdx) => {
        const oBtn = document.getElementById(other.btnId);
        const oPanel = document.getElementById(other.panelId);
        const isTarget = other.id === item.id;

        if (oBtn && oPanel) {
          oBtn.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
          oPanel.setAttribute('data-open', isTarget ? 'true' : 'false');

          const iconContainer = oBtn.querySelector('span:last-child');
          if (iconContainer) {
            iconContainer.innerHTML = isTarget
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus size-4"><path d="M5 12h14"></path></svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus size-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>`;
          }

          const titleSpan = oBtn.querySelector('span.font-heading');
          if (titleSpan) {
            if (isTarget) {
              titleSpan.className = 'font-heading text-[1.9rem] font-normal leading-none transition-colors duration-500 md:text-[2.2rem] text-obsidian';
            } else {
              titleSpan.className = 'font-heading text-[1.9rem] font-normal leading-none transition-colors duration-500 md:text-[2.2rem] text-obsidian/55 group-hover:text-obsidian group-focus-visible:text-obsidian';
            }
          }
        }

        if (mediaLayers && mediaLayers[otherIdx]) {
          const layer = mediaLayers[otherIdx];
          const isTarget = otherIdx === index;
          layer.setAttribute('aria-hidden', isTarget ? 'false' : 'true');
          layer.className = `absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isTarget ? 'opacity-100' : 'opacity-0'}`;
          layer.style.transform = isTarget ? 'scale(1)' : 'scale(1.08)';
        }
      });

      if (mediaLabel) {
        mediaLabel.textContent = item.label;
      }
    });
  });

  // Live Local Time ticker
  const clockEl = advSection.querySelector('.tabular-nums');
  let timerId = null;
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    };
    updateClock();
    timerId = setInterval(updateClock, 1000);
  }

  return {
    destroy: () => {
      if (timerId) clearInterval(timerId);
    },
  };
}

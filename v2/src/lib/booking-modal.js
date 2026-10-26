import { getLenis } from './smooth-scroll.js';

export function initBookingModal({
  dialog = document.querySelector('dialog.booking-dialog'),
  form = dialog?.querySelector('form'),
  closeBtn = dialog?.querySelector('button[aria-label="Close"]'),
  openButtons = document.querySelectorAll('button:has(svg.lucide-arrow-up-right), header button, footer button'),
} = {}) {
  if (!dialog) return null;

  function openModal() {
    if (!dialog.open) {
      dialog.showModal();
      getLenis()?.stop();
    }
  }

  function closeModal() {
    if (dialog.open) {
      dialog.close();
      getLenis()?.start();
    }
  }

  document.querySelectorAll('button').forEach((btn) => {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes('book a flight') || text.includes('fly the flagship')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      closeModal();
    }
  });

  dialog.addEventListener('close', () => {
    getLenis()?.start();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredFields = ['fullName', 'email', 'departure', 'destination', 'travelDate'];
      let isValid = true;
      const formData = new FormData(form);

      requiredFields.forEach((field) => {
        const input = form.querySelector(`[name="${field}"]`);
        if (!input) return;
        const val = input.value.trim();

        if (!val || (field === 'email' && !val.includes('@'))) {
          input.setAttribute('aria-invalid', 'true');
          isValid = false;
        } else {
          input.setAttribute('aria-invalid', 'false');
        }
      });

      if (!isValid) return;

      const userEmail = formData.get('email') || 'your email';

      const contentWrapper = dialog.querySelector('.relative.px-6');
      if (contentWrapper) {
        contentWrapper.innerHTML = `
          <button type="button" id="booking-success-close" aria-label="Close" class="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-champagne/20 text-champagne transition-colors hover:bg-champagne hover:text-obsidian focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne md:right-6 md:top-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x size-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
          <div class="flex min-h-[420px] flex-col items-start justify-center gap-6 pr-10" role="status">
            <span class="flex size-14 items-center justify-center rounded-full border border-champagne/40 text-champagne">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-6"><path d="M20 6 9 17l-5-5"></path></svg>
            </span>
            <h2 id="booking-title" class="font-heading text-[clamp(2.2rem,5vw,3.4rem)] font-light leading-[1.02]">Thank you, your request is with us.</h2>
            <p class="max-w-md text-[15px] leading-relaxed text-ivory/70">
              A member of the AERIVE flight team will reply personally to <span class="text-champagne font-medium">${userEmail}</span> with tailored options for your journey.
            </p>
            <button type="button" id="booking-success-btn" class="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-champagne/30 px-6 text-[11px] uppercase tracking-[0.2em] text-champagne transition-colors hover:bg-champagne hover:text-obsidian">
              Return to website
            </button>
          </div>
        `;

        document.getElementById('booking-success-close')?.addEventListener('click', closeModal);
        document.getElementById('booking-success-btn')?.addEventListener('click', closeModal);
      }
    });
  }

  return { openModal, closeModal };
}

/* ─── HEADER SCROLL ─── */
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ─── MOBILE NAV ─── */
const navToggle = document.getElementById('nav-toggle');
const headerNav = document.getElementById('header-nav');

function closeNav() {
  document.body.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

if (navToggle && headerNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  headerNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });
}

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-qitem').forEach(item => {
  const trigger = item.querySelector('.faq-qitem-q');
  if (!trigger) return;
  const toggle = () => {
    const open = item.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(open));
  };
  trigger.addEventListener('click', toggle);
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});

/* ─── MODAL ─── */
const overlay = document.getElementById('modal-overlay');
const modalEl = overlay?.querySelector('.modal');
let _modalTrigger = null;

const FOCUSABLE_SEL = 'input:not([disabled]),textarea:not([disabled]),button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])';

function openModal(trigger) {
  if (overlay) {
    _modalTrigger = trigger || document.activeElement;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const first = modalEl?.querySelector(FOCUSABLE_SEL);
      first?.focus();
    }, 60);
  }
}

function closeModal() {
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    _modalTrigger?.focus();
    _modalTrigger = null;
  }
}

document.querySelectorAll('[data-modal="open"]').forEach(el => {
  el.addEventListener('click', function() { openModal(this); });
});

document.querySelectorAll('[data-modal="close"]').forEach(el => {
  el.addEventListener('click', closeModal);
});

overlay?.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

overlay?.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key !== 'Tab' || !modalEl) return;
  const focusable = [...modalEl.querySelectorAll(FOCUSABLE_SEL)];
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeNav();
  }
});

/* ─── FORM SUBMIT ─── */
const form = document.getElementById('order-form');
if (form) {
  const tgInput  = form.querySelector('#telegram');
  const dcInput  = form.querySelector('#discord');

  function showContactError(show) {
    let err = form.querySelector('.form-contact-error');
    if (show) {
      if (!err) {
        err = document.createElement('p');
        err.className = 'form-contact-error';
        err.setAttribute('role', 'alert');
        err.textContent = 'Укажи Telegram или Discord — нужен хотя бы один контакт.';
        err.style.cssText = 'font-size:12px;color:#ff5555;margin:-4px 0 10px;';
        tgInput?.closest('.form-grid')?.insertAdjacentElement('afterend', err);
      }
      tgInput?.classList.add('input-error');
      dcInput?.classList.add('input-error');
      tgInput?.setAttribute('aria-invalid', 'true');
      dcInput?.setAttribute('aria-invalid', 'true');
    } else {
      err?.remove();
      tgInput?.classList.remove('input-error');
      dcInput?.classList.remove('input-error');
      tgInput?.removeAttribute('aria-invalid');
      dcInput?.removeAttribute('aria-invalid');
    }
  }

  tgInput?.addEventListener('input', () => { if (tgInput.value.trim() || dcInput?.value.trim()) showContactError(false); });
  dcInput?.addEventListener('input', () => { if (tgInput?.value.trim() || dcInput.value.trim()) showContactError(false); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!tgInput?.value.trim() && !dcInput?.value.trim()) {
      showContactError(true);
      tgInput?.focus();
      return;
    }
    showContactError(false);
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Отправлено!';
    btn.style.background = 'rgba(197,224,0,0.15)';
    btn.style.borderColor = 'rgba(197,224,0,0.35)';
    setTimeout(() => {
      closeModal();
      btn.textContent = 'Приобрести';
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 2000);
  });
}

/* ─── TESTIMONIALS ARROWS ─── */
const tmSlider = document.getElementById('tm-slider');
const tmPrev   = document.getElementById('tm-prev');
const tmNext   = document.getElementById('tm-next');

if (tmSlider && (tmPrev || tmNext)) {
  const scrollByCard = (dir) => {
    const card = tmSlider.querySelector('.tm-card');
    if (!card) return;
    const gap = 14;
    const amount = (card.offsetWidth + gap) * dir;
    tmSlider.scrollBy({ left: amount, behavior: 'smooth' });
  };
  tmPrev?.addEventListener('click', () => scrollByCard(-1));
  tmNext?.addEventListener('click', () => scrollByCard(1));
}

/* ─── SCROLL REVEAL ─── */
const REVEAL_SELECTORS = [
  '.feature-item',
  '.hero-stats',
  '.faq-qitem',
  '.faq-cta',
  '.pricing-card',
  '.pricing-badge',
  '.pricing-desc',
  '.category-block',
  '.partners-main-heading',
].join(',');

const revealEls = document.querySelectorAll(REVEAL_SELECTORS);

if (revealEls.length) {
  revealEls.forEach(el => el.classList.add('will-reveal'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

  revealEls.forEach(el => io.observe(el));
}

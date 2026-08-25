/* ─── HEADER SCROLL ─── */
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-qitem').forEach(item => {
  item.querySelector('.faq-qitem-q')?.addEventListener('click', () => {
    item.classList.toggle('open');
  });
});

/* ─── MODAL ─── */
const overlay = document.getElementById('modal-overlay');

function openModal() {
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('[data-modal="open"]').forEach(el => {
  el.addEventListener('click', openModal);
});

document.querySelectorAll('[data-modal="close"]').forEach(el => {
  el.addEventListener('click', closeModal);
});

overlay?.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ─── FORM SUBMIT ─── */
const form = document.getElementById('order-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Отправлено!';
    btn.style.background = 'rgba(197,224,0,0.15)';
    btn.style.borderColor = 'rgba(197,224,0,0.35)';
    setTimeout(() => {
      closeModal();
      btn.textContent = 'Оставить заявку';
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 2000);
  });
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

'use strict';
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-demo]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  const correct = button.dataset.demo === 'nube';
  document.getElementById('demoResult').textContent = correct
    ? '¡Exacto! Nube coincide en orejas triangulares y bolsa. Una sola característica no bastaba.'
    : 'Revisa las dos características juntas. Teo tiene carro; Ada, orejas largas; Leo, orejas redondas. Puedes intentarlo otra vez.';
}));
const cfg = window.OFFER_CONFIG || {};
const imageDialog = document.getElementById('imageDialog');
let lastFocus = null;
function openDialog(dialog) { lastFocus = document.activeElement; dialog.showModal(); document.body.classList.add('modal-open'); }
document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
  const image = imageDialog.querySelector('img'); image.src = button.dataset.preview; image.alt = button.dataset.alt; openDialog(imageDialog);
}));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (lastFocus) lastFocus.focus(); });
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); });
});
function checkoutTarget() {
  try {
    if (!cfg.checkoutUrl) return null;
    const target = new URL(cfg.checkoutUrl);
    if (target.protocol !== 'https:') return null;
    for (const [key, value] of new URLSearchParams(location.search)) {
      if ((key.startsWith('utm_') || ['fbclid', 'sck', 'src'].includes(key)) && !target.searchParams.has(key)) target.searchParams.set(key, value);
    }
    return target.href;
  } catch { return null; }
}
const sticky = document.querySelector('.sticky');
const stickyCta = document.querySelector('[data-sticky-cta]');
const configuredCheckout = checkoutTarget();
if (configuredCheckout && stickyCta) {
  stickyCta.href = configuredCheckout;
  stickyCta.replaceChildren(document.createTextNode('Quiero el kit →'));
  stickyCta.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('villa-luna:checkout-click', { detail: { value: 9.99, currency: 'USD' } }));
  });
}
// Evita duplicar botones en pantalla cuando la compra principal ya es visible.
if (sticky && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    sticky.hidden = entries[0].isIntersecting;
  }, { threshold: 0.5, rootMargin: '0px 0px -80px 0px' });
  observer.observe(document.querySelector('[data-buy]'));
}
document.querySelectorAll('[data-buy]').forEach(button => button.addEventListener('click', () => {
  const target = checkoutTarget();
  if (!target) { openDialog(document.getElementById('checkoutDialog')); return; }
  // Evento de intenção local; Purchase/InitiateCheckout devem ser confirmados pela integração real do checkout.
  window.dispatchEvent(new CustomEvent('villa-luna:checkout-click', { detail: { value: 9.99, currency: 'USD' } }));
  location.assign(target);
}));
if (cfg.deliveryText) document.getElementById('accessInfo').textContent = cfg.deliveryText;
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.supportEmail || '')) {
  const link = document.createElement('a'); link.href = 'mailto:' + cfg.supportEmail; link.textContent = 'Contacto: ' + cfg.supportEmail; document.getElementById('support').append(link);
}

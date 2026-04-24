// ============================================================
// BRENT ELECTRICAL — Interactions
// ============================================================

// --- Sticky nav background on scroll ---
const nav = document.getElementById('nav');
const updateNav = () => {
  if (window.scrollY > 30) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

// --- Mobile menu ---
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navMobile.classList.remove('open');
  });
});

// --- Reveal on scroll with staggered delay ---
const revealItems = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0, 10);
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealItems.forEach(el => io.observe(el));

// --- Stat counter animation ---
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterIO.observe(c));

// --- Year in footer ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- Contact form → WhatsApp handoff ---
// On submit, build a pre-filled WhatsApp message from the form fields and
// open the user's WhatsApp (mobile app or web) addressed to the business number.
const WA_NUMBER = '447958313181'; // international format, no leading + or spaces
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = (document.getElementById('name').value    || '').trim();
  const email   = (document.getElementById('email').value   || '').trim();
  const phone   = (document.getElementById('phone').value   || '').trim();
  const type    = (document.getElementById('type').value    || '').trim();
  const brief   = (document.getElementById('message').value || '').trim();

  // Build a friendly, structured message. Start with the greeting the user asked for.
  let lines = [];
  lines.push(`Hello, I'd like to request a price for ${type ? type.toLowerCase() : '...'}`);
  lines.push('');
  if (name)  lines.push(`Name: ${name}`);
  if (email) lines.push(`Email: ${email}`);
  if (phone) lines.push(`Phone: ${phone}`);
  if (brief) {
    lines.push('');
    lines.push('Brief:');
    lines.push(brief);
  }

  const text = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${WA_NUMBER}?text=${text}`;

  // Open in a new tab so the site stays open behind WhatsApp
  window.open(url, '_blank', 'noopener');
});

// --- Smooth anchor scroll with offset for fixed nav ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

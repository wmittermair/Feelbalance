'use strict';

/* ============================================
   feel-balance · Main JavaScript
   ============================================ */

// ── NAV scroll effect ──────────────────────────────────────────────────────────
const nav = document.getElementById('nav');

const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile nav toggle ──────────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ── Scroll reveal ──────────────────────────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 80, 400);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ── Active nav link on scroll ──────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ── Contact form ───────────────────────────────────────────────────────────────
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Wird gesendet …';

    // Validate required fields
    const name  = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();

    if (!name || !email) {
      btn.disabled = false;
      btn.textContent = 'Nachricht senden';
      highlightInvalid(form);
      return;
    }

    // Simulate send (replace with real fetch to backend/formspree/netlify etc.)
    await new Promise(resolve => setTimeout(resolve, 1200));

    form.style.opacity = '0';
    form.style.transform = 'translateY(10px)';
    setTimeout(() => {
      form.hidden = true;
      formSuccess.hidden = false;
      formSuccess.style.animation = 'fadeIn .5s ease forwards';
    }, 300);
  });
}

function highlightInvalid(form) {
  form.querySelectorAll('[required]').forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#c0392b';
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      }, { once: true });
    }
  });
}

// ── Footer year ────────────────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Smooth anchor scroll (fallback for browsers without CSS smooth scroll) ─────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

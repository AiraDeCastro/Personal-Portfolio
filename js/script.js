// ==========================================================================
// Header: solid background after scrolling past the hero
// ==========================================================================
const header = document.getElementById('siteHeader');
const scrollThreshold = 60;

function updateHeader() {
  if (window.scrollY > scrollThreshold) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// ==========================================================================
// Mobile nav toggle
// ==========================================================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  header.classList.toggle('nav-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    header.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ==========================================================================
// Reveal-on-scroll
// ==========================================================================
const revealTargets = document.querySelectorAll(
  '.section-tag, .section-heading, .about-body, .about-stats, .project-card, .skill-block, .contact-links, .work-cta'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);
revealTargets.forEach((el) => observer.observe(el));

// ==========================================================================
// Footer year
// ==========================================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================================================
// "In Progress" badges — driven by public/data/projects-status.json,
// edited via admin.html
// ==========================================================================
fetch('/data/projects-status.json')
  .then((res) => (res.ok ? res.json() : {}))
  .then((statusById) => {
    Object.entries(statusById).forEach(([id, status]) => {
      if (status !== 'in-progress') return;
      const card = document.querySelector(`.project-card[data-project-id="${id}"]`);
      if (!card) return;
      const badge = document.createElement('span');
      badge.className = 'project-badge';
      badge.textContent = 'In Progress';
      card.querySelector('.project-media').appendChild(badge);
    });
  })
  .catch(() => {
    // Status file missing or unreachable — cards just show with no badge.
  });

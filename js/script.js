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
  '.section-tag, .section-heading, .about-body, .about-stats, .project-card, .skill-block, .contact-links, .work-cta, .activity-chart'
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
// Project focus trail — a single outline that glides to whichever card the
// mouse is over or keyboard focus is in; the other cards recede
// ==========================================================================
const projectGrid = document.querySelector('.project-grid');

if (projectGrid) {
  const trailPadding = 14;
  const projectCards = [...projectGrid.querySelectorAll('.project-card')];
  const trail = document.createElement('div');
  trail.className = 'focus-trail';
  trail.setAttribute('aria-hidden', 'true');
  projectGrid.prepend(trail);

  let activeCard = null;

  const placeTrail = (card) => {
    trail.style.width = `${card.offsetWidth + trailPadding * 2}px`;
    trail.style.height = `${card.offsetHeight + trailPadding * 2}px`;
    trail.style.transform = `translate(${card.offsetLeft - trailPadding}px, ${card.offsetTop - trailPadding}px)`;
  };

  const focusCard = (card) => {
    if (card === activeCard) return;
    const isFirst = !trail.classList.contains('is-active');

    if (isFirst) {
      // Appear in place rather than sliding in from the grid's corner.
      trail.style.transition = 'none';
      placeTrail(card);
      void trail.offsetWidth;
      trail.style.transition = '';
    } else {
      placeTrail(card);
    }

    activeCard = card;
    trail.classList.add('is-active');
    projectGrid.classList.add('has-focus');
    projectCards.forEach((c) => c.classList.toggle('is-focused', c === card));
  };

  const clearTrail = () => {
    activeCard = null;
    trail.classList.remove('is-active');
    projectGrid.classList.remove('has-focus');
    projectCards.forEach((c) => c.classList.remove('is-focused'));
  };

  projectCards.forEach((card) => {
    // Mouse only — touch taps shouldn't leave a card stuck highlighted.
    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') focusCard(card);
    });
    card.addEventListener('focusin', () => focusCard(card));
  });

  projectGrid.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') clearTrail();
  });
  projectGrid.addEventListener('focusout', (event) => {
    if (!projectGrid.contains(event.relatedTarget)) clearTrail();
  });
  window.addEventListener('resize', () => {
    if (activeCard) placeTrail(activeCard);
  });
}

// ==========================================================================
// Footer year
// ==========================================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================================================
// GitHub activity chart — falls back to a text link if the third-party
// chart image (ghchart.rshah.org) is ever unavailable
// ==========================================================================
const activityChart = document.getElementById('activityChart');
const activityImg = activityChart?.querySelector('img');

activityImg?.addEventListener(
  'error',
  () => activityChart.classList.add('is-unavailable'),
  { once: true }
);

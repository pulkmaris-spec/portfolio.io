// ============================================================
// Header: blurred background on scroll
// ============================================================
const header = document.getElementById('siteHeader');
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 8);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ============================================================
// Hero glow: subtle drift toward cursor position
// ============================================================
const heroGlow = document.querySelector('.hero-glow');
if (heroGlow) {
  const maxOffset = 100;
  window.addEventListener('mousemove', (e) => {
    const dx = (e.clientX / window.innerWidth - 0.5) * 2;
    const dy = (e.clientY / window.innerHeight - 0.5) * 2;
    heroGlow.style.translate = `${dx * maxOffset}px ${dy * maxOffset}px`;
  }, { passive: true });
}

// ============================================================
// Mobile menu toggle
// ============================================================
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const menuToggleText = menuToggle.querySelector('.menu-toggle-text');

function setMenuOpen(open) {
  mobileNav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggleText.textContent = open ? 'Close Menu' : 'Menu';
  document.body.style.overflow = open ? 'hidden' : '';
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(!mobileNav.classList.contains('open'));
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

// ============================================================
// Scroll-triggered fade-in animations
// ============================================================
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
fadeEls.forEach((el) => observer.observe(el));

// ============================================================
// Horizontal scroll-snap carousels (How I Work, Experience)
// ============================================================
function initCarousel({ trackId, dotsId, prevId, nextId, dotLabel }) {
  const track = document.getElementById(trackId);
  const dotsWrap = document.getElementById(dotsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  let activeIndex = 0;
  let isProgrammaticScroll = false;

  function scrollToCard(i) {
    isProgrammaticScroll = true;
    track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    window.clearTimeout(scrollToCard._resetTimer);
    scrollToCard._resetTimer = window.setTimeout(() => { isProgrammaticScroll = false; }, 600);
  }

  const dots = cards.map((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `${dotLabel} ${i + 1}`);
    dot.addEventListener('click', () => goToIndex(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function setActiveIndex(active) {
    activeIndex = active;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
    prevBtn.disabled = active === 0;
    nextBtn.disabled = active === cards.length - 1;
  }

  function goToIndex(i) {
    const target = Math.min(cards.length - 1, Math.max(0, i));
    scrollToCard(target);
    setActiveIndex(target);
  }

  function getScrollIndex() {
    const trackLeft = track.scrollLeft;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - track.offsetLeft - trackLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  prevBtn.addEventListener('click', () => goToIndex(activeIndex - 1));
  nextBtn.addEventListener('click', () => goToIndex(activeIndex + 1));

  // Sync state when the user swipes/drags the track directly (not via buttons).
  track.addEventListener('scroll', () => {
    if (isProgrammaticScroll) return;
    setActiveIndex(getScrollIndex());
  }, { passive: true });

  track.scrollLeft = 0;
  setActiveIndex(0);
}

initCarousel({ trackId: 'processTrack', dotsId: 'processDots', prevId: 'processPrev', nextId: 'processNext', dotLabel: 'Go to step' });
initCarousel({ trackId: 'experienceTrack', dotsId: 'experienceDots', prevId: 'experiencePrev', nextId: 'experienceNext', dotLabel: 'Go to role' });

// ============================================================
// Work card tags: fade edge + scroll hint when tags overflow
// ============================================================
function updateTagOverflow() {
  document.querySelectorAll('.work-card-tags').forEach((el) => {
    el.classList.toggle('has-overflow', el.scrollWidth > el.clientWidth + 1);
  });
}
updateTagOverflow();
window.addEventListener('resize', updateTagOverflow, { passive: true });

// ============================================================
// Back to top button
// ============================================================
const backToTop = document.getElementById('backToTop');
function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 1200);
}
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ============================================================
// Footer year
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

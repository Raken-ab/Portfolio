// Mobile nav toggle (guarded)
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// HUD state label — reflects which section is in view (guarded)
const hudValue = document.getElementById('hudValue');
const sections = document.querySelectorAll('main [data-state]');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && hudValue && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          try {
            hudValue.textContent = entry.target.dataset.state || '';
          } catch (e) {
            // ignore write errors to hudValue
          }
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
}

// FSM diagram: step through nodes to suggest a state machine in motion
const fsmNodes = document.querySelectorAll('.fsm-node');
if (fsmNodes.length) {
  if (!reduceMotion) {
    let current = 0;
    setInterval(() => {
      fsmNodes.forEach((node) => node.classList.remove('is-active'));
      if (fsmNodes[current]) fsmNodes[current].classList.add('is-active');
      current = (current + 1) % fsmNodes.length;
    }, 1100);
  } else {
    fsmNodes[0].classList.add('is-active');
  }
}
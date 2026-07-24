// Mobile nav toggle
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

// HUD state label — reflects which section is in view
const hudValue = document.getElementById('hudValue');
const sections = document.querySelectorAll('main [data-state]');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          hudValue.textContent = entry.target.dataset.state;
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
}

// Project modal popup
const projectModal = document.querySelector('.project-modal');
const projectModalClose = document.querySelector('.project-modal__close');
const projectModalBackdrop = document.querySelector('[data-modal-close]');
const modalTitle = document.querySelector('.project-modal__title');
const modalTag = document.querySelector('.project-modal__tag');
const modalDescription = document.querySelector('.project-modal__description');
const modalFeatures = document.querySelector('.project-modal__features');
const modalLink = document.querySelector('.project-modal__link');
const modalImage = document.querySelector('.project-modal__image');

function openProjectModal(project) {
  if (!projectModal || !modalTitle || !modalTag || !modalDescription || !modalFeatures || !modalLink || !modalImage) {
    return;
  }

  modalTag.textContent = project.type || '';
  modalTitle.textContent = project.title || '';
  modalDescription.textContent = project.description || '';
  modalImage.src = project.image || '';
  modalImage.alt = project.title ? `${project.title} preview` : 'Project preview';

  modalFeatures.innerHTML = '';
  (project.features || '').split('|').forEach((feature) => {
    const trimmedFeature = feature.trim();
    if (trimmedFeature) {
      const li = document.createElement('li');
      li.textContent = trimmedFeature;
      modalFeatures.appendChild(li);
    }
  });

  modalLink.href = project.link || '#';
  modalLink.textContent = project.linkText || 'Learn more';

  projectModal.classList.add('is-visible');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove('is-visible');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

const projectCards = document.querySelectorAll('.project-card[data-title]');
projectCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (card.dataset.locked === 'true') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    openProjectModal({
      title: card.dataset.title,
      type: card.dataset.type,
      image: card.dataset.image,
      description: card.dataset.description,
      features: card.dataset.features,
      link: card.dataset.link,
      linkText: card.dataset.linkText,
    });
  });
});

if (projectModalClose) {
  projectModalClose.addEventListener('click', closeProjectModal);
}

if (projectModalBackdrop) {
  projectModalBackdrop.addEventListener('click', closeProjectModal);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeProjectModal();
  }
});

// FSM diagram: step through nodes to suggest a state machine in motion
const fsmNodes = document.querySelectorAll('.fsm-node');
if (fsmNodes.length && !reduceMotion) {
  let current = 0;
  setInterval(() => {
    fsmNodes.forEach((node) => node.classList.remove('is-active'));
    fsmNodes[current].classList.add('is-active');
    current = (current + 1) % fsmNodes.length;
  }, 1100);
} else if (fsmNodes.length) {
  fsmNodes[0].classList.add('is-active');
}
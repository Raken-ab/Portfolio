// Mobile navigation drawer toggle
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

// Project database object
const projects = {
  'ip-conflicts': {
    title: 'IP Conflicts',
    tag: 'Game Jam — 1st Place',
    description: 'IP Conflicts is a fast-paced game jam title built during a 48-hour sprint. It blends strategic positioning, local multiplayer support, and polished pixel art to deliver a tight arcade experience.',
    images: [
      'assets/placeholder-gamejam.jpg',
      'placeholder-gamejam-2.jpg',
      'placeholder-gamejam-3.jpg'
    ],
    github: 'https://github.com/Raken-ab/Game-Jam',
    itch: 'https://itch.io/jam/arcademia-game-jam/entries'
  },
  'tracker-app': {
    title: 'Productivity & Sobriety Tracker',
    tag: 'Mobile App',
    description: 'A mobile productivity and sobriety tracker designed to help users stay organized and focused. Includes goal tracking, progress summaries, and offline-first data support for daily routines.',
    images: [
      'placeholder-mobile.jpg',
      'placeholder-mobile-2.jpg',
      'placeholder-mobile-3.jpg'
    ],
    github: 'https://github.com/Raken-ab/Productivity-Tracker-App'
  },
  'rentals-system': {
    title: 'Roadrunner Rentals System',
    tag: 'Desktop & Database',
    description: 'A desktop rental management system built for vehicle fleets and reservation workflows. It includes database-backed inventory tracking, customer management, and reporting tools.',
    images: [
      'placeholder-desktop.jpg',
      'placeholder-desktop-2.jpg',
      'placeholder-desktop-3.jpg'
    ],
    github: 'https://github.com/Raken-ab/roadrunner-rentals'
  },
  'next-build': {
    title: 'Next Build',
    tag: 'Coming Soon',
    description: 'A new project is currently in development. Stay tuned for the next release and follow the GitHub links for updates.',
    images: [
      'placeholder-desktop.jpg'
    ],
    github: 'https://github.com/Raken-ab'
  }
};

// Modal elements
const modal = document.querySelector('.project-modal');
const modalTitle = modal?.querySelector('#project-modal-title');
const modalTag = modal?.querySelector('.project-modal__tag');
const modalDescription = modal?.querySelector('.project-modal__description');
const modalGallery = modal?.querySelector('.project-modal__gallery');
const githubLink = modal?.querySelector('.button-secondary');
const itchLink = modal?.querySelector('.button-primary');
const closeModalButton = modal?.querySelector('.project-modal__close');

function openProjectModal(projectKey) {
  if (!modal || !projects[projectKey]) return;
  const project = projects[projectKey];

  if (modalTitle) modalTitle.textContent = project.title;
  if (modalTag) modalTag.textContent = project.tag;
  if (modalDescription) modalDescription.textContent = project.description;
  
  if (modalGallery) {
    modalGallery.innerHTML = project.images
      .map((src) => `<img src="${src}" alt="${project.title} screenshot">`)
      .join('');
  }

  if (githubLink) githubLink.href = project.github;
  
  if (itchLink) {
    if (project.itch) {
      itchLink.href = project.itch;
      itchLink.style.display = 'inline-flex';
    } else {
      itchLink.style.display = 'none';
    }
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Attach card listeners
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card) => {
  const openCard = () => {
    const projectKey = card.dataset.project;
    if (projectKey) {
      openProjectModal(projectKey);
    }
  };

  card.addEventListener('click', openCard);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCard();
    }
  });
});

if (closeModalButton) {
  closeModalButton.addEventListener('click', closeProjectModal);
}

if (modal) {
  const backdrop = modal.querySelector('.project-modal__backdrop');
  if (backdrop) backdrop.addEventListener('click', closeProjectModal);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
    closeProjectModal();
  }
});

// Scroll Reveal Observer
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach((el) => revealObserver.observe(el));
}
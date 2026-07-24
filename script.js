const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMobileNav() {
  if (!navLinks || !navToggle) {
    return;
  }

  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
      closeMobileNav();
    }
  });
}

/* ==========================================================================
   Project modal
   ========================================================================== */
const projectModal = document.querySelector('.project-modal');
const projectModalClose = document.querySelector('.project-modal__close');
const projectModalBackdrop = document.querySelector('[data-modal-close]');
const modalTitle = document.querySelector('.project-modal__title');
const modalTag = document.querySelector('.project-modal__tag');
const modalDescription = document.querySelector('.project-modal__description');
const modalFeatures = document.querySelector('.project-modal__features');
const modalLink = document.querySelector('.project-modal__link:not(.project-modal__link--secondary)');
const modalSecondaryLink = document.querySelector('.project-modal__link--secondary');
const modalImage = document.querySelector('.project-modal__image');

let lastFocusedElement = null;

function openProjectModal(project, triggerEl) {
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

  if (modalSecondaryLink) {
    if (project.github) {
      modalSecondaryLink.href = project.github;
      modalSecondaryLink.textContent = project.githubText || 'View on GitHub';
      modalSecondaryLink.hidden = false;
    } else {
      modalSecondaryLink.hidden = true;
      modalSecondaryLink.removeAttribute('href');
    }
  }

  lastFocusedElement = triggerEl || document.activeElement;

  projectModal.classList.add('is-visible');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  if (projectModalClose) {
    projectModalClose.focus();
  }
}

function closeProjectModal() {
  if (!projectModal) {
    return;
  }

  projectModal.classList.remove('is-visible');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function trapModalFocus(event) {
  if (event.key !== 'Tab' || !projectModal || !projectModal.classList.contains('is-visible')) {
    return;
  }

  const focusable = projectModal.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

const projectCards = document.querySelectorAll('.project-card[data-title]');
projectCards.forEach((card) => {
  const triggerModal = () => {
    if (card.dataset.locked === 'true') {
      return;
    }

    openProjectModal(
      {
        title: card.dataset.title,
        type: card.dataset.type,
        image: card.dataset.image,
        description: card.dataset.description,
        features: card.dataset.features,
        link: card.dataset.link,
        linkText: card.dataset.linkText,
        github: card.dataset.github,
        githubText: card.dataset.githubText,
      },
      card
    );
  };

  card.addEventListener('click', (event) => {
    if (card.dataset.locked === 'true') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    triggerModal();
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      triggerModal();
    }
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

document.addEventListener('keydown', trapModalFocus);

/* ==========================================================================
   Copy-to-clipboard email buttons
   ========================================================================== */
function copyTextFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand('copy');
  } catch (err) {
    succeeded = false;
  }

  document.body.removeChild(textarea);
  return succeeded;
}

async function copyEmail(button) {
  const email = button.dataset.email;
  if (!email) {
    return;
  }

  const statusEl = button.querySelector('.copy-email__status');
  let succeeded = false;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(email);
      succeeded = true;
    } catch (err) {
      succeeded = copyTextFallback(email);
    }
  } else {
    succeeded = copyTextFallback(email);
  }

  if (statusEl) {
    statusEl.textContent = succeeded ? 'Copied!' : 'Copy failed';
    window.clearTimeout(button._copyResetTimer);
    button._copyResetTimer = window.setTimeout(() => {
      statusEl.textContent = '';
    }, 2000);
  }
}

document.querySelectorAll('.copy-email').forEach((button) => {
  button.addEventListener('click', () => copyEmail(button));
});
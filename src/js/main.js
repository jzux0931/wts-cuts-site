import '../scss/main.scss';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

const carousel = document.querySelector('.hero-photo');

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.hero-photo__slide'));
  const dots = Array.from(carousel.querySelectorAll('.hero-photo__dot'));
  let activeSlide = 0;

  const showSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.hidden = !isActive;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-label', `${slideIndex + 1} of ${slides.length}`);
      dots[slideIndex].classList.toggle('is-active', isActive);

      if (isActive) {
        dots[slideIndex].setAttribute('aria-current', 'true');
      } else {
        dots[slideIndex].removeAttribute('aria-current');
      }
    });
  };

  carousel.addEventListener('click', (event) => {
    const directionButton = event.target.closest('[data-carousel-direction]');
    const dotIndex = dots.indexOf(event.target.closest('.hero-photo__dot'));

    if (directionButton) {
      const direction = directionButton.dataset.carouselDirection === 'next' ? 1 : -1;
      showSlide(activeSlide + direction);
    } else if (dotIndex >= 0) {
      showSlide(dotIndex);
    }
  });
}

// Re-align hash destinations after route loads and hash changes.
const alignHashTarget = () => {
  const hash = window.location.hash.slice(1);

  if (!hash) return;

  let targetId;

  try {
    targetId = decodeURIComponent(hash);
  } catch {
    return;
  }

  const target = document.getElementById(targetId);

  if (!target) return;

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - 24;

  root.style.scrollBehavior = 'auto';
  window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });

  requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
};

const scheduleHashAlignment = () => {
  requestAnimationFrame(() => requestAnimationFrame(alignHashTarget));
};

if (window.location.hash) scheduleHashAlignment();

window.addEventListener('pageshow', scheduleHashAlignment);
window.addEventListener('hashchange', scheduleHashAlignment);

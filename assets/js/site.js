const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const header = document.querySelector('.site-header');

function setMenuState(open) {
  if (!toggle || !nav) return;

  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute(
    'aria-label',
    open ? 'Close main navigation' : 'Open main navigation'
  );
}

if (toggle && nav) {

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setMenuState(open);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const wasOpen = toggle.getAttribute('aria-expanded') === 'true';

      setMenuState(false);

      if (wasOpen) {
        toggle.focus();
      }
    }
  });

  document.addEventListener('click', (event) => {
    if (!header) return;

    const open = toggle.getAttribute('aria-expanded') === 'true';

    if (open && !header.contains(event.target)) {
      setMenuState(false);
    }
  });
}


const contactForm = document.querySelector('#contact-form');

if (contactForm) {

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);

    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const subject =
      data.get('subject') || 'Professional enquiry via drshah.me';
    const message = data.get('message') || '';

    const body =
      `Name: ${name}\nEmail: ${email}\n\n${message}`;

    window.location.href =
      `mailto:contact@drshah.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

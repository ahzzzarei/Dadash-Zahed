document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const yearEl = document.getElementById('year');
  const filterButtons = Array.from(document.querySelectorAll('.filter'));
  const cards = Array.from(document.querySelectorAll('.gallery .card'));
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');

  yearEl.textContent = new Date().getFullYear();

  window.addEventListener('scroll', () => {
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      });
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.style.display = matches ? '' : 'none';
      });
    });
  });

  function setError(id, message) {
    const field = document.getElementById(id);
    const error = document.getElementById('error-' + id);
    if (!field || !error) return false;
    field.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    return false;
  }

  function clearError(id) {
    const field = document.getElementById(id);
    const error = document.getElementById('error-' + id);
    if (!field || !error) return;
    field.removeAttribute('aria-invalid');
    error.textContent = '';
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formNote.textContent = '';

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      let valid = true;
      if (!name) valid = setError('name', 'Please enter your name.') || valid;
      else clearError('name');

      if (!email || !validateEmail(email)) valid = setError('email', 'Please enter a valid email.') || valid;
      else clearError('email');

      if (!subject) valid = setError('subject', 'Please add a subject.') || valid;
      else clearError('subject');

      if (!message) valid = setError('message', 'Please include a message.') || valid;
      else clearError('message');

      if (!valid) return;

      const payload = { name, email, subject, message, from: 'portfolio-site' };

      try {
        await new Promise(r => setTimeout(r, 700));
        form.reset();
        formNote.textContent = 'Thanks! Your message has been sent.';
        formNote.style.color = 'var(--green)';
      } catch (err) {
        formNote.textContent = 'Something went wrong. Please try again later or email hello@example.com';
        formNote.style.color = '#fb7185';
      }
    });
  }
});
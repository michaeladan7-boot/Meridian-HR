/* ================================================================
   Meridian HR — script.js
   Shared across every page. Every feature below checks that its
   target elements exist before doing anything, so this one file is
   safe to include on every page even if a page doesn't have (say)
   a contact form.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Mobile nav toggle (hamburger) ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    const openMenu = () => {
      navLinks.classList.add('open');
      navToggle.classList.add('open');
      overlay.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      overlay.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });

    // Close the mobile menu when a plain link (not the dropdown toggle) is tapped
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- 2. "Services" dropdown ---------- */
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const navDropdown = document.querySelector('.nav-dropdown');

  if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = navDropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close the dropdown if the user clicks anywhere else on the page
    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 3. Fade-in on scroll (repeats every time, both directions) ---------- */
  try {
    const revealTargets = document.querySelectorAll('.scroll-fade');

    if ('IntersectionObserver' in window && revealTargets.length) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // toggle instead of one-time add: fades back out when the
          // element scrolls out of view, and fades in again on re-entry
          entry.target.classList.toggle('appear', entry.isIntersecting);
        });
      }, { threshold: 0.15 });

      revealTargets.forEach((el) => revealObserver.observe(el));
    } else {
      // No IntersectionObserver support — just show everything, no animation
      revealTargets.forEach((el) => el.classList.add('appear'));
    }
  } catch (err) {
    // If anything above throws, make sure content is still visible
    document.querySelectorAll('.scroll-fade').forEach((el) => el.classList.add('appear'));
    console.error('Reveal-on-scroll failed, showing content directly:', err);
  }

  /* ---------- 4. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- 5. Contact form backend (Netlify Forms) ---------- */
  // Works for both the homepage's #contact section and the standalone
  // contact.html page — each has at most one form with this id.
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const submitBtn = document.getElementById('submit-btn');
    const messageEl = document.getElementById('form-message');

    const encodeForm = (data) =>
      Object.keys(data)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');

    const showMessage = (text, type) => {
      if (!messageEl) return;
      messageEl.textContent = text;
      messageEl.className = 'form-message ' + type;
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const payload = {};
      formData.forEach((value, key) => { payload[key] = value; });

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      showMessage('', '');

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm(payload),
      })
        .then(() => {
          showMessage("Thanks — your message is in. We'll get back to you within 24 hours.", 'success');
          contactForm.reset();
        })
        .catch(() => {
          showMessage('Something went wrong sending that. Please try again or email us directly.', 'error');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
        });
    });
  }

});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Global Theme Management
function getStoredTheme() {
  try {
    return localStorage.getItem('theme');
  } catch (e) {
    return null;
  }
}

function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  
  // Set attribute & classes on html element
  document.documentElement.setAttribute('data-theme', next);
  document.documentElement.classList.remove('theme-dark', 'theme-light');
  document.documentElement.classList.add('theme-' + next);

  // Set attribute & classes on body if loaded
  if (document.body) {
    document.body.setAttribute('data-theme', next);
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add('theme-' + next);
  }

  // Persist safely in localStorage
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}

  // Update button ARIA and title
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('title', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// Make toggleTheme accessible globally
window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;

// Ensure toggle button has a listener only if onclick isn't inline
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle && !themeToggle.onclick) {
  themeToggle.addEventListener('click', toggleTheme);
}

// Synchronize with OS system preferences if no manual choice is saved
if (window.matchMedia) {
  try {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handleMediaChange = (e) => {
      try {
        if (!localStorage.getItem('theme')) {
          applyTheme(e.matches ? 'light' : 'dark');
        }
      } catch (err) {}
    };
    if (mq.addEventListener) {
      mq.addEventListener('change', handleMediaChange);
    } else if (mq.addListener) {
      mq.addListener(handleMediaChange);
    }
  } catch (e) {}
}

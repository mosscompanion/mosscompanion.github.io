const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

const headerBrand = document.querySelector('.site-header .brand');
if (headerBrand) {
  headerBrand.replaceChildren();
  const words = document.createElement('span');
  words.textContent = 'Made by';
  const logo = document.createElement('img');
  logo.src = '/assets/moss-mark.png';
  logo.alt = 'MOSS';
  headerBrand.append(words, logo);
}

document.querySelectorAll('.site-nav a[href="/about/"]').forEach((link) => {
  link.textContent = 'The Human Bit';
});

if (window.location.pathname === '/moss-countdown/') {
  const countdownLogo = document.querySelector('.detail-icon');
  if (countdownLogo) {
    countdownLogo.src = '/assets/moss-countdown.png';
    countdownLogo.alt = 'MOSS Countdown app icon';
  }

  const playButton = document.querySelector('.button-row a[href*="play.google.com"]');
  if (playButton) {
    const status = document.createElement('span');
    status.className = 'button disabled';
    status.setAttribute('aria-label', 'MOSS Countdown is coming sooner');
    status.textContent = 'Coming sooner!';
    playButton.replaceWith(status);
  }
}

if (window.location.pathname === '/moss-companion/') {
  const status = document.querySelector('.button.disabled[aria-label*="Google Play"]');
  if (status) {
    status.setAttribute('aria-label', 'MOSS Companion is coming soon');
    status.textContent = 'Coming soon';
  }
}

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

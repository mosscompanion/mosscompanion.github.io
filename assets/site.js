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

const addNavIcon = (element, labelText, iconSrc) => {
  const icon = document.createElement('img');
  icon.className = 'nav-item-icon';
  icon.src = iconSrc;
  icon.alt = '';
  const label = document.createElement('span');
  label.textContent = labelText;
  element.replaceChildren(icon, label);
};

if (nav) {
  const home = nav.querySelector('a[href="/"]');
  const companion = nav.querySelector('a[href="/moss-companion/"]');
  const countdown = nav.querySelector('a[href="/moss-countdown/"]');
  const humanBit = nav.querySelector('a[href="/about/"]');
  const security = nav.querySelector('a[href="/privacy/"]');
  const contact = nav.querySelector('a[href="/support/"]');

  if (home && companion && countdown && humanBit && security && contact) {
    addNavIcon(home, 'Home', '/assets/nav-home.png');
    addNavIcon(humanBit, 'The Human Bit', '/assets/nav-human.png');
    addNavIcon(security, 'Security', '/assets/nav-security.png');
    addNavIcon(contact, 'Contact', '/assets/nav-contact.png');
    const appsMenu = document.createElement('details');
    appsMenu.className = 'apps-menu';
    const summary = document.createElement('summary');
    addNavIcon(summary, 'The Apps', '/assets/nav-apps.png');
    const dropdown = document.createElement('div');
    dropdown.className = 'apps-dropdown';
    const comingSoon = document.createElement('a');
    comingSoon.href = '/coming-soon/';
    comingSoon.textContent = 'Coming Soon';
    addNavIcon(companion, 'Companion', '/assets/moss-companion-transparent.png');
    addNavIcon(countdown, 'Countdown', '/assets/moss-countdown-transparent.png');
    dropdown.append(companion, countdown, comingSoon);
    appsMenu.append(summary, dropdown);
    nav.replaceChildren(home, appsMenu, humanBit, security, contact);
  }
}

if (window.location.pathname === '/moss-countdown/') {
  const countdownLogo = document.querySelector('.detail-icon');
  if (countdownLogo) {
    countdownLogo.src = '/assets/moss-mark.png';
    countdownLogo.alt = 'MOSS logo';
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
  const companionLogo = document.querySelector('.detail-icon');
  if (companionLogo) {
    companionLogo.src = '/assets/moss-mark.png';
    companionLogo.alt = 'MOSS logo';
  }

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

document.querySelectorAll('[data-birth-date]').forEach((node) => {
  const today = new Date();
  const birthDate = new Date(`${node.dataset.birthDate}T00:00:00`);
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed = today.getMonth() > birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!birthdayHasPassed) age -= 1;
  node.textContent = age < 1 ? 'Not even one' : `${age} years old`;
});

document.querySelectorAll('[data-copy-email]').forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    const status = button.parentElement.querySelector('.copy-status');

    try {
      await navigator.clipboard.writeText(email);
      status.textContent = 'Email address copied!';
    } catch {
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      document.execCommand('copy');
      field.remove();
      status.textContent = 'Email address copied!';
    }
  });
});

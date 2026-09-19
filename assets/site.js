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
  const lists = nav.querySelector('a[href="/moss-lists/"]');
  const humanBit = nav.querySelector('a[href="/about/"]');
  const security = nav.querySelector('a[href="/privacy/"]');
  const contact = nav.querySelector('a[href="/support/"]');

  if (home && companion && countdown && humanBit && security && contact) {
    addNavIcon(home, 'Home', '/assets/nav-home.png');
    addNavIcon(humanBit, 'About MOSS', '/assets/nav-human.png');
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
    addNavIcon(companion, 'Companion', '/assets/moss-companion-transparent-hq.png');
    addNavIcon(countdown, 'Countdown', '/assets/moss-countdown-transparent-hq.png');
    dropdown.append(companion, countdown, comingSoon);
    if (lists) {
      addNavIcon(lists, 'Lists', '/assets/moss-lists-transparent.png');
      dropdown.insertBefore(lists, comingSoon);
    }
    appsMenu.append(summary, dropdown);
    nav.replaceChildren(home, appsMenu, humanBit, security, contact);
  }
}

if (window.location.pathname === '/moss-countdown/') {
  const countdownLogo = document.querySelector('.detail-icon');
  if (countdownLogo) {
    countdownLogo.src = '/assets/moss-countdown-transparent-hq.png';
    countdownLogo.alt = 'MOSS Countdown logo';
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
    companionLogo.src = '/assets/moss-companion-transparent-hq.png';
    companionLogo.alt = 'MOSS Companion logo';
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

const formatDogAge = (birthDate, today = new Date()) => {
  const years = today.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const hasHadBirthday = today >= birthdayThisYear;
  const completedYears = hasHadBirthday ? years : years - 1;

  if (completedYears < 1) return 'Nearly One';
  if (completedYears === 1) return 'One';
  return `${completedYears} years old`;
};

document.querySelectorAll('[data-birth-date]').forEach((node) => {
  const [year, month, day] = node.dataset.birthDate.split('-').map(Number);
  node.textContent = formatDogAge(new Date(year, month - 1, day));
});

const contactDrafts = {
  'App Support': (product) => ({
    subject: product === 'General Support' ? 'General Support' : `${product} - App Support`,
    body: `Hi Katie,\n\nI need some help with ${product === 'General Support' ? 'something MOSS-related' : product}.\n\nWhat I need help with:\n\nWhat I was trying to do:\n\nWhat happened:\n\nMy phone / Android version (if known):\n\nThanks!`,
  }),
  'Bug Report': (product) => ({
    subject: `${product} - Bug Report`,
    body: `Hi Katie,\n\nI found a problem with ${product}.\n\nWhat I was doing:\n\nWhat I expected to happen:\n\nWhat happened instead:\n\nMy phone / Android version and app version (if known):\n\nScreenshot or screen recording attached (if I have one):\n\nThanks!`,
  }),
  Feedback: (product) => ({
    subject: `${product} - Feedback`,
    body: `Hi Katie,\n\nI have some feedback about ${product}.\n\nWhat I like / what is working well:\n\nWhat I would change or add:\n\nAnything else that would help explain it:\n\nThanks!`,
  }),
};

document.querySelectorAll('[data-contact-card]').forEach((card) => {
  const type = card.dataset.contactCard;
  const select = card.querySelector('select');
  const button = card.querySelector('[data-contact-continue]');
  if (!select || !button || !contactDrafts[type]) return;

  button.addEventListener('click', () => {
    const draft = contactDrafts[type](select.value);
    window.location.href = `mailto:hello@madebymoss.co.uk?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  });
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

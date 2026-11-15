(() => {
  const key = 'moss_essa_optional_analytics_v1';
  const measurement = 'G-7BMMXMRKWC';
  const managing = document.body.dataset.analyticsSettings === 'true';
  let consent = null;
  try { consent = localStorage.getItem(key); } catch (_) { /* Default off. */ }

  function enable() {
    if (window.mossAnalyticsLoaded) return;
    window.mossAnalyticsLoaded = true;
    window['ga-disable-' + measurement] = false;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', measurement, {
      page_title: 'MOSS ESSA Web App',
      page_location: 'https://madebymoss.co.uk/essa-app/',
      page_referrer: '',
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurement;
    document.head.appendChild(tag);
  }

  function disable() {
    window['ga-disable-' + measurement] = true;
    // Remove this property's analytics cookies, retaining journal/account data.
    const names = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0]);
    for (const name of names.filter(name => name === '_ga' || name === '_ga_7BMMXMRKWC')) {
      for (const domain of ['', '; Domain=' + location.hostname, '; Domain=.madebymoss.co.uk']) {
        for (const path of ['/', '/essa-app/']) {
          document.cookie = name + '=; Max-Age=0; Path=' + path + domain + '; SameSite=Lax';
        }
      }
    }
  }

  function choose(value) {
    consent = value;
    try { localStorage.setItem(key, value); } catch (_) { /* Session choice still works. */ }
    if (value === 'allowed' && !managing) enable(); else disable();
    panel.remove();
  }

  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    if (event.newValue !== 'allowed') disable();
    else if (!managing) enable();
  });

  if (consent === 'allowed' && !managing) enable(); else disable();
  if (consent !== null && !managing) return;

  const panel = document.createElement('dialog');
  panel.setAttribute('aria-labelledby', 'moss-analytics-title');
  panel.style.cssText = 'max-width:380px;width:calc(100% - 64px);border:1px solid #d6cabb;border-radius:16px;padding:22px;background:#fffcf5;color:#332a23;font:16px/1.5 system-ui;';
  panel.innerHTML = '<h2 id="moss-analytics-title" style="margin:0 0 10px;font-size:21px">Optional visit statistics</h2>' +
    '<p>May MOSS use Google Analytics to count visits to this web app? It is off unless you allow it. Google receives visit and device information and uses analytics cookies.</p>' +
    '<p>Your journal text, ESSA names, photos and Google account details are not sent to Analytics. Advertising features are disabled. The journal works the same either way.</p>' +
    '<p>You can change your choice in Settings → Google Drive &amp; backups → Web analytics privacy.</p>' +
    '<p><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy information</a></p>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap"><button type="button" data-choice="declined">No thanks</button><button type="button" data-choice="allowed">Allow analytics</button></div>';
  for (const button of panel.querySelectorAll('button')) {
    button.style.cssText = 'font:inherit;border:1px solid #316347;border-radius:8px;background:#fffcf5;color:#316347;padding:9px 12px;cursor:pointer;';
    button.addEventListener('click', () => choose(button.dataset.choice));
  }
  panel.addEventListener('cancel', event => { event.preventDefault(); choose('declined'); });
  document.body.appendChild(panel);
  panel.showModal();
})();

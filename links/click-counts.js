(() => {
  const endpoint = document.currentScript.dataset.endpoint;
  if (!endpoint) return;

  function countClick(event) {
    if (!event.isTrusted || event.defaultPrevented) return;
    const link = event.target.closest('a[data-click-id]');
    if (!link) return;

    fetch(endpoint, {
      method: 'POST',
      body: link.dataset.clickId,
      mode: 'no-cors',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      keepalive: true,
    }).catch(() => {});
  }

  document.addEventListener('click', countClick);
  document.addEventListener('auxclick', (event) => {
    if (event.button === 1) countClick(event);
  });
})();

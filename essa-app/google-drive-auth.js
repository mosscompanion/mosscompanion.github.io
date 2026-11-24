'use strict';

// This remembers which local journal to open, never Google credentials.
const rememberedAccountKey = 'moss.essa.rememberedAccount.v1';
window.mossReadRememberedAccount = () => {
  try {
    const account = JSON.parse(window.localStorage.getItem(rememberedAccountKey));
    if (!account || typeof account.id !== 'string' ||
        !/^[a-zA-Z0-9_-]+$/.test(account.id) ||
        typeof account.email !== 'string' || !account.email.trim()) return '';
    return JSON.stringify({id: account.id, email: account.email});
  } catch (_) {
    return '';
  }
};
window.mossRememberAccount = (id, email) => {
  window.localStorage.setItem(rememberedAccountKey, JSON.stringify({id, email}));
};
window.mossForgetAccount = () => {
  window.localStorage.removeItem(rememberedAccountKey);
};

let releaseJournalLock;
window.mossAcquireJournalLock = (account) => new Promise((resolve, reject) => {
  if (!navigator.locks) {
    reject(new Error('This browser cannot safely open MOSS ESSA. Please use a current version of Chrome, Edge, Firefox or Safari.'));
    return;
  }
  navigator.locks.request(`moss-essa-journal-${account}`, {ifAvailable: true}, (lock) => {
    if (!lock) {
      reject(new Error('MOSS ESSA is already open for this account in another tab or window. Use that window, or close it and try opening the app here again.'));
      return;
    }
    return new Promise((release) => {
      releaseJournalLock = release;
      resolve({});
    });
  }).catch(reject);
});
window.mossReleaseJournalLock = () => {
  releaseJournalLock?.();
  releaseJournalLock = undefined;
};

// Public OAuth client ID. Access tokens stay in memory for this tab only.
window.mossGoogleConnect = (hint) => new Promise((resolve, reject) => {
  const oauth = window.google?.accounts?.oauth2;
  if (!oauth) {
    reject(new Error('Google sign-in is still loading. Please try again in a moment.'));
    return;
  }
  const emailScope = 'https://www.googleapis.com/auth/userinfo.email';
  const driveScope = 'https://www.googleapis.com/auth/drive.appdata';
  const fail = (message) => {
    clearTimeout(timeout);
    reject(new Error(message));
  };
  const timeout = setTimeout(() => {
    fail('Google did not finish signing in. Close its sign-in window and try again.');
  }, 180_000);

  try {
    const client = oauth.initTokenClient({
      client_id: '439115440367-rvi9v9g6csqgdrvm1qa8n9lpv618mdat.apps.googleusercontent.com',
      scope: `openid ${emailScope} ${driveScope}`,
      include_granted_scopes: false,
      login_hint: hint || undefined,
      callback: (response) => {
        if (response.error) {
          fail(response.error === 'access_denied'
            ? 'Google access was declined. Allow access to open MOSS ESSA.'
            : 'Google could not authorise this sign-in. Please try again.');
          return;
        }
        const granted = new Set((response.scope || '').split(/\s+/));
        if (!granted.has(driveScope)) {
          fail('Google Drive permission is needed to open MOSS ESSA.');
          return;
        }
        const expiresIn = Number(response.expires_in);
        if (typeof response.access_token !== 'string' || !response.access_token ||
            !Number.isSafeInteger(expiresIn) || expiresIn <= 0) {
          fail('Google returned an incomplete sign-in. Please try again.');
          return;
        }
        clearTimeout(timeout);
        resolve({access_token: response.access_token, expires_in: expiresIn});
      },
      error_callback: (error) => {
        switch (error.type) {
          case 'popup_closed':
            fail('Google sign-in was cancelled. You can try again when you are ready.');
            break;
          case 'popup_failed_to_open':
            fail('Google could not open its sign-in window. Allow pop-ups for this website and try again.');
            break;
          default:
            fail('Google could not finish signing in. Please try again.');
        }
      },
    });
    client.requestAccessToken({prompt: hint ? '' : 'select_account'});
  } catch (_) {
    fail('Google could not start signing in. Please try again.');
  }
});

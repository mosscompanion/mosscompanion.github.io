'use strict';

let releaseJournalLock;
window.mossAcquireJournalLock = (account) => new Promise((resolve, reject) => {
  if (!navigator.locks) {
    reject(new Error('This browser cannot safely open the Drive journal. Please use a current version of Chrome, Edge, Firefox or Safari.'));
    return;
  }
  navigator.locks.request(`moss-essa-journal-${account}`, {ifAvailable: true}, (lock) => {
    if (!lock) {
      reject(new Error('Your journal is already open in another tab. Close that tab and try again.'));
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
  const scopes = 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.appdata';
  const client = oauth.initTokenClient({
    client_id: '439115440367-rvi9v9g6csqgdrvm1qa8n9lpv618mdat.apps.googleusercontent.com',
    scope: scopes,
    include_granted_scopes: false,
    login_hint: hint || undefined,
    callback: (response) => {
      if (response.error || !oauth.hasGrantedAllScopes(response, ...scopes.split(' '))) {
        reject(new Error('Google Drive permission is needed to open your journal.'));
        return;
      }
      resolve({access_token: response.access_token, expires_in: Number(response.expires_in)});
    },
    error_callback: (error) => reject(new Error(
      error.type === 'popup_closed'
        ? 'Sign-in was cancelled. You can try again whenever you are ready.'
        : 'Google could not open its sign-in window. Please allow pop-ups for this website and try again.'
    )),
  });
  client.requestAccessToken({prompt: hint ? '' : 'select_account'});
});

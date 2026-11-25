import { signInWithPopup } from 'firebase/auth';
import { getFirebaseAuthInstance, isFirebaseConfigured } from '../config/firebase';

const STORAGE_KEY_GOOGLE_CLIENT_ID = 'mediguard_google_client_id';

/** Returns the configured Google Cloud OAuth 2.0 Client ID from env or localStorage. */
export const getGoogleClientId = () => {
  const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  const savedId = (localStorage.getItem(STORAGE_KEY_GOOGLE_CLIENT_ID) || '').trim();
  const id = envId || savedId;
  if (!id || id.includes('mediguard-iiitl') || id.includes('Dummy')) return '';
  return id;
};

export const saveGoogleClientId = (clientId) => {
  localStorage.setItem(STORAGE_KEY_GOOGLE_CLIENT_ID, clientId.trim());
};

export const hasRealGoogleAuthConfigured = () => {
  return Boolean(getGoogleClientId()) || isFirebaseConfigured();
};

/**
 * Initiates a real Google OAuth flow.
 * Prefers direct Google Cloud OAuth 2.0 redirect (shows accounts.google.com chooser),
 * otherwise uses Firebase Authentication signInWithPopup.
 */
export const startRealGoogleAuth = async (loginWithGoogle) => {
  const clientId = getGoogleClientId();
  if (clientId) {
    const redirectUri = `${window.location.origin}/login`;
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('prompt', 'select_account');
    authUrl.searchParams.set('include_granted_scopes', 'true');
    window.location.assign(authUrl.toString());
    return { redirected: true };
  }

  const fb = getFirebaseAuthInstance();
  if (fb) {
    const result = await signInWithPopup(fb.auth, fb.googleProvider);
    const fbUser = result.user;
    const res = await loginWithGoogle({
      email: fbUser.email,
      name: fbUser.displayName,
      avatar: fbUser.photoURL,
      googleId: fbUser.uid,
      credential: await fbUser.getIdToken()
    });
    return { redirected: false, user: res?.user };
  }

  const err = new Error('GOOGLE_OAUTH_NOT_CONFIGURED');
  err.code = 'GOOGLE_OAUTH_NOT_CONFIGURED';
  throw err;
};

/** Handles the #access_token=... callback returned by accounts.google.com/o/oauth2/v2/auth. */
export const consumeGoogleOAuthHash = async (loginWithGoogle) => {
  const hash = window.location.hash || '';
  if (!hash.includes('access_token=')) return null;

  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const accessToken = params.get('access_token');
  if (!accessToken) return null;

  // Clean sensitive token from browser address bar immediately
  window.history.replaceState(null, '', window.location.pathname + window.location.search);

  const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!resp.ok) {
    throw new Error('Failed to verify Google account profile with Google UserInfo API.');
  }

  const profile = await resp.json();
  return loginWithGoogle({
    email: profile.email,
    name: profile.name,
    avatar: profile.picture,
    googleId: profile.sub
  });
};

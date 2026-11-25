import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const STORAGE_KEY_FIREBASE = 'mediguard_firebase_config';

export const getSavedFirebaseConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FIREBASE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveFirebaseConfig = (cfg) => {
  localStorage.setItem(STORAGE_KEY_FIREBASE, JSON.stringify(cfg));
};

export const getEffectiveFirebaseConfig = () => {
  const saved = getSavedFirebaseConfig();
  const envCfg = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };

  if (envCfg.apiKey && !envCfg.apiKey.includes('Dummy')) {
    return envCfg;
  }
  if (saved?.apiKey && !saved.apiKey.includes('Dummy')) {
    return saved;
  }
  return null;
};

export const isFirebaseConfigured = () => Boolean(getEffectiveFirebaseConfig());

export const getFirebaseAuthInstance = () => {
  const cfg = getEffectiveFirebaseConfig();
  if (!cfg) return null;

  const existing = getApps().find((a) => a.name === 'mediguard-dynamic');
  const app = existing || initializeApp(cfg, 'mediguard-dynamic');
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  return { auth, googleProvider };
};

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  hasRealGoogleAuthConfigured,
  saveGoogleClientId,
  startRealGoogleAuth
} from '../utils/googleAuth';
import { saveFirebaseConfig } from '../config/firebase';
import soundFX from '../utils/audioFX';

/** Parses either strict JSON or copied JS object snippet from Firebase Console. */
const parseFirebaseInput = (rawText) => {
  const cleaned = rawText
    .replace(/const\s+\w+\s*=\s*/, '')
    .replace(/;+\s*$/, '')
    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
    .replace(/'/g, '"')
    .replace(/,\s*}/g, '}');
  return JSON.parse(cleaned);
};

const GoogleAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const [mode, setMode] = useState('oauth'); // 'oauth' | 'firebase'
  const [clientIdInput, setClientIdInput] = useState('');
  const [firebaseInput, setFirebaseInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentOrigin = window.location.origin;
  const redirectUri = `${currentOrigin}/login`;

  const launchRealGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await startRealGoogleAuth(loginWithGoogle);
      if (!result.redirected) {
        soundFX.playConnectChime();
        onClose();
        if (onSuccess) onSuccess(result.user);
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed. Please try again.');
      } else if (err.code === 'GOOGLE_OAUTH_NOT_CONFIGURED') {
        setError('Please enter your Google OAuth Client ID or Firebase config below first.');
      } else {
        setError(err.message || 'Google sign-in failed.');
      }
      setLoading(false);
    }
  };

  const handleSaveAndConnect = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'oauth') {
        const trimmed = clientIdInput.trim();
        if (!trimmed.endsWith('.apps.googleusercontent.com')) {
          setError('Please enter a valid Google OAuth Client ID ending in .apps.googleusercontent.com');
          return;
        }
        saveGoogleClientId(trimmed);
      } else {
        const parsed = parseFirebaseInput(firebaseInput.trim());
        if (!parsed?.apiKey || !parsed?.authDomain) {
          setError('Firebase config must include apiKey and authDomain.');
          return;
        }
        saveFirebaseConfig(parsed);
      }

      await launchRealGoogle();
    } catch (err) {
      setError(err.message || 'Invalid configuration format. Copy the exact snippet from Google/Firebase Console.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content google-auth-box" onClick={(e) => e.stopPropagation()}>
        <div className="google-modal-header">
          <div className="google-brand">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <div>
              <h3>Real Google Sign-In Setup</h3>
              <p>Connect official Google OAuth 2.0 ("Choose an account")</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert-error"><span>⚠️</span> {error}</div>}

        {hasRealGoogleAuthConfigured() && (
          <div style={{ padding: '1rem 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={launchRealGoogle}
              disabled={loading}
              className="btn-primary-block"
            >
              {loading ? 'Connecting to Google...' : 'Continue to Google "Choose an account"'}
            </button>
          </div>
        )}

        <div className="google-tabs" style={{ marginTop: '0.75rem' }}>
          <button
            type="button"
            className={`g-tab-btn ${mode === 'oauth' ? 'active' : ''}`}
            onClick={() => setMode('oauth')}
          >
            🔑 Google OAuth Client ID
          </button>
          <button
            type="button"
            className={`g-tab-btn ${mode === 'firebase' ? 'active' : ''}`}
            onClick={() => setMode('firebase')}
          >
            🔥 Firebase Web Config
          </button>
        </div>

        <form onSubmit={handleSaveAndConnect} style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {mode === 'oauth' ? (
            <>
              <div style={{ fontSize: '0.78rem', color: '#9CA9C4', lineHeight: 1.45, background: 'rgba(255,255,255,0.04)', padding: '0.7rem', borderRadius: '8px' }}>
                <strong>Google Cloud Console (60 sec):</strong> Create an <em>OAuth 2.0 Client ID (Web application)</em> at{' '}
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: '#4da3ff' }}>
                  console.cloud.google.com
                </a>
                <br />• <strong>Authorized JavaScript Origin:</strong> <code>{currentOrigin}</code>
                <br />• <strong>Authorized Redirect URI:</strong> <code>{redirectUri}</code>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Paste Google OAuth Client ID:</label>
                <input
                  type="text"
                  required
                  placeholder="1234567890-abcdefg.apps.googleusercontent.com"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  className="form-input"
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '0.78rem', color: '#9CA9C4', lineHeight: 1.45, background: 'rgba(255,255,255,0.04)', padding: '0.7rem', borderRadius: '8px' }}>
                <strong>Firebase Console:</strong> Enable Google Sign-In at{' '}
                <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: '#4da3ff' }}>
                  console.firebase.google.com
                </a>
                , add <code>{window.location.hostname}</code> to Authorized Domains, and paste your Web App <code>firebaseConfig</code> object below:
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Paste firebaseConfig JSON / JS Snippet:</label>
                <textarea
                  rows={5}
                  required
                  placeholder={'{\n  "apiKey": "AIzaSy...",\n  "authDomain": "your-app.firebaseapp.com",\n  "projectId": "your-app",\n  "appId": "1:..."\n}'}
                  value={firebaseInput}
                  onChange={(e) => setFirebaseInput(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary-block" disabled={loading}>
            {loading ? 'Opening Google...' : 'Save & Open Real Google Sign-In'}
          </button>
        </form>

        <div className="google-modal-footer">
          <span>🔒 Opens official accounts.google.com account chooser (zero mock accounts)</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthModal;

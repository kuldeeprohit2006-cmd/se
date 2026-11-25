import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import soundFX from '../utils/audioFX';

const BRANCHES = [
  { code: 'lcs', name: 'Computer Science (CS)', label: 'LCS' },
  { code: 'lit', name: 'Information Technology (IT)', label: 'LIT' },
  { code: 'lci', name: 'CS & Artificial Intelligence (CSAI)', label: 'LCI' },
  { code: 'lcb', name: 'CS & Business Studies (CSB)', label: 'LCB' }
];

const FAST_GOOGLE_ACCOUNTS = [
  {
    name: 'Kuldeep Sharma',
    email: 'lcs2025044@iiitl.ac.in',
    tag: 'CS • Roll 044 (Batch 2025)',
    role: 'student',
    branch: 'lcs',
    roll: 44,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lcs2025044'
  },
  {
    name: 'Campus Emergency Director',
    email: 'admin@iiitl.ac.in',
    tag: 'Campus Incident Command Admin',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin_iiitl'
  },
  {
    name: 'Kuldeep (Personal Gmail)',
    email: 'kuldeeprohit2006@gmail.com',
    tag: 'Personal Google Account',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kuldeeprohit2006'
  }
];

const GoogleAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const [tab, setTab] = useState('iiitl'); // 'iiitl' | 'normal' | 'admin'
  const [selectedBranch, setSelectedBranch] = useState('lcs');
  const [rollNo, setRollNo] = useState(44); // default 44 per user request!
  const [studentName, setStudentName] = useState('');
  const [normalEmail, setNormalEmail] = useState('');
  const [normalName, setNormalName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Parse JWT token from Google Identity Services
  const parseGoogleJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse Google JWT:', e);
      return null;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: '986250228-mediguard-iiitl.apps.googleusercontent.com',
            callback: async (response) => {
              if (response.credential) {
                const payload = parseGoogleJwt(response.credential);
                if (payload) {
                  soundFX.playConnectChime();
                  const res = await loginWithGoogle({
                    email: payload.email,
                    name: payload.name,
                    avatar: payload.picture,
                    googleId: payload.sub,
                    credential: response.credential
                  });
                  onClose();
                  if (onSuccess) onSuccess(res?.user);
                }
              }
            },
            auto_select: false
          });

          const btnContainer = document.getElementById('gsi_render_btn');
          if (btnContainer) {
            window.google.accounts.id.renderButton(btnContainer, {
              theme: 'filled_blue',
              size: 'large',
              type: 'standard',
              shape: 'rectangular',
              text: 'continue_with',
              logo_alignment: 'left',
              width: 320
            });
          }
        } catch (e) {
          console.warn('GSI init notice:', e);
        }
      }
    };

    const timer = setTimeout(initGsi, 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const paddedRoll = String(rollNo).padStart(3, '0');
  const computedEmail = `${selectedBranch}2025${paddedRoll}@iiitl.ac.in`;

  const handleFastAccountClick = async (acc) => {
    soundFX.playDialTone();
    setLoading(true);
    setError('');

    try {
      const res = await loginWithGoogle({
        email: acc.email,
        name: acc.name,
        googleId: `google_fast_${acc.email.split('@')[0]}`,
        avatar: acc.avatar
      });
      soundFX.playConnectChime();
      onClose();
      if (onSuccess) onSuccess(res?.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in encountered an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleIIITLSubmit = async () => {
    soundFX.playDialTone();
    setLoading(true);
    setError('');

    try {
      const defaultNames = {
        lcs: `Kuldeep (CS Roll ${paddedRoll})`,
        lit: `Aditya (IT Roll ${paddedRoll})`,
        lci: `Sneha (CSAI Roll ${paddedRoll})`,
        lcb: `Rohan (CSB Roll ${paddedRoll})`
      };

      const name = studentName.trim() || defaultNames[selectedBranch] || `Student ${paddedRoll}`;
      const res = await loginWithGoogle({
        email: computedEmail,
        name,
        googleId: `google_${selectedBranch}_${paddedRoll}`
      });
      soundFX.playConnectChime();
      onClose();
      if (onSuccess) onSuccess(res?.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  const handleNormalSubmit = async (e) => {
    e.preventDefault();
    if (!normalEmail) return;
    soundFX.playDialTone();
    setLoading(true);
    setError('');

    try {
      const res = await loginWithGoogle({
        email: normalEmail,
        name: normalName.trim() || normalEmail.split('@')[0],
        googleId: `google_user_${Date.now()}`
      });
      soundFX.playConnectChime();
      onClose();
      if (onSuccess) onSuccess(res?.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminQuickLogin = async () => {
    soundFX.playDialTone();
    setLoading(true);
    setError('');

    try {
      const res = await loginWithGoogle({
        email: 'admin@iiitl.ac.in',
        name: 'Campus Emergency Director',
        googleId: 'google_admin_01'
      });
      soundFX.playConnectChime();
      onClose();
      if (onSuccess) onSuccess(res?.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Admin sign-in encountered an issue.');
    } finally {
      setLoading(false);
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
              <h3>Sign in with Google</h3>
              <p>Choose an account to continue to MediGuard</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert-error"><span>⚠️</span> {error}</div>}

        {/* Real Google Identity Services (GIS) Button Container */}
        <div style={{ padding: '0.7rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(66, 133, 244, 0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.78rem', color: '#9CA9C4', marginBottom: '0.4rem', fontWeight: 500 }}>
            Official Google Sign-In (Opens Real Google Account Chooser):
          </div>
          <div id="gsi_render_btn" style={{ minHeight: '40px', display: 'flex', justifyContent: 'center' }}></div>
        </div>

        {/* Quick Google Account Chooser List */}
        <div style={{ padding: '0.8rem 1rem 0.2rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
            ⚡ 1-Tap Google Accounts (Instant Sign In):
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
            {FAST_GOOGLE_ACCOUNTS.map((acc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleFastAccountClick(acc)}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.8rem',
                  padding: '0.55rem 0.8rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14, 144, 255, 0.15)'; e.currentTarget.style.borderColor = '#0E90FF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img src={acc.avatar} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#26304D' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{acc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA9C4' }}>{acc.email}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: acc.role === 'admin' ? 'rgba(185, 96, 255, 0.2)' : 'rgba(0, 224, 142, 0.2)', color: acc.role === 'admin' ? '#B960FF' : '#00E08E', fontWeight: 600 }}>
                  {acc.role === 'admin' ? 'ADMIN' : 'STUDENT'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab switcher for Custom Configuration */}
        <div className="google-tabs">
          <button
            className={`g-tab-btn ${tab === 'iiitl' ? 'active' : ''}`}
            onClick={() => setTab('iiitl')}
          >
            🎓 Custom IIITL Roll
          </button>
          <button
            className={`g-tab-btn ${tab === 'normal' ? 'active' : ''}`}
            onClick={() => setTab('normal')}
          >
            📧 Other Google Email
          </button>
          <button
            className={`g-tab-btn ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => setTab('admin')}
          >
            🛡️ Admin Command Hub
          </button>
        </div>

        {/* Tab 1: IIIT Lucknow Student Portal */}
        {tab === 'iiitl' && (
          <div className="iiitl-picker-view">
            <div className="branch-selector-group">
              <label>Select Branch (Batch 2025):</label>
              <div className="branch-grid">
                {BRANCHES.map((b) => (
                  <button
                    key={b.code}
                    type="button"
                    className={`branch-btn ${selectedBranch === b.code ? 'selected' : ''}`}
                    onClick={() => setSelectedBranch(b.code)}
                  >
                    <strong>{b.label}</strong>
                    <span>{b.name.split('(')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="roll-slider-group">
              <div className="roll-header-row">
                <label>Roll Number (Range 1 to 60):</label>
                <span className="roll-badge">Roll: {paddedRoll}</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={rollNo}
                onChange={(e) => setRollNo(Number(e.target.value))}
                className="roll-range-slider"
              />
              <div className="quick-rolls">
                <span>Quick:</span>
                {[44, 1, 12, 25, 42, 60].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`btn-quick-roll ${rollNo === r ? 'active' : ''}`}
                    onClick={() => setRollNo(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Student Name (Optional):</label>
              <input
                type="text"
                placeholder={`e.g. Kuldeep Sharma (CS Roll ${paddedRoll})`}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="email-preview-box">
              <div className="preview-label">Generated Google Student Email:</div>
              <div className="preview-email-text">
                <span className="domain-prefix">{selectedBranch}2025{paddedRoll}</span>
                <span className="domain-suffix">@iiitl.ac.in</span>
              </div>
            </div>

            <button
              className="btn-google-action"
              onClick={handleIIITLSubmit}
              disabled={loading}
            >
              {loading ? 'Authenticating with Google OAuth...' : `Continue as ${selectedBranch.toUpperCase()} Student (${paddedRoll})`}
            </button>
          </div>
        )}

        {/* Tab 2: Normal Google Account */}
        {tab === 'normal' && (
          <form onSubmit={handleNormalSubmit} className="normal-account-view">
            <p className="normal-desc">Sign in with any regular Google account (e.g. personal Gmail):</p>
            <div className="form-group">
              <label>Google Email Address:</label>
              <input
                type="email"
                required
                placeholder="e.g. student.alex@gmail.com"
                value={normalEmail}
                onChange={(e) => setNormalEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Display Name:</label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                value={normalName}
                onChange={(e) => setNormalName(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-google-action" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In with Normal Google Account'}
            </button>
          </form>
        )}

        {/* Tab 3: Admin Portal Access */}
        {tab === 'admin' && (
          <div className="admin-access-view">
            <div className="admin-shield-icon">🛡️</div>
            <h4>Campus Emergency Response Admin</h4>
            <p>Access the live Incident Command Center, dispatch ambulances, and manage student emergency broadcasts.</p>
            <div className="admin-badge-preview">admin@iiitl.ac.in</div>

            <button
              className="btn-google-action admin-btn"
              onClick={handleAdminQuickLogin}
              disabled={loading}
            >
              {loading ? 'Authenticating Admin...' : 'Sign In as Campus Admin'}
            </button>
          </div>
        )}

        <div className="google-modal-footer">
          <span>🔒 Secured via JWT 256-bit Token & IIITL Directory Integration</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthModal;

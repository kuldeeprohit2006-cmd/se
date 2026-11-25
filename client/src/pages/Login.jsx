import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal from '../components/GoogleAuthModal';
import soundFX from '../utils/audioFX';

const QUICK_ACCOUNTS = [
  { label: 'LCS (CS) Roll 44', email: 'lcs2025044@iiitl.ac.in', pass: 'Student@123', branch: 'CS' },
  { label: 'Admin Command', email: 'admin@iiitl.ac.in', pass: 'Admin@123', branch: 'ADMIN' },
  { label: 'LIT (IT) Roll 12', email: 'lit2025012@iiitl.ac.in', pass: 'Student@123', branch: 'IT' },
  { label: 'LCI (CSAI) Roll 33', email: 'lci2025033@iiitl.ac.in', pass: 'Student@123', branch: 'CSAI' },
  { label: 'LCB (CSB) Roll 7', email: 'lcb2025007@iiitl.ac.in', pass: 'Student@123', branch: 'CSB' }
];

const Login = () => {
  const [email, setEmail] = useState('lcs2025044@iiitl.ac.in');
  const [password, setPassword] = useState('Student@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFX.playDialTone();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      soundFX.playConnectChime();
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (acc) => {
    soundFX.playDialTone();
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">🛡️</div>
          <h2>MediGuard Student Portal</h2>
          <p>IIIT Lucknow Campus Emergency & Health Response System</p>
        </div>

        {error && (
          <div className="alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Google One-Click Button */}
        <button
          type="button"
          className="btn-google-oauth-full"
          onClick={() => {
            soundFX.playDialTone();
            setGoogleModalOpen(true);
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Sign In with Google (IIITL & Normal)</span>
        </button>

        <div className="auth-separator">
          <span>OR SIGN IN WITH PASSWORD</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Student Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. lcs2025044@iiitl.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary-block" disabled={loading}>
            {loading ? 'Authenticating with JWT...' : '🔐 Sign In to MediGuard'}
          </button>
        </form>

        {/* Quick Branch & Account Selectors */}
        <div className="quick-accounts-section">
          <span className="quick-accounts-title">⚡ Quick Tap Demo Accounts:</span>
          <div className="quick-chips-grid">
            {QUICK_ACCOUNTS.map((acc, i) => (
              <button
                key={i}
                type="button"
                className={`quick-chip ${email === acc.email ? 'active' : ''} ${acc.branch === 'ADMIN' ? 'admin' : ''}`}
                onClick={() => handleQuickFill(acc)}
              >
                <strong>{acc.branch}</strong>
                <span>{acc.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-footer-nav">
          <p>
            New student or faculty? <Link to="/register">Create Account Here</Link>
          </p>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccess={(user) => {
          if (user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }}
      />
    </div>
  );
};

export default Login;

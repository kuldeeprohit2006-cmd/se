import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal from '../components/GoogleAuthModal';
import { hasRealGoogleAuthConfigured, startRealGoogleAuth } from '../utils/googleAuth';
import soundFX from '../utils/audioFX';

const CAMPUS_ZONES = [
  'Boys Hostel 1',
  'Boys Hostel 2',
  'Girls Hostel',
  'Academic Block - Ground Floor',
  'Academic Block - Labs / 1st Floor',
  'Campus Dispensary / Health Center',
  'Student Mess / Dining Hall',
  'Sports Complex / Grounds'
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [campusLocation, setCampusLocation] = useState(CAMPUS_ZONES[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    soundFX.playDialTone();
    setError('');
    if (!hasRealGoogleAuthConfigured()) {
      setGoogleModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const result = await startRealGoogleAuth(loginWithGoogle);
      if (!result.redirected) {
        soundFX.playConnectChime();
        navigate(result.user?.role === 'admin' ? '/admin' : '/');
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google authentication failed.');
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFX.playDialTone();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);

    try {
      await register(name, email, password, 'IIIT Lucknow', phone, campusLocation);
      soundFX.playConnectChime();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">🎓</div>
          <h2>Student Registration</h2>
          <p>Register with your IIITL ID or personal email for emergency coverage</p>
        </div>

        {error && (
          <div className="alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <button
          type="button"
          className="btn-google-oauth-full"
          disabled={loading}
          onClick={handleGoogleSignUp}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="auth-separator">
          <span>OR FILL DETAILS MANUALLY</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kuldeep Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Email (e.g. lcs2025044@iiitl.ac.in or personal)</label>
            <input
              type="email"
              required
              placeholder="e.g. lcs2025044@iiitl.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Phone / WhatsApp</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Hostel / Campus Zone</label>
              <select
                value={campusLocation}
                onChange={(e) => setCampusLocation(e.target.value)}
                className="form-input select"
              >
                {CAMPUS_ZONES.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="Min 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary-block" disabled={loading}>
            {loading ? 'Creating Student Account...' : '🚀 Complete Student Registration'}
          </button>
        </form>

        <div className="auth-footer-nav">
          <p>
            Already registered? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccess={() => navigate('/')}
      />
    </div>
  );
};

export default Register;

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import soundFX from '../utils/audioFX';

const Navbar = ({ onOpenSOS, onStartCall }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    soundFX.playCountdownBeep(true);
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar scrolled">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">Medi<span className="accent">Guard</span></span>
          <span className="student-badge">IIIT LUCKNOW SOS</span>
        </Link>

        {isAuthenticated && (
          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/ambulance" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMobileMenuOpen(false)}>
              🚑 Ambulance
            </NavLink>
            <NavLink to="/blood" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMobileMenuOpen(false)}>
              🩸 Blood Donors
            </NavLink>
            <NavLink to="/firstaid" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMobileMenuOpen(false)}>
              ❤️ CPR Guide
            </NavLink>
            <NavLink to="/medicines" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMobileMenuOpen(false)}>
              💊 Meds Guide
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                🛡️ Command Center
              </NavLink>
            )}
          </div>
        )}

        <div className="nav-actions">
          {isAuthenticated && (
            <button
              className="btn-call-dispatch-nav"
              onClick={() => {
                soundFX.playDialTone();
                onStartCall();
              }}
              title="Call Campus Emergency Dispatch"
            >
              <span className="call-pulse-dot"></span>
              <span>📞 Dispatch Call</span>
            </button>
          )}

          <button
            className="btn-sos-pulse"
            onClick={() => {
              soundFX.playCountdownBeep(true);
              onOpenSOS();
            }}
            title="Emergency SOS Call"
          >
            <span className="sos-dot"></span>
            <span>🚨 SOS</span>
          </button>

          {isAuthenticated ? (
            <div className="user-profile-widget">
              <div className="user-info-chip" title={`${user?.email} (${user?.college})`}>
                <span className="user-avatar">🎓</span>
                <div className="user-text-meta">
                  <span className="user-name">{user?.name?.split(' ')[0] || 'Student'}</span>
                  {user?.branchCode && user.branchCode !== 'general' && (
                    <span className="user-branch-tag">
                      {user.branchCode.toUpperCase()} • {user.rollNo || '044'}
                    </span>
                  )}
                  {isAdmin && <span className="admin-chip-pill">ADMIN</span>}
                </div>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Sign out">
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-outline-sm">Login</Link>
              <Link to="/register" className="btn-primary-sm">Register</Link>
            </div>
          )}

          <button 
            className="mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

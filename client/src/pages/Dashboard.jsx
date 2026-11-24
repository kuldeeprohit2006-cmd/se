import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import soundFX from '../utils/audioFX';

const Dashboard = ({ onOpenSOS, onStartCall }) => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="dashboard-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="status-badge-live">
              <span className="live-dot"></span>
              <span>IIIT LUCKNOW CAMPUS EMERGENCY NETWORK ACTIVE</span>
            </div>

            <h1 className="hero-title">
              Instant Medical Help & <br />
              <span className="gradient-text">Emergency Guidance</span> for Students
            </h1>

            <p className="hero-desc">
              Welcome, <strong className="user-highlight">{user?.name}</strong>{' '}
              {user?.branchCode && (
                <span className="user-branch-inline">
                  [{user.branchCode.toUpperCase()} • Roll {user.rollNo || '044'} • Batch 2025]
                </span>
              )}
              . Campus Zone: <strong>{user?.campusLocation || 'Boys Hostel 1'}</strong>. Find emergency ambulances, blood donors by group, CPR rhythm trainer, and 2-way dispatch operator channels.
            </p>

            <div className="hero-actions">
              <button
                className="btn-hero-sos"
                onClick={() => {
                  soundFX.playCountdownBeep(true);
                  onOpenSOS();
                }}
              >
                <span className="sos-pulse-ring"></span>
                🚨 ONE-TOUCH SOS EMERGENCY
              </button>

              <button
                className="btn-hero-call"
                onClick={() => {
                  soundFX.playDialTone();
                  onStartCall();
                }}
              >
                📞 Real Dispatch Audio Call
              </button>

              <Link to="/firstaid" className="btn-hero-secondary">
                ❤️ Learn CPR Guide
              </Link>
            </div>
          </div>

          <div className="hero-stats-panel">
            <div className="quick-stat-card">
              <span className="stat-icon">🚑</span>
              <div className="stat-data">
                <strong>108 / 112</strong>
                <span>National & Campus Hotlines</span>
              </div>
            </div>
            <div className="quick-stat-card">
              <span className="stat-icon">🎓</span>
              <div className="stat-data">
                <strong>LCS • LIT • LCI • LCB</strong>
                <span>IIITL Automated Roll Sync</span>
              </div>
            </div>
            <div className="quick-stat-card">
              <span className="stat-icon">⏱️</span>
              <div className="stat-data">
                <strong>100-120 BPM</strong>
                <span>Audio CPR Rhythm Metronome</span>
              </div>
            </div>
            <div className="quick-stat-card">
              <span className="stat-icon">🛡️</span>
              <div className="stat-data">
                <strong>{isAdmin ? 'Admin Console' : 'Protected'}</strong>
                <span>JWT RBAC & K8s Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Quick Jump Bar if admin */}
      {isAdmin && (
        <section className="admin-jump-bar container">
          <div className="admin-jump-content">
            <div className="admin-jump-text">
              <span className="shield-badge">ADMIN ACCESS</span>
              <strong>You have Campus Emergency Director Privileges</strong>
              <p>Monitor real-time incoming student SOS alerts, student roster, and ambulance dispatches.</p>
            </div>
            <Link to="/admin" className="btn-jump-admin">
              🛡️ Open Command Center Portal →
            </Link>
          </div>
        </section>
      )}

      {/* Quick Emergency Hotlines Ribbon */}
      <section className="quick-hotlines-ribbon">
        <div className="container hotlines-grid">
          <a href="tel:108" className="hotline-item">
            <span className="hotline-emoji">🚑</span>
            <div>
              <span className="hl-label">National Ambulance</span>
              <span className="hl-phone">108</span>
            </div>
          </a>
          <a href="tel:112" className="hotline-item">
            <span className="hotline-emoji">🚨</span>
            <div>
              <span className="hl-label">Emergency Helpline</span>
              <span className="hl-phone">112</span>
            </div>
          </a>
          <a href="tel:102" className="hotline-item">
            <span className="hotline-emoji">🏥</span>
            <div>
              <span className="hl-label">IIITL Health Center</span>
              <span className="hl-phone">0522-2974730</span>
            </div>
          </a>
          <a href="tel:18001801104" className="hotline-item">
            <span className="hotline-emoji">☠️</span>
            <div>
              <span className="hl-label">Poison Control</span>
              <span className="hl-phone">1800-180-1104</span>
            </div>
          </a>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="features-section container">
        <div className="section-heading">
          <h2>Emergency Services Directory</h2>
          <p>Everything you need in a health crisis, categorized for instant student access</p>
        </div>

        <div className="services-grid">
          <Link to="/ambulance" className="service-card ambulance-theme">
            <div className="card-top">
              <div className="card-icon">🚑</div>
              <span className="badge-tag">24/7 Available</span>
            </div>
            <h3>Ambulance & Hospital Contacts</h3>
            <p>Direct contacts for national ambulances, campus ER response units, and emergency trauma centers.</p>
            <div className="card-action">Open Contacts →</div>
          </Link>

          <Link to="/blood" className="service-card blood-theme">
            <div className="card-top">
              <div className="card-icon">🩸</div>
              <span className="badge-tag">Critical Need</span>
            </div>
            <h3>Blood Donor Groups</h3>
            <p>Find blood banks, volunteer student donor registries, and verified plasma donors filtered by blood type.</p>
            <div className="card-action">Search Donors →</div>
          </Link>

          <Link to="/firstaid" className="service-card cpr-theme">
            <div className="card-top">
              <div className="card-icon">❤️</div>
              <span className="badge-tag">Life Saving</span>
            </div>
            <h3>CPR & First Aid Manual</h3>
            <p>Step-by-step interactive CPR protocols with 110 BPM audio metronome, Heimlich maneuver, and burn care.</p>
            <div className="card-action">View Protocols →</div>
          </Link>

          <Link to="/medicines" className="service-card med-theme">
            <div className="card-top">
              <div className="card-icon">💊</div>
              <span className="badge-tag">OTC & Emergency</span>
            </div>
            <h3>Emergency Medicine Guide</h3>
            <p>Dosages, precautions, and emergency usage for fever, cardiac pain (aspirin), allergies, and dehydration.</p>
            <div className="card-action">Check Medicines →</div>
          </Link>
        </div>
      </section>

      {/* CPR Highlight Callout */}
      <section className="cpr-callout-section container">
        <div className="cpr-callout-box">
          <div className="cpr-callout-text">
            <span className="badge-critical">CRITICAL KNOWLEDGE</span>
            <h2>Do you know how to perform CPR?</h2>
            <p>
              When cardiac arrest strikes, brain damage starts in <strong>4 minutes</strong>. Immediate CPR triples survival chances before paramedics arrive.
            </p>
            <div className="cpr-rules-inline">
              <div className="cpr-rule"><strong>30</strong> Chest Compressions</div>
              <div className="cpr-rule"><strong>2</strong> Rescue Breaths</div>
              <div className="cpr-rule"><strong>100-120</strong> Beats Per Minute</div>
            </div>
          </div>
          <div className="cpr-callout-btn">
            <Link to="/firstaid" className="btn-cpr-action">
              📖 Open Step-By-Step CPR Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

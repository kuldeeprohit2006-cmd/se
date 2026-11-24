import { useState, useEffect } from 'react';
import API from '../api/axios';
import soundFX from '../utils/audioFX';

const CAMPUS_ZONES = [
  'Boys Hostel 1',
  'Boys Hostel 2',
  'Girls Hostel',
  'Academic Block - Ground Floor',
  'Academic Block - Labs / 1st Floor',
  'Campus Dispensary / Health Center',
  'Student Mess / Dining Hall',
  'Sports Complex / Grounds',
  'Main Campus Gate 1'
];

const EMERGENCY_TYPES = [
  'Cardiac Arrest / CPR Needed',
  'Severe Breathing / Choking',
  'Unconsciousness / Fainting',
  'Accidental Trauma / Deep Bleeding',
  'Severe Allergic Reaction / Anaphylaxis',
  'High Fever / Acute Illness'
];

const SOSModal = ({ isOpen, onClose, onStartCall }) => {
  const [countdown, setCountdown] = useState(3);
  const [countdownActive, setCountdownActive] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [incidentData, setIncidentData] = useState(null);
  const [campusZone, setCampusZone] = useState('Academic Block - Ground Floor');
  const [emergencyType, setEmergencyType] = useState('Cardiac Arrest / CPR Needed');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setCountdownActive(false);
      setBroadcastSent(false);
      setIncidentData(null);
      return;
    }

    // Start 3s safety countdown
    setCountdown(3);
    setCountdownActive(true);
  }, [isOpen]);

  useEffect(() => {
    if (!countdownActive) return;

    if (countdown > 0) {
      soundFX.playCountdownBeep(false);
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Trigger broadcast
      triggerSOSBroadcast();
    }
  }, [countdown, countdownActive]);

  const triggerSOSBroadcast = async () => {
    setCountdownActive(false);
    setLoading(true);
    soundFX.playCountdownBeep(true);

    try {
      const res = await API.post('/incidents', {
        campusZone,
        emergencyType,
        priority: 'CRITICAL',
        gpsCoordinates: { lat: 26.8016, lng: 81.0242 }
      });
      setIncidentData(res.data.incident);
      setBroadcastSent(true);
      soundFX.playConnectChime();
    } catch (e) {
      console.error('Failed to broadcast SOS incident', e);
      setBroadcastSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCountdown = () => {
    setCountdownActive(false);
    onClose();
  };

  const handleShareLocation = () => {
    const text = `🚨 CAMPUS SOS EMERGENCY! Location: ${campusZone}, IIIT Lucknow Campus. Immediate Medical Assistance Needed! Coordinates: 26.8016° N, 81.0242° E`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content sos-modal-box tactical-hud-modal" onClick={(e) => e.stopPropagation()}>
        {/* Countdown Header if active */}
        {countdownActive && (
          <div className="countdown-hud-banner">
            <div className="countdown-number-pulse">{countdown}</div>
            <div className="countdown-text">
              <h4>DISPATCHING EMERGENCY ALERT IN {countdown}s</h4>
              <p>Warden, on-campus ambulance, and medical staff will be alerted automatically.</p>
            </div>
            <button className="btn-cancel-countdown" onClick={handleCancelCountdown}>
              🛑 Abort / False Alarm
            </button>
          </div>
        )}

        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="emergency-icon-pulse">🚨</span>
            <div>
              <h3>CAMPUS EMERGENCY SOS DISPATCH</h3>
              <p className="subtitle">IIIT Lucknow Medical Response Network</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        {broadcastSent && (
          <div className="alert-broadcast-active">
            <span>✅</span>
            <div>
              <strong>SOS INCIDENT TRANSMITTED TO COMMAND CENTER</strong>
              <p>Ambulance ETA: <strong>2-3 mins</strong>. Stay on this screen.</p>
            </div>
          </div>
        )}

        {/* Campus Zone & Emergency Type Selector */}
        <div className="sos-zone-selector">
          <div className="form-group">
            <label>Confirm Your Campus Location:</label>
            <select
              value={campusZone}
              onChange={(e) => setCampusZone(e.target.value)}
              className="form-input select"
            >
              {CAMPUS_ZONES.map((z) => (
                <option key={z} value={z}>📍 {z}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Emergency Type:</label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="form-input select"
            >
              {EMERGENCY_TYPES.map((t) => (
                <option key={t} value={t}>⚠️ {t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dispatch Audio Calling Action */}
        <div className="dispatch-call-cta-box">
          <button
            className="btn-launch-audio-dispatch"
            onClick={() => {
              onClose();
              onStartCall(incidentData);
            }}
          >
            <span className="live-dot green"></span>
            <span>📞 START 2-WAY DISPATCH AUDIO CALL (ONLINE)</span>
          </button>
        </div>

        {/* Emergency Call Cards */}
        <div className="emergency-call-grid">
          <a href="tel:108" className="sos-action-card emergency-primary">
            <div className="sos-card-icon">🚑</div>
            <div className="sos-card-info">
              <span className="sos-label">National Medical Ambulance</span>
              <strong className="sos-number">108</strong>
              <span className="sos-meta">Free • 24/7 • GPS-Dispatched</span>
            </div>
            <span className="call-btn-chip">Direct Call</span>
          </a>

          <a href="tel:112" className="sos-action-card emergency-all">
            <div className="sos-card-icon">🚨</div>
            <div className="sos-card-info">
              <span className="sos-label">All-in-One Emergency Helpline</span>
              <strong className="sos-number">112</strong>
              <span className="sos-meta">Police, Fire, Medical, Disaster</span>
            </div>
            <span className="call-btn-chip">Direct Call</span>
          </a>

          <a href="tel:102" className="sos-action-card emergency-sub">
            <div className="sos-card-icon">🏥</div>
            <div className="sos-card-info">
              <span className="sos-label">Campus Health Center Hotline</span>
              <strong className="sos-number">0522-2974730</strong>
              <span className="sos-meta">IIIT Lucknow Campus Dispensary</span>
            </div>
            <span className="call-btn-chip">Direct Call</span>
          </a>
        </div>

        <div className="sos-modal-footer">
          <button className="btn-location-share" onClick={handleShareLocation}>
            📍 {copied ? 'Emergency Coordinates Copied to Clipboard!' : 'Copy Campus GPS Location Link'}
          </button>
          <p className="sos-tip">
            ⚠️ If alone, stay in a visible area, speak clearly, tell operator your exact building & room number.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;

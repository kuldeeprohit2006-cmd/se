import { useState, useEffect } from 'react';
import API from '../api/axios';

const FirstAid = ({ onOpenSOS }) => {
  const [guides, setGuides] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeGuide, setActiveGuide] = useState(null);
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [bpmCount, setBpmCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/firstaid?category=${selectedCategory}`);
        setGuides(res.data.data);
        if (res.data.data.length > 0 && !activeGuide) {
          setActiveGuide(res.data.data[0]);
        }
      } catch (err) {
        setError('Failed to fetch first aid guides.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, [selectedCategory]);

  // CPR Metronome Effect (110 BPM = approx 545ms interval)
  useEffect(() => {
    let interval = null;
    if (metronomeActive) {
      interval = setInterval(() => {
        setBpmCount((prev) => (prev % 30) + 1);
      }, 545);
    } else {
      setBpmCount(0);
    }
    return () => clearInterval(interval);
  }, [metronomeActive]);

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <div className="page-title-wrap">
          <span className="page-header-icon">❤️</span>
          <div>
            <h1>CPR & Emergency First Aid Manual</h1>
            <p>Interactive life-saving procedures for cardiac arrest, airway obstruction, burns, and trauma</p>
          </div>
        </div>
        <button className="btn-emergency-top" onClick={onOpenSOS}>
          🚨 Call 108 For Ambulance
        </button>
      </div>

      {/* CPR Audio-Visual Metronome Widget */}
      <div className="cpr-metronome-widget">
        <div className="metronome-info">
          <span className="metronome-badge">CPR RHYTHM TRAINER</span>
          <h3>100–120 Compressions Per Minute</h3>
          <p>Maintain consistent chest compressions to the rhythm of the beat (like the song "Stayin' Alive").</p>
        </div>
        <div className="metronome-controls">
          <div className={`cpr-heart-pulse ${metronomeActive ? 'pulsing' : ''}`}>
            ❤️
            {metronomeActive && <span className="cpr-counter-display">{bpmCount}/30</span>}
          </div>
          <button
            className={`btn-metronome-toggle ${metronomeActive ? 'stop' : 'start'}`}
            onClick={() => setMetronomeActive(!metronomeActive)}
          >
            {metronomeActive ? '⏸️ Stop CPR Metronome' : '▶️ Start CPR Beat (110 BPM)'}
          </button>
        </div>
      </div>

      {/* Category selector */}
      <div className="categories-filter">
        {['all', 'cardiac', 'breathing', 'injury', 'poison'].map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? 'All Protocols' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading emergency medical protocols...</p>
        </div>
      )}

      {error && <div className="alert-error">{error}</div>}

      {!loading && (
        <div className="firstaid-layout">
          {/* Guide Selector List */}
          <div className="guides-nav-list">
            {guides.map((g) => (
              <div
                key={g.id}
                className={`guide-list-item ${activeGuide?.id === g.id ? 'active' : ''}`}
                onClick={() => setActiveGuide(g)}
              >
                <span className="guide-icon">{g.emoji}</span>
                <div className="guide-meta">
                  <h4>{g.title.split('(')[0]}</h4>
                  <span className={`urgency-tag ${g.urgency}`}>{g.urgencyLabel}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Guide Details View */}
          <div className="guide-detail-card">
            {activeGuide ? (
              <>
                <div className="guide-card-head">
                  <div className="head-title">
                    <span className="head-emoji">{activeGuide.emoji}</span>
                    <div>
                      <h2>{activeGuide.title}</h2>
                      <p className="guide-summary">{activeGuide.desc}</p>
                    </div>
                  </div>
                  <span className={`urgency-pill ${activeGuide.urgency}`}>{activeGuide.urgencyLabel}</span>
                </div>

                <div className="alert-call-first">
                  <strong>{activeGuide.callFirst}</strong>
                </div>

                <div className="steps-container">
                  <h3>Step-by-Step Instructions</h3>
                  <div className="steps-list">
                    {activeGuide.steps.map((st, i) => (
                      <div key={i} className="step-card">
                        <div className="step-number">{i + 1}</div>
                        <div className="step-body">
                          <h4>{st.title}</h4>
                          <p>{st.desc}</p>
                          {st.warning && <div className="step-warning">{st.warning}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {activeGuide.whenToCall && (
                  <div className="when-to-call-box">
                    <h4>🚨 When to Call Emergency Services (108) Immediately:</h4>
                    <ul>
                      {activeGuide.whenToCall.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p>Select a guide on the left to read instructions.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstAid;

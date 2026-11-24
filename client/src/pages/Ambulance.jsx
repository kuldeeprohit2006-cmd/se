import { useState, useEffect } from 'react';
import API from '../api/axios';

const Ambulance = ({ onOpenSOS }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('national');

  useEffect(() => {
    const fetchAmbulance = async () => {
      try {
        const res = await API.get('/ambulance');
        setData(res.data.data);
      } catch (err) {
        setError('Failed to fetch ambulance contacts. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchAmbulance();
  }, []);

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <div className="page-title-wrap">
          <span className="page-header-icon">🚑</span>
          <div>
            <h1>Emergency Ambulance Contacts</h1>
            <p>Immediate 24/7 medical transport, national dispatch centers, and nearby hospital networks</p>
          </div>
        </div>
        <button className="btn-emergency-top" onClick={onOpenSOS}>
          🚨 Instant SOS Dispatch
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading verified ambulance directory...</p>
        </div>
      )}

      {error && <div className="alert-error">{error}</div>}

      {!loading && data && (
        <>
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'national' ? 'active' : ''}`}
              onClick={() => setActiveTab('national')}
            >
              National Services ({data.national?.length || 0})
            </button>
            <button
              className={`tab-btn ${activeTab === 'campus' ? 'active' : ''}`}
              onClick={() => setActiveTab('campus')}
            >
              Campus & Student Units ({data.campus?.length || 0})
            </button>
            <button
              className={`tab-btn ${activeTab === 'hospitals' ? 'active' : ''}`}
              onClick={() => setActiveTab('hospitals')}
            >
              Emergency Hospital ERs ({data.hospitals?.length || 0})
            </button>
          </div>

          <div className="ambulance-grid">
            {activeTab === 'national' &&
              data.national?.map((item) => (
                <div key={item.id} className="contact-card border-emergency">
                  <div className="card-top-row">
                    <span className="badge-critical">{item.type}</span>
                    <span className="meta-time">⏱️ {item.responseTime}</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p className="card-desc">{item.desc}</p>
                  <div className="card-phone-section">
                    <span className="phone-display">{item.phone}</span>
                    <a href={`tel:${item.phone.replace(/[^0-9]/g, '')}`} className="btn-call-action">
                      📞 Call {item.phone}
                    </a>
                  </div>
                </div>
              ))}

            {activeTab === 'campus' &&
              data.campus?.map((item) => (
                <div key={item.id} className="contact-card border-campus">
                  <div className="card-top-row">
                    <span className="badge-campus">{item.type}</span>
                    <span className="meta-time">⏱️ {item.responseTime}</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p className="card-desc">{item.desc}</p>
                  <div className="card-phone-section">
                    <span className="phone-display">{item.phone}</span>
                    <a href={`tel:${item.phone.replace(/[^0-9]/g, '')}`} className="btn-call-action btn-campus">
                      📞 Call {item.phone}
                    </a>
                  </div>
                </div>
              ))}

            {activeTab === 'hospitals' &&
              data.hospitals?.map((item) => (
                <div key={item.id} className="contact-card border-hospital">
                  <div className="card-top-row">
                    <span className="badge-hospital">{item.city}</span>
                    <span className="meta-time">📍 {item.type}</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p className="card-desc">{item.desc}</p>
                  <div className="card-phone-section">
                    <span className="phone-display">{item.phone}</span>
                    <a href={`tel:${item.phone.replace(/[^0-9]/g, '')}`} className="btn-call-action btn-hospital">
                      📞 Call ER {item.phone}
                    </a>
                  </div>
                </div>
              ))}
          </div>

          <div className="emergency-notice-panel">
            <h4>💡 How to communicate during an ambulance call:</h4>
            <ul>
              <li><strong>1. State exact location:</strong> State campus gate number, building name, floor, and room number.</li>
              <li><strong>2. Describe symptoms:</strong> Unconscious? Breathing? Bleeding? Suspected cardiac or poisoning?</li>
              <li><strong>3. Assign someone to guide:</strong> Send a classmate to the campus gate to direct the ambulance crew inside.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Ambulance;

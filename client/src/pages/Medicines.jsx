import { useState, useEffect } from 'react';
import API from '../api/axios';

const Medicines = ({ onOpenSOS }) => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeds = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/medicines?search=${search}`);
        setMedicines(res.data.data);
        if (res.data.data.length > 0 && !selectedMed) {
          setSelectedMed(res.data.data[0]);
        }
      } catch (err) {
        setError('Failed to fetch medicine data.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMeds();
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <div className="page-title-wrap">
          <span className="page-header-icon">💊</span>
          <div>
            <h1>Emergency Medicine Reference</h1>
            <p>Verified dosage tables, OTC emergency remedies, and critical contraindications for students</p>
          </div>
        </div>
        <button className="btn-emergency-top" onClick={onOpenSOS}>
          🚨 Need Doctor Help? Call 108
        </button>
      </div>

      <div className="medicine-disclaimer-box">
        <span className="disc-icon">⚠️</span>
        <p>
          <strong>Medical Guidance Notice:</strong> This reference is for first-aid educational purposes. Always consult a licensed doctor or pharmacist before taking prescription medication. In acute emergencies (chest pain, severe anaphylaxis), call 108 immediately.
        </p>
      </div>

      {/* Search Input */}
      <div className="med-search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search medicines by symptom (e.g. fever, chest pain, allergy, dehydration)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="med-search-input"
        />
        {search && (
          <button className="btn-clear-search" onClick={() => setSearch('')}>
            ✕ Clear
          </button>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching medicines...</p>
        </div>
      )}

      {error && <div className="alert-error">{error}</div>}

      {!loading && (
        <div className="firstaid-layout">
          {/* Medicine List */}
          <div className="guides-nav-list">
            {medicines.length === 0 ? (
              <p className="no-data">No medicines matched "{search}".</p>
            ) : (
              medicines.map((m) => (
                <div
                  key={m.id}
                  className={`guide-list-item ${selectedMed?.id === m.id ? 'active' : ''}`}
                  onClick={() => setSelectedMed(m)}
                >
                  <span className="guide-icon">{m.icon}</span>
                  <div className="guide-meta">
                    <h4>{m.name}</h4>
                    <span className="med-generic">{m.generic}</span>
                    <span className={`tag-pill ${m.type === 'otc' ? 'otc-tag' : 'rx-tag'}`}>
                      {m.type === 'otc' ? 'OTC Available' : 'Doctor / Emergency'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Medicine Detailed View */}
          <div className="guide-detail-card">
            {selectedMed ? (
              <>
                <div className="guide-card-head">
                  <div className="head-title">
                    <span className="head-emoji">{selectedMed.icon}</span>
                    <div>
                      <h2>{selectedMed.name}</h2>
                      <p className="guide-summary"><strong>Generic:</strong> {selectedMed.generic}</p>
                    </div>
                  </div>
                  <span className={`urgency-pill ${selectedMed.type === 'otc' ? 'otc-pill' : 'critical'}`}>
                    {selectedMed.category}
                  </span>
                </div>

                <div className="alert-call-first med-primary-use">
                  <strong>🎯 Primary Use:</strong> {selectedMed.use}
                </div>

                {/* Dosage Table */}
                <div className="dosage-section">
                  <h3>Recommended Emergency Dosages</h3>
                  <div className="table-responsive">
                    <table className="dosage-table">
                      <thead>
                        <tr>
                          <th>Age / Patient Group</th>
                          <th>Standard Dose</th>
                          <th>Frequency</th>
                          <th>Max 24hr Limit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMed.dosageTable.map((d, i) => (
                          <tr key={i}>
                            <td><strong>{d.group}</strong></td>
                            <td>{d.dose}</td>
                            <td>{d.frequency}</td>
                            <td><span className="badge-max">{d.maxDaily}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Side Effects and Contraindications */}
                <div className="med-grid-info">
                  <div className="info-box-danger">
                    <h4>⛔ Do NOT Take If (Contraindications):</h4>
                    <ul>
                      {selectedMed.contraindications.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="info-box-warn">
                    <h4>⚠️ Known Side Effects:</h4>
                    <ul>
                      {selectedMed.sideEffects.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="emergency-note-box">
                  <h4>💡 Critical Emergency Note:</h4>
                  <p>{selectedMed.emergencyNote}</p>
                </div>
              </>
            ) : (
              <p>Select a medicine to view dosage guidelines.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicines;

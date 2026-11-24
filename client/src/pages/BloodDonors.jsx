import { useState, useEffect } from 'react';
import API from '../api/axios';

const BLOOD_GROUPS = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BloodDonors = () => {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/blood?type=${selectedGroup}`);
        setDonors(res.data.data);
      } catch (err) {
        setError('Failed to fetch blood donor contacts. Please check backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, [selectedGroup]);

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <div className="page-title-wrap">
          <span className="page-header-icon">🩸</span>
          <div>
            <h1>Emergency Blood Donors & Banks</h1>
            <p>Verified 24/7 blood repositories, volunteer donor networks, and rare group hotlines</p>
          </div>
        </div>
        <div className="universal-donor-tag">
          <span>Universal Donor: <strong>O-Negative (O-)</strong></span>
          <span>Universal Recipient: <strong>AB-Positive (AB+)</strong></span>
        </div>
      </div>

      {/* Filter by Blood Group */}
      <div className="blood-filter-bar">
        <span className="filter-title">Filter by Blood Type:</span>
        <div className="blood-pills">
          {BLOOD_GROUPS.map((grp) => (
            <button
              key={grp}
              className={`blood-pill-btn ${selectedGroup === grp ? 'active' : ''}`}
              onClick={() => setSelectedGroup(grp)}
            >
              {grp === 'all' ? 'All Types' : grp}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Filtering available blood banks and donor hotlines...</p>
        </div>
      )}

      {error && <div className="alert-error">{error}</div>}

      {!loading && (
        <div className="donors-grid">
          {donors.length === 0 ? (
            <p className="no-data">No blood banks currently listed for this group. Try calling 108 or eRaktKosh.</p>
          ) : (
            donors.map((item, idx) => (
              <div key={idx} className="donor-card">
                <div className="donor-card-top">
                  <span className="donor-city-badge">📍 {item.city}</span>
                  <span className="donor-timing">🕒 {item.available}</span>
                </div>
                <h3>{item.org}</h3>
                
                <div className="available-types">
                  <span className="types-label">Groups stocked:</span>
                  <div className="types-tags">
                    {item.types.map((t) => (
                      <span
                        key={t}
                        className={`type-tag ${selectedGroup === t ? 'matched' : ''}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="donor-card-footer">
                  <span className="donor-phone">{item.phone}</span>
                  <a href={`tel:${item.phone.replace(/[^0-9]/g, '')}`} className="btn-call-donor">
                    📞 Call Bank
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Blood Compatibility Guide */}
      <div className="blood-matrix-card">
        <h3>🩸 Quick Blood Compatibility Reference</h3>
        <div className="matrix-table-wrap">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Recipient Type</th>
                <th>Can Receive Red Blood Cells From</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>O-</strong></td><td>O- only</td></tr>
              <tr><td><strong>O+</strong></td><td>O+, O-</td></tr>
              <tr><td><strong>A-</strong></td><td>A-, O-</td></tr>
              <tr><td><strong>A+</strong></td><td>A+, A-, O+, O-</td></tr>
              <tr><td><strong>B-</strong></td><td>B-, O-</td></tr>
              <tr><td><strong>B+</strong></td><td>B+, B-, O+, O-</td></tr>
              <tr><td><strong>AB-</strong></td><td>AB-, A-, B-, O-</td></tr>
              <tr><td><strong>AB+</strong></td><td>All Blood Types (Universal Recipient)</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BloodDonors;

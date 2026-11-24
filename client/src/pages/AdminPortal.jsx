import { useState, useEffect } from 'react';
import API from '../api/axios';
import soundFX from '../utils/audioFX';

const AdminPortal = ({ onStartCall }) => {
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'roster' | 'fleet'

  const fetchData = async () => {
    try {
      const [statsRes, incRes, studentsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/incidents'),
        API.get('/admin/students')
      ]);
      setStats(statsRes.data.data);
      setIncidents(incRes.data.data);
      setStudents(studentsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load Admin Command Center data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // Polling every 8s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    soundFX.playDialTone();
    try {
      await API.patch(`/incidents/${id}/status`, {
        status: newStatus,
        dispatcherNotes: `Status changed to ${newStatus} by Campus Admin Director.`
      });
      fetchData();
    } catch (err) {
      alert('Failed to update incident status');
    }
  };

  const filteredStudents = students.filter((s) => {
    if (selectedBranch !== 'all' && s.branchCode !== selectedBranch && s.branch !== selectedBranch) return false;
    if (studentSearch) {
      const q = studentSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.rollNo && s.rollNo.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="page-wrapper container">
      {/* Admin HUD Header */}
      <div className="admin-hud-header">
        <div className="hud-title-wrap">
          <div className="hud-radar-pulse">🛡️</div>
          <div>
            <h1>CAMPUS EMERGENCY COMMAND CENTER</h1>
            <p>IIIT Lucknow Central Medical Response & Incident Dispatch Console</p>
          </div>
        </div>
        <div className="hud-telemetry-badge">
          <span className="live-dot green"></span>
          <span>SYSTEM: {stats?.systemStatus || 'ONLINE_SECURE'}</span>
        </div>
      </div>

      {error && <div className="alert-error"><span>⚠️</span> {error}</div>}

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card danger">
          <div className="kpi-icon">🚨</div>
          <div className="kpi-data">
            <span className="kpi-label">Active Incidents</span>
            <strong className="kpi-value">{stats?.activeIncidents || 0}</strong>
          </div>
          <span className="kpi-sub">Needs response</span>
        </div>

        <div className="kpi-card success">
          <div className="kpi-icon">✅</div>
          <div className="kpi-data">
            <span className="kpi-label">Resolved Emergencies</span>
            <strong className="kpi-value">{stats?.resolvedIncidents || 0}</strong>
          </div>
          <span className="kpi-sub">Cases managed</span>
        </div>

        <div className="kpi-card primary">
          <div className="kpi-icon">🎓</div>
          <div className="kpi-data">
            <span className="kpi-label">Students Protected</span>
            <strong className="kpi-value">{students?.length || 0}</strong>
          </div>
          <span className="kpi-sub">LCS, LIT, LCI, LCB</span>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-icon">🚑</div>
          <div className="kpi-data">
            <span className="kpi-label">Fleet Readiness</span>
            <strong className="kpi-value">3 Active</strong>
          </div>
          <span className="kpi-sub">Avg ETA 2.3 min</span>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="tabs-header admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'incidents' ? 'active' : ''}`}
          onClick={() => setActiveTab('incidents')}
        >
          🚨 Live SOS Incidents ({incidents.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          📋 Student Roster (LCS/LIT/LCI/LCB)
        </button>
        <button
          className={`tab-btn ${activeTab === 'fleet' ? 'active' : ''}`}
          onClick={() => setActiveTab('fleet')}
        >
          🚑 Ambulance Fleet Dispatch
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Syncing Command Center telemetry...</p>
        </div>
      )}

      {/* Tab 1: Live Incidents */}
      {!loading && activeTab === 'incidents' && (
        <div className="admin-incidents-panel">
          {incidents.length === 0 ? (
            <div className="no-incidents-banner">
              <span>✅</span>
              <h3>All Quiet on Campus</h3>
              <p>No active emergencies currently reported by students.</p>
            </div>
          ) : (
            <div className="incidents-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student ID / Name</th>
                    <th>Branch / Roll</th>
                    <th>Campus Zone</th>
                    <th>Emergency Type</th>
                    <th>Status</th>
                    <th>Reported Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc) => (
                    <tr key={inc._id} className={`incident-row ${inc.status.toLowerCase()}`}>
                      <td>
                        <strong>{inc.studentName}</strong>
                        <span className="table-sub">{inc.studentEmail}</span>
                      </td>
                      <td>
                        <span className={`branch-chip ${inc.studentBranch?.toLowerCase()}`}>
                          {inc.studentBranch || 'General'}
                        </span>
                        <span className="roll-tag">Roll {inc.studentRollNo || '—'}</span>
                      </td>
                      <td>
                        <span className="zone-pill">📍 {inc.campusZone}</span>
                      </td>
                      <td>
                        <span className="emergency-type-text">{inc.emergencyType}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${inc.status.toLowerCase()}`}>
                          {inc.status}
                        </span>
                      </td>
                      <td>
                        <span className="table-time">
                          {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <div className="table-action-btns">
                          {inc.status === 'TRIGGERED' && (
                            <button
                              className="btn-action-dispatch"
                              onClick={() => handleUpdateStatus(inc._id, 'DISPATCHED')}
                              title="Dispatch Ambulance"
                            >
                              🚑 Dispatch
                            </button>
                          )}
                          {inc.status === 'DISPATCHED' && (
                            <button
                              className="btn-action-resolve"
                              onClick={() => handleUpdateStatus(inc._id, 'RESOLVED')}
                              title="Mark Incident Resolved"
                            >
                              ✅ Resolve
                            </button>
                          )}
                          <button
                            className="btn-action-call"
                            onClick={() => onStartCall(inc)}
                            title="Open Audio Dispatch Channel"
                          >
                            📞 Connect
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Student Roster */}
      {!loading && activeTab === 'roster' && (
        <div className="admin-roster-panel">
          <div className="roster-toolbar">
            <div className="branch-filter-pills">
              {['all', 'lcs', 'lit', 'lci', 'lcb'].map((b) => (
                <button
                  key={b}
                  className={`roster-pill ${selectedBranch === b ? 'active' : ''}`}
                  onClick={() => setSelectedBranch(b)}
                >
                  {b === 'all' ? 'All Branches' : b.toUpperCase()}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search by student name or roll..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="roster-search-input"
            />
          </div>

          <div className="incidents-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>IIIT Lucknow Email</th>
                  <th>Branch</th>
                  <th>Batch</th>
                  <th>Campus Location</th>
                  <th>Emergency Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <strong className="roll-number-highlight">
                        {s.rollNo ? s.rollNo : '—'}
                      </strong>
                    </td>
                    <td>{s.name}</td>
                    <td className="font-mono">{s.email}</td>
                    <td>
                      <span className={`branch-chip ${s.branchCode || s.branch?.toLowerCase()}`}>
                        {s.branch}
                      </span>
                    </td>
                    <td>{s.batch || '2025'}</td>
                    <td>{s.campusLocation || 'Boys Hostel 1'}</td>
                    <td>
                      <button
                        className="btn-call-mini"
                        onClick={() =>
                          onStartCall({
                            _id: s._id,
                            studentName: s.name,
                            studentEmail: s.email,
                            campusZone: s.campusLocation || 'Hostel'
                          })
                        }
                      >
                        📞 Test Call
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Ambulance Fleet */}
      {!loading && activeTab === 'fleet' && (
        <div className="fleet-grid">
          {stats?.ambulanceFleet?.map((amb) => (
            <div key={amb.id} className="fleet-card">
              <div className="fleet-card-top">
                <span className="fleet-id">{amb.id}</span>
                <span className="fleet-status-badge">{amb.status}</span>
              </div>
              <div className="fleet-icon">🚑</div>
              <h3>Emergency Response Unit</h3>
              <p className="fleet-location">📍 Station: {amb.location}</p>
              <div className="fleet-eta">Estimated Campus Arrival: <strong>{amb.eta}</strong></div>
              <a href="tel:108" className="btn-call-action btn-fleet">
                📞 Call Driver Direct
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPortal;

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SOSModal from './components/SOSModal';
import AudioDispatchCallModal from './components/AudioDispatchCallModal';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Ambulance from './pages/Ambulance';
import BloodDonors from './pages/BloodDonors';
import FirstAid from './pages/FirstAid';
import Medicines from './pages/Medicines';
import AdminPortal from './pages/AdminPortal';

function App() {
  const [sosOpen, setSosOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [activeIncident, setActiveIncident] = useState(null);

  const handleStartCall = (incident = null) => {
    setActiveIncident(incident);
    setCallModalOpen(true);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar
            onOpenSOS={() => setSosOpen(true)}
            onStartCall={() => handleStartCall(null)}
          />

          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes (JWT required) */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={
                    <Dashboard
                      onOpenSOS={() => setSosOpen(true)}
                      onStartCall={() => handleStartCall(null)}
                    />
                  }
                />
                <Route
                  path="/ambulance"
                  element={<Ambulance onOpenSOS={() => setSosOpen(true)} />}
                />
                <Route path="/blood" element={<BloodDonors />} />
                <Route
                  path="/firstaid"
                  element={<FirstAid onOpenSOS={() => setSosOpen(true)} />}
                />
                <Route
                  path="/medicines"
                  element={<Medicines onOpenSOS={() => setSosOpen(true)} />}
                />
                {/* Admin Command Portal */}
                <Route
                  path="/admin"
                  element={<AdminPortal onStartCall={handleStartCall} />}
                />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* SOS Emergency Modal */}
          <SOSModal
            isOpen={sosOpen}
            onClose={() => setSosOpen(false)}
            onStartCall={handleStartCall}
          />

          {/* Real Audio Dispatch Call Modal */}
          <AudioDispatchCallModal
            isOpen={callModalOpen}
            onClose={() => setCallModalOpen(false)}
            incidentData={activeIncident}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

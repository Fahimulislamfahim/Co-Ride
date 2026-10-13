import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import API from './services/api';

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [driverProfile, setDriverProfile] = useState(null);
  const [driverProfileError, setDriverProfileError] = useState('');

  useEffect(() => {
    if (currentUser?.role !== 'driver') return undefined;

    let isActive = true;
    API.get('/auth/driver-profile')
      .then((res) => {
        if (isActive) setDriverProfile(res.data.profile);
      })
      .catch((error) => {
        if (isActive) {
          setDriverProfileError(error.response?.data?.message || 'Could not load driver profile');
        }
      });

    return () => {
      isActive = false;
    };
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  if (currentUser) {
    if (currentUser.role === 'admin') {
      return (
        <div className="admin_layout">
          <header className="admin_bar">
            <span className="admin_session">Logged in as Admin: <strong className="admin_name">{currentUser.name}</strong></span>
            <button
              onClick={handleLogout}
              className="logout_button logout_toolbar"
            >
              Log Out
            </button>
          </header>
          <AdminDashboard />
        </div>
      );
    }

    const profile = driverProfile || currentUser;
    const verificationStatus = profile.verificationStatus || (profile.isVerified ? 'approved' : 'pending');

    return (
      <main className="profile_page">
        <section className="profile_card">
          <div className="profile_avatar">
            {currentUser.name.charAt(0)}
          </div>
          <h1 className="profile_name">{currentUser.name}</h1>
          <p className="profile_email">{currentUser.email}</p>
          <div className="profile_role">
            Role: {currentUser.role}
          </div>
          <p className="profile_status">
            Verification Status: {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
          </p>
          {driverProfileError && <p role="alert">{driverProfileError}</p>}
          {currentUser.role === 'driver' && profile.vehicle && (
            <dl className="driver_profile_details">
              <div><dt>Vehicle type</dt><dd>{profile.vehicle.type}</dd></div>
              <div><dt>Model</dt><dd>{profile.vehicle.model}</dd></div>
              <div><dt>Registration plate</dt><dd>{profile.vehicle.registrationPlate}</dd></div>
              <div><dt>Driving license</dt><dd>{profile.hasLicenseDocument ? 'Submitted' : 'Not submitted'}</dd></div>
            </dl>
          )}
          <div className="profile_actions">
            <button
              onClick={handleLogout}
              className="logout_button logout_profile"
            >
              Log Out
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      {isRegister ? (
        <RegisterPage onSwitchToLogin={() => setIsRegister(false)} />
      ) : (
        <LoginPage onSwitchToRegister={() => setIsRegister(true)} />
      )}
    </>
  );
}

export default App;
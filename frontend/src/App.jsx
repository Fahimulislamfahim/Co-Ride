import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import API from './services/api';
import ProfilePage from './pages/ProfilePage';
import VerificationBadge from './components/VerificationBadge';
import { 
  Car, 
  ShieldAlert, 
  ShieldCheck, 
  LogOut, 
  Edit3, 
  Mail, 
  UserCheck, 
  Sparkles,
  FileText
} from 'lucide-react';

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [driverProfile, setDriverProfile] = useState(null);
  const [driverProfileError, setDriverProfileError] = useState('');
  const [showProfile, setShowProfile] = useState(false);

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
            <div className="admin_brand_lockup">
              <div className="admin_brand_icon">
                <Car size={20} />
              </div>
              <span className="admin_brand_title">
                Co<span className="brand_accent">Ride</span> Admin
              </span>
            </div>

            <div className="admin_toolbar_right">
              <div className="admin_session_badge">
                <ShieldCheck size={16} className="admin_badge_icon" />
                <span className="admin_session">
                  Administrator: <strong className="admin_name">{currentUser.name}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="logout_button logout_toolbar"
                aria-label="Log Out of Admin"
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          </header>
          <AdminDashboard />
        </div>
      );
    }

    if (showProfile) {
      return (
        <ProfilePage
          onBack={() => setShowProfile(false)}
          onUpdated={(u) => {
            const updated = { ...currentUser, name: u.name };
            localStorage.setItem('user', JSON.stringify(updated));
            setCurrentUser(updated);
          }}
        />
      );
    }

    const profile = driverProfile || currentUser;
    const verificationStatus = profile.verificationStatus || (profile.isVerified ? 'approved' : 'pending');

    return (
      <main className="profile_page">
        <section className="profile_card main_profile_card">
          <div className="profile_header_brand">
            <div className="profile_header_badge">
              <Sparkles size={14} />
              <span>DIU Commute Hub</span>
            </div>
          </div>

          <div className="profile_avatar_container">
            <div className="profile_avatar_ring">
              <div className="profile_avatar">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>

          <h1 className="profile_name">{currentUser.name}</h1>
          <p className="profile_email">
            <Mail size={14} className="inline_icon" />
            <span>{currentUser.email}</span>
          </p>

          <div className="profile_status_cluster">
            <div className={`profile_role profile_role--${currentUser.role}`}>
              <UserCheck size={14} />
              <span>{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</span>
            </div>
            <VerificationBadge isVerified={profile.isVerified} status={verificationStatus} />
          </div>

          {driverProfileError && (
            <p role="alert" className="profile_error_banner">
              <ShieldAlert size={16} />
              <span>{driverProfileError}</span>
            </p>
          )}

          {currentUser.role === 'driver' && profile.vehicle && (
            <div className="driver_details_card">
              <h3 className="driver_details_title">
                <Car size={16} />
                <span>Registered Vehicle</span>
              </h3>
              <dl className="driver_profile_details">
                <div className="detail_row">
                  <dt>Vehicle Type</dt>
                  <dd>{profile.vehicle.type ? profile.vehicle.type.charAt(0).toUpperCase() + profile.vehicle.type.slice(1) : 'Standard'}</dd>
                </div>
                <div className="detail_row">
                  <dt>Model</dt>
                  <dd>{profile.vehicle.model}</dd>
                </div>
                <div className="detail_row">
                  <dt>Plate Number</dt>
                  <dd className="plate_badge">{profile.vehicle.registrationPlate}</dd>
                </div>
                <div className="detail_row">
                  <dt>Driving License</dt>
                  <dd>
                    {profile.hasLicenseDocument ? (
                      <span className="doc_status_chip doc_status_chip--verified">
                        <FileText size={13} /> Submitted
                      </span>
                    ) : (
                      <span className="doc_status_chip doc_status_chip--pending">
                        Not Submitted
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <div className="profile_actions">
            <button 
              type="button" 
              onClick={() => setShowProfile(true)}
              className="action_btn edit_btn"
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="logout_button logout_profile"
            >
              <LogOut size={16} />
              <span>Log Out</span>
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
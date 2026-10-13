import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

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
            Verification Status: {currentUser.isVerified ? 'Verified' : 'Pending Approval'}
          </p>
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
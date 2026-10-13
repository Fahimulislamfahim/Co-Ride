import React, { useState } from 'react';
import API from '../services/api';

const LoginPage = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', formData);
      if (res.data.success) {
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert(`Welcome back, ${res.data.user.name}! Role: ${res.data.user.role}`);
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth_page login_page">
      <div className="auth_card">
        <header className="auth_header login_header">
          <h1 className="auth_brand">Co<span className="brand_accent">Ride</span></h1>
          <p className="auth_text">Your Daily Campus Commute Partner</p>
        </header>

        {error && (
          <div className="auth_message error_message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth_form login_form">
          <div className="form_field">
            <label className="form_label">
              DIU Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@diu.edu.bd"
              required
              className="form_input"
            />
          </div>

          <div className="form_field">
            <label className="form_label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="******"
              required
              className="form_input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth_submit"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <footer className="auth_footer login_footer">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="switch_button"
          >
            Sign up
          </button>
        </footer>
      </div>
    </main>
  );
};

export default LoginPage;
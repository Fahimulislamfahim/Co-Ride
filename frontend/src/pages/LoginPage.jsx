import { useState } from 'react';
import API from '../services/api';
import { Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = ({ onSwitchToRegister, onBackToHome }) => {
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
        {onBackToHome && (
          <button type="button" onClick={onBackToHome} className="auth_back_home_btn">
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </button>
        )}
        <header className="auth_header login_header">
          <div className="brand_logo_container">
            <div className="brand_icon_glow"></div>
            <div className="brand_icon_wrapper brand_icon_wrapper--logo">
              <img src="/logo.png" alt="CoRide Logo" className="auth_brand_logo_img" />
            </div>
          </div>
          <div className="brand_pill_tag">
            <span className="brand_pill_dot"></span>
            DIU Smart Mobility
          </div>
          <h1 className="auth_brand">Co<span className="brand_accent">Ride</span></h1>
          <p className="auth_text">Your Daily Campus Commute Partner</p>
        </header>

        {error && (
          <div className="auth_message error_message">
            <AlertCircle size={18} className="message_icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth_form login_form">
          <div className="form_field">
            <label className="form_label">
              DIU Institutional Email
            </label>
            <div className="input_with_icon">
              <Mail className="field_icon" size={17} />
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
          </div>

          <div className="form_field">
            <label className="form_label">
              Password
            </label>
            <div className="input_with_icon">
              <Lock className="field_icon" size={17} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="form_input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth_submit"
          >
            {loading ? (
              <>
                <Loader2 className="btn_spinner" size={18} />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={17} className="btn_arrow" />
              </>
            )}
          </button>
        </form>

        <footer className="auth_footer login_footer">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="switch_button"
          >
            Create account
          </button>
        </footer>
      </div>
    </main>
  );
};

export default LoginPage;
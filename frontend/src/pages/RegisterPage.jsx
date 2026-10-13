import { useState } from 'react';
import API from '../services/api';

const RegisterPage = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    role: 'passenger',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [licenseDocument, setLicenseDocument] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.endsWith('@diu.edu.bd')) {
      return setError('Must use an official DIU email address');
    }

    setLoading(true);

    try {
      const registrationData = formData.role === 'driver'
        ? new FormData()
        : formData;

      if (formData.role === 'driver') {
        Object.entries(formData).forEach(([key, value]) => {
          registrationData.append(key, value);
        });
        registrationData.append('licenseDocument', licenseDocument);
      }

      const res = await API.post('/auth/register', registrationData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert('Registration completed! Welcome to CoRide.');
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth_page register_page">
      <div className="auth_card">
        <header className="auth_header register_header">
          <h1 className="auth_brand">Co<span className="brand_accent">Ride</span></h1>
          <p className="auth_text">Register for Campus Ridesharing</p>
        </header>

        {error && (
          <div className="auth_message error_message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth_form register_form">
          <div className="form_field">
            <label className="form_label">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Fahimul Islam"
              required
              className="form_input"
            />
          </div>

          <div className="register_fields">
            <div className="form_field">
              <label className="form_label">
                Student ID
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="241-35-371"
                required
                className="form_input"
              />
            </div>

            <div className="form_field">
              <label className="form_label">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="017xxxxxxxx"
                className="form_input"
              />
            </div>
          </div>

          <div className="form_field">
            <label className="form_label">
              DIU Institutional Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@diu.edu.bd"
              required
              className="form_input"
            />
          </div>

          <div className="form_field">
            <label className="form_label">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form_input form_select"
            >
              <option value="passenger">Passenger (Looking for rides)</option>
              <option value="driver">Driver (Have bike/car to share seats)</option>
            </select>
          </div>

          {formData.role === 'driver' && (
            <fieldset className="register_driver_section">
              <legend>Driver and vehicle details</legend>

              <div className="form_field">
                <label className="form_label" htmlFor="vehicleType">
                  Vehicle type
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType || ''}
                  onChange={handleChange}
                  required
                  className="form_input form_select"
                >
                  <option value="" disabled>Select a vehicle</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Car</option>
                </select>
              </div>

              <div className="form_field">
                <label className="form_label" htmlFor="vehicleModel">
                  Vehicle model
                </label>
                <input
                  id="vehicleModel"
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel || ''}
                  onChange={handleChange}
                  placeholder="e.g. Honda CB Hornet 160R"
                  maxLength={80}
                  required
                  className="form_input"
                />
              </div>

              <div className="form_field">
                <label className="form_label" htmlFor="registrationPlate">
                  Registration plate number
                </label>
                <input
                  id="registrationPlate"
                  type="text"
                  name="registrationPlate"
                  value={formData.registrationPlate || ''}
                  onChange={handleChange}
                  placeholder="e.g. DHAKA METRO-GA 12-3456"
                  maxLength={25}
                  pattern="[A-Za-z0-9][A-Za-z0-9 -]{2,24}"
                  required
                  className="form_input"
                />
              </div>

              <div className="form_field">
                <label className="form_label" htmlFor="licenseDocument">
                  Driving license image
                </label>
                <input
                  id="licenseDocument"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setLicenseDocument(event.target.files?.[0] || null)}
                  required
                  className="form_input register_file_input"
                />
                <span className="register_file_hint">JPEG, PNG, or WebP. Maximum 5 MB.</span>
              </div>
            </fieldset>
          )}

          <div className="form_field">
            <label className="form_label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              className="form_input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth_submit"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <footer className="auth_footer register_footer">
          Already registered?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="switch_button"
          >
            Log in
          </button>
        </footer>
      </div>
    </main>
  );
};

export default RegisterPage;
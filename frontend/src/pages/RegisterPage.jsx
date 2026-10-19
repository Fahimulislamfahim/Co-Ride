import { useState } from 'react';
import API from '../services/api';
import { 
  Car,
  User, 
  Hash, 
  Phone, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  ArrowLeft 
} from 'lucide-react';

const RegisterPage = ({ onSwitchToLogin, initialRole = 'passenger', onBackToHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    role: initialRole || 'passenger',
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
        {onBackToHome && (
          <button type="button" onClick={onBackToHome} className="auth_back_home_btn">
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </button>
        )}
        <header className="auth_header register_header">
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
          <p className="auth_text">Register for Campus Ridesharing</p>
        </header>

        {error && (
          <div className="auth_message error_message">
            <AlertCircle size={18} className="message_icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth_form register_form">
          <div className="form_field">
            <label className="form_label">
              Full Name
            </label>
            <div className="input_with_icon">
              <User className="field_icon" size={17} />
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
          </div>

          <div className="register_fields">
            <div className="form_field">
              <label className="form_label">
                Student ID
              </label>
              <div className="input_with_icon">
                <Hash className="field_icon" size={17} />
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
            </div>

            <div className="form_field">
              <label className="form_label">
                Phone Number
              </label>
              <div className="input_with_icon">
                <Phone className="field_icon" size={17} />
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
          </div>

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
                placeholder="student@diu.edu.bd"
                required
                className="form_input"
              />
            </div>
          </div>

          <div className="form_field">
            <label className="form_label">
              Commute Role
            </label>
            <div className="input_with_icon">
              <ShieldCheck className="field_icon" size={17} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form_input form_select"
              >
                <option value="passenger">Passenger (Looking for campus rides)</option>
                <option value="driver">Driver (Share vehicle seats with peers)</option>
              </select>
            </div>
          </div>

          {formData.role === 'driver' && (
            <fieldset className="register_driver_section">
              <legend>
                <Car size={15} className="legend_icon" />
                <span>Driver & Vehicle Verification</span>
              </legend>

              <div className="form_field">
                <label className="form_label" htmlFor="vehicleType">
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType || ''}
                  onChange={handleChange}
                  required
                  className="form_input form_select"
                >
                  <option value="" disabled>Select vehicle category</option>
                  <option value="motorcycle">Motorcycle / Scooter</option>
                  <option value="car">Car / Microbus</option>
                </select>
              </div>

              <div className="form_field">
                <label className="form_label" htmlFor="vehicleModel">
                  Vehicle Model
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
                  Registration Plate Number
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
                  Driving License Document
                </label>
                <div className="file_upload_box">
                  <input
                    id="licenseDocument"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setLicenseDocument(event.target.files?.[0] || null)}
                    required
                    className="form_input register_file_input"
                  />
                  <div className="file_upload_indicator">
                    {licenseDocument ? (
                      <span className="file_selected_text">
                        <FileCheck size={16} className="file_icon_success" />
                        {licenseDocument.name}
                      </span>
                    ) : (
                      <span className="file_prompt_text">
                        <Upload size={16} /> Choose document image
                      </span>
                    )}
                  </div>
                </div>
                <span className="register_file_hint">Accepted: JPEG, PNG, or WebP. Maximum 5 MB.</span>
              </div>
            </fieldset>
          )}

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
                placeholder="Minimum 6 characters"
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <CheckCircle2 size={17} className="btn_arrow" />
              </>
            )}
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
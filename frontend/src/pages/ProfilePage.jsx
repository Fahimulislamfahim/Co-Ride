import { useEffect, useState } from 'react';
import API from '../services/api';
import VerificationBadge from '../components/VerificationBadge';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  HeartHandshake, 
  Save, 
  Star, 
  Compass, 
  IdCard, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

function ProfilePage({ onBack, onUpdated }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', ecName: '', ecPhone: '' });
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/profile')
      .then((res) => {
        const d = res.data;
        setUser(d);
        setForm({
          name: d.name || '',
          phone: d.phone || '',
          ecName: d.emergencyContact?.name || '',
          ecPhone: d.emergencyContact?.phone || '',
        });
      })
      .catch((err) => {
        setMsg(err.response?.data?.message || 'Could not load profile');
        setIsSuccess(false);
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await API.put('/profile', {
        name: form.name,
        phone: form.phone,
        emergencyContact: { name: form.ecName, phone: form.ecPhone },
      });
      setUser(res.data);
      setMsg('Profile updated successfully!');
      setIsSuccess(true);
      if (onUpdated) onUpdated(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
      setIsSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="profile_page">
        <div className="profile_loading_card">
          <Loader2 className="btn_spinner" size={28} />
          <p>{msg || 'Loading your profile details...'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile_page">
      <section className="profile_card profile_edit_card">
        <header className="profile_card_header">
          <button type="button" onClick={onBack} className="back_button" aria-label="Go back">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
        </header>

        <div className="profile_hero">
          <div className="profile_avatar_wrapper">
            <div className="profile_avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <h1 className="profile_name">{user.name}</h1>
          <p className="profile_email">{user.email}</p>
          <div className="profile_badge_row">
            <VerificationBadge isVerified={user.isVerified} status={user.verificationStatus} />
          </div>
        </div>

        <div className="profile_metrics_grid">
          <div className="metric_chip">
            <IdCard size={16} className="metric_icon" />
            <div className="metric_content">
              <span className="metric_label">Student ID</span>
              <span className="metric_value">{user.studentId || 'N/A'}</span>
            </div>
          </div>
          <div className="metric_chip">
            <Compass size={16} className="metric_icon" />
            <div className="metric_content">
              <span className="metric_label">Total Trips</span>
              <span className="metric_value">{user.tripCount ?? 0}</span>
            </div>
          </div>
          <div className="metric_chip">
            <Star size={16} className="metric_icon metric_star" />
            <div className="metric_content">
              <span className="metric_label">Average Rating</span>
              <span className="metric_value">{user.averageRating ? `${user.averageRating} / 5` : 'New Member'}</span>
            </div>
          </div>
        </div>

        <div className="profile_form_section">
          <h3 className="section_title">
            <User size={18} />
            <span>Edit Profile Details</span>
          </h3>

          <div className="edit_form_grid">
            <div className="form_field">
              <label className="form_label">Full Name</label>
              <div className="input_with_icon">
                <User size={16} className="field_icon" />
                <input 
                  type="text"
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Your Full Name"
                  className="form_input"
                />
              </div>
            </div>

            <div className="form_field">
              <label className="form_label">Contact Phone</label>
              <div className="input_with_icon">
                <Phone size={16} className="field_icon" />
                <input 
                  type="text"
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  placeholder="017xxxxxxxx"
                  className="form_input"
                />
              </div>
            </div>

            <div className="form_field">
              <label className="form_label">Emergency Contact Name</label>
              <div className="input_with_icon">
                <HeartHandshake size={16} className="field_icon" />
                <input 
                  type="text"
                  name="ecName" 
                  value={form.ecName} 
                  onChange={handleChange} 
                  placeholder="Parent or Guardian Name"
                  className="form_input"
                />
              </div>
            </div>

            <div className="form_field">
              <label className="form_label">Emergency Contact Phone</label>
              <div className="input_with_icon">
                <Phone size={16} className="field_icon" />
                <input 
                  type="text"
                  name="ecPhone" 
                  value={form.ecPhone} 
                  onChange={handleChange} 
                  placeholder="Emergency Phone Number"
                  className="form_input"
                />
              </div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleSave} 
            disabled={saving}
            className="save_profile_button"
          >
            {saving ? (
              <>
                <Loader2 size={17} className="btn_spinner" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={17} />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>

          {msg && (
            <div className={`form_feedback ${isSuccess ? 'feedback_success' : 'feedback_error'}`}>
              {isSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{msg}</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
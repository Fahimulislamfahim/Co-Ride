import { useEffect, useState } from 'react';
import API from '../services/api';
import VerificationBadge from '../components/VerificationBadge';

function ProfilePage({ onBack, onUpdated }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', ecName: '', ecPhone: '' });
  const [msg, setMsg] = useState('');

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
      .catch((err) => setMsg(err.response?.data?.message || 'Could not load profile'));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await API.put('/profile', {
        name: form.name,
        phone: form.phone,
        emergencyContact: { name: form.ecName, phone: form.ecPhone },
      });
      setUser(res.data);
      setMsg('Profile updated!');
      if (onUpdated) onUpdated(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  if (!user) return <p style={{ padding: 20 }}>{msg || 'Loading...'}</p>;

  return (
    <main className="profile_page">
      <section className="profile_card">
        <button onClick={onBack}>← Back</button>
        <h1 className="profile_name">{user.name}</h1>
        <VerificationBadge isVerified={user.isVerified} status={user.verificationStatus} />
        <p className="profile_email">{user.email}</p>
        <p>Student ID: {user.studentId}</p>
        <p>Trips: {user.tripCount} | Rating: {user.averageRating} ⭐</p>

        <h3>Edit Profile</h3>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" /><br />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" /><br />
        <input name="ecName" value={form.ecName} onChange={handleChange} placeholder="Emergency contact name" /><br />
        <input name="ecPhone" value={form.ecPhone} onChange={handleChange} placeholder="Emergency contact phone" /><br />
        <button onClick={handleSave}>Save</button>
        {msg && <p>{msg}</p>}
      </section>
    </main>
  );
}

export default ProfilePage;
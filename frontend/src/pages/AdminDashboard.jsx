import { useState, useEffect } from 'react';
import API from '../services/api';

const LicenseDocumentPreview = ({ userId }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    let isActive = true;
    let objectUrl;

    API.get(`/admin/license/${userId}`, { responseType: 'blob' })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        if (isActive) setImageUrl(objectUrl);
        else URL.revokeObjectURL(objectUrl);
      })
      .catch(() => {});

    return () => {
      isActive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [userId]);

  return imageUrl
    ? <a href={imageUrl} target="_blank" rel="noreferrer"><img className="license_preview" src={imageUrl} alt="Uploaded driving license" /></a>
    : <span>License image unavailable</span>;
};

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/admin/pending')
      .then((res) => {
        if (res.data.success) setPendingUsers(res.data.users);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to fetch pending queue');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (userId, action) => {
    setMessage('');
    setError('');
    try {
      const res = await API.put(`/admin/verify/${userId}`, { status: action });
      if (res.data.success) {
        setMessage(res.data.message);
        setPendingUsers(pendingUsers.filter((u) => u._id !== userId));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <main className="admin_dashboard">
      <div className="dashboard_box">
        <header className="dashboard_header">
          <div>
            <h1 className="dashboard_title">Admin Dashboard</h1>
            <p className="dashboard_subtitle">Pending Verification Review Queue</p>
          </div>
          <span className="queue_count">
            Pending Queue: {pendingUsers.length}
          </span>
        </header>

        {message && (
          <div className="dashboard_notice success_notice">
            {message}
          </div>
        )}

        {error && (
          <div className="dashboard_notice error_notice">
            {error}
          </div>
        )}

        {loading ? (
          <div className="status_message">Loading pending verification requests...</div>
        ) : pendingUsers.length === 0 ? (
          <div className="empty_state">
            No pending user verifications at this time.
          </div>
        ) : (
          <section className="approval_list" aria-label="Pending user approvals">
            {pendingUsers.map((user) => (
              <div
                key={user._id}
                className="approval_card"
              >
                <div className="approval_details">
                  <div className="approval_identity">
                    <h2 className="approval_name">{user.name}</h2>
                    <span className="approval_role">
                      {user.role}
                    </span>
                  </div>
                  <div className="approval_contact">
                    <span>ID: <strong>{user.studentId}</strong></span>
                    <span>Email: <strong>{user.email}</strong></span>
                  </div>
                  {user.role === 'driver' && (
                    <div className="approval_vehicle">
                      <span>Vehicle: <strong>{user.vehicle?.type} {user.vehicle?.model}</strong></span>
                      <span>Plate: <strong>{user.vehicle?.registrationPlate || 'Not provided'}</strong></span>
                      {user.licenseDocument && <LicenseDocumentPreview userId={user._id} />}
                    </div>
                  )}
                </div>

                <div className="approval_actions">
                  <button
                    onClick={() => handleAction(user._id, 'approve')}
                    className="approval_button approve_button"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(user._id, 'reject')}
                    className="approval_button reject_button"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
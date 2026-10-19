import { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  ShieldCheck, 
  Check, 
  X, 
  ExternalLink, 
  Car, 
  User, 
  Mail, 
  Hash, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Inbox, 
  Loader2 
} from 'lucide-react';

const LicenseDocumentPreview = ({ userId }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    let objectUrl;

    API.get(`/admin/license/${userId}`, { responseType: 'blob' })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        if (isActive) {
          setImageUrl(objectUrl);
          setLoading(false);
        } else {
          URL.revokeObjectURL(objectUrl);
        }
      })
      .catch(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="license_preview_placeholder">
        <Loader2 size={16} className="btn_spinner" />
        <span>Loading license...</span>
      </div>
    );
  }

  return imageUrl ? (
    <a 
      href={imageUrl} 
      target="_blank" 
      rel="noreferrer" 
      className="license_preview_link"
      title="Open driving license document in new tab"
    >
      <img className="license_preview" src={imageUrl} alt="Uploaded driving license document" />
      <span className="license_preview_overlay">
        <ExternalLink size={14} />
        <span>Inspect License</span>
      </span>
    </a>
  ) : (
    <div className="license_preview_unavailable">
      <FileText size={15} />
      <span>Document Unavailable</span>
    </div>
  );
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
    <main className="admin-dashboard">
      <div className="admin-dashboard__container">
        <header className="admin-dashboard__header">
          <div>
            <div className="admin-dashboard__pill">
              <ShieldCheck size={14} />
              <span>DIU Campus Administration</span>
            </div>
            <h1 className="admin-dashboard__title">Verification Queue</h1>
            <p className="admin-dashboard__subtitle">Review and verify student identity and driver credentials</p>
          </div>
          <div className="admin-dashboard__queue-chip">
            <span className="queue_chip_pulse"></span>
            <span className="queue_chip_label">Pending Review:</span>
            <strong className="queue_chip_num">{pendingUsers.length}</strong>
          </div>
        </header>

        {message && (
          <div className="admin-dashboard__notice admin-dashboard__notice--success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="admin-dashboard__notice admin-dashboard__notice--error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="admin-dashboard__status-message">
            <Loader2 size={32} className="btn_spinner" />
            <p>Loading pending verification requests...</p>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="admin-dashboard__empty-state">
            <div className="empty_state_icon_wrapper">
              <Inbox size={36} />
            </div>
            <h3>Queue Cleared</h3>
            <p>No pending user verifications at this time. All campus requests have been processed.</p>
          </div>
        ) : (
          <section className="admin-dashboard__approval-list" aria-label="Pending user approvals">
            {pendingUsers.map((user) => (
              <div
                key={user._id}
                className="approval-card"
              >
                <div className="approval-card__details">
                  <div className="approval-card__identity">
                    <div className="approval-card__avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h2 className="approval-card__name">{user.name}</h2>
                      <div className="approval_badge_row">
                        <span className={`approval-card__role approval-card__role--${user.role}`}>
                          {user.role === 'driver' ? <Car size={13} /> : <User size={13} />}
                          <span>{user.role}</span>
                        </span>
                        <span className="approval_status_pill">
                          <Clock size={12} />
                          <span>Pending Verification</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="approval-card__contact">
                    <span className="contact_chip">
                      <Hash size={14} className="chip_icon" />
                      <span>ID: <strong>{user.studentId}</strong></span>
                    </span>
                    <span className="contact_chip">
                      <Mail size={14} className="chip_icon" />
                      <span>Email: <strong>{user.email}</strong></span>
                    </span>
                  </div>

                  {user.role === 'driver' && (
                    <div className="approval_vehicle">
                      <div className="vehicle_info_card">
                        <div className="vehicle_spec_row">
                          <span className="spec_label">Vehicle:</span>
                          <strong className="spec_val">{user.vehicle?.type} {user.vehicle?.model}</strong>
                        </div>
                        <div className="vehicle_spec_row">
                          <span className="spec_label">Registration Plate:</span>
                          <strong className="plate_badge">{user.vehicle?.registrationPlate || 'Not provided'}</strong>
                        </div>
                      </div>
                      {user.licenseDocument && (
                        <div className="license_container">
                          <span className="license_label">Submitted License Document:</span>
                          <LicenseDocumentPreview userId={user._id} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="approval-card__actions">
                  <button
                    type="button"
                    onClick={() => handleAction(user._id, 'approve')}
                    className="approval-card__button approval-card__button--approve"
                  >
                    <Check size={16} />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(user._id, 'reject')}
                    className="approval-card__button approval-card__button--reject"
                  >
                    <X size={16} />
                    <span>Reject</span>
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
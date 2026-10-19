import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function VerificationBadge({ isVerified, status }) {
  const isApproved = Boolean(isVerified || status === 'approved');
  const isRejected = status === 'rejected';

  const badgeClass = isApproved
    ? "verification_badge verification_badge--verified"
    : isRejected
    ? "verification_badge verification_badge--rejected"
    : "verification_badge verification_badge--pending";

  const label = isApproved ? "Verified Member" : isRejected ? "Verification Rejected" : "Pending Verification";

  return (
    <span className={badgeClass}>
      <span className="badge_dot" aria-hidden="true"></span>
      {isApproved && <CheckCircle2 size={13} className="badge_icon" />}
      {isRejected && <XCircle size={13} className="badge_icon" />}
      {!isApproved && !isRejected && <Clock size={13} className="badge_icon" />}
      <span className="badge_label">{label}</span>
    </span>
  );
}
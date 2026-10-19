export default function VerificationBadge({ isVerified, status }) {
  const badgeClass = isVerified
    ? "verification_badge verification_badge--verified"
    : status === "rejected"
    ? "verification_badge verification_badge--rejected"
    : "verification_badge verification_badge--pending";

  const label = isVerified ? "Verified" : status === "rejected" ? "Rejected" : "Pending";

  return (
    <span className={badgeClass}>
      {label}
    </span>
  );
}
export default function VerificationBadge({ isVerified, status }) {
  const label = isVerified
    ? "✓ Verified"
    : status === "rejected"
    ? "✗ Rejected"
    : "⏳ Pending";

  const bg = isVerified ? "#d4f7dc" : status === "rejected" ? "#ffe3e3" : "#fff3cd";
  const color = isVerified ? "#1a7f37" : status === "rejected" ? "#c92a2a" : "#8a6d00";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 12,
        fontSize: 13,
        background: bg,
        color: color,
      }}
    >
      {label}
    </span>
  );
}
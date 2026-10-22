interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function Spinner({
  size = "md",
  label = "Loading",
  className = "",
}: SpinnerProps) {
  return (
    <span className={`bt-ui-spinner-wrap ${className}`.trim()} role="status">
      <span
        className={`bt-ui-spinner-icon bt-ui-spinner-icon--${size}`}
        aria-hidden="true"
      />
      <span className="bt-ui-spinner-label">{label}</span>
    </span>
  );
}

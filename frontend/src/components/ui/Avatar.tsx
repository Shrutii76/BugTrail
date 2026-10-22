import { useState } from "react";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(src) && !imageFailed;

  return (
    <span
      className={`bt-ui-avatar bt-ui-avatar--${size} ${className}`.trim()}
      role="img"
      aria-label={name || "Unknown user"}
    >
      {showImage ? (
        <img src={src!} alt="" onError={() => setImageFailed(true)} />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}

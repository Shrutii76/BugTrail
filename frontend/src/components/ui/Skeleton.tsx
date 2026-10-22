import type { CSSProperties } from "react";

type SkeletonVariant = "text" | "circular" | "rectangular";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  lines = 1,
  className = "",
}: SkeletonProps) {
  const style: CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  const count = Math.max(1, Math.floor(lines));

  return (
    <div
      className={`bt-ui-skeleton-group ${className}`.trim()}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`bt-ui-skeleton bt-ui-skeleton--${variant}`}
          style={{
            ...style,
            ...(variant === "text" && lines > 1 && index === count - 1
              ? { width: "70%" }
              : {}),
          }}
        />
      ))}
    </div>
  );
}

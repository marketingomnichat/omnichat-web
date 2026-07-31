import type { HTMLAttributes } from "react";

export function panelElevationClass(elevation: "border" | "shadow" = "border") {
  return elevation === "border"
    ? "border border-oc-divider"
    : "shadow-oc-panel";
}

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  elevation?: "border" | "shadow";
};

export function Panel({
  elevation = "border",
  className = "",
  children,
  ...props
}: PanelProps) {
  return (
    <div
      className={`bg-oc-surface rounded-[var(--radius-oc-panel)] p-6 md:p-10 ${panelElevationClass(elevation)} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

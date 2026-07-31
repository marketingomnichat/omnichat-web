import type { HTMLAttributes } from "react";

export function panelElevationClass(elevation: "border" | "shadow" = "border") {
  return elevation === "border"
    ? "border border-oc-divider"
    : "shadow-oc-panel";
}

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  elevation?: "border" | "shadow";
  surface?: "light" | "dark";
};

export function Panel({
  elevation = "border",
  surface = "light",
  className = "",
  children,
  ...props
}: PanelProps) {
  const hoverMotionClass =
    "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-oc motion-safe:hover:-translate-y-0.5";

  return (
    <div
      className={`${surface === "dark" ? "bg-oc-dark" : "bg-oc-surface"} rounded-oc-panel p-6 md:p-10 ${panelElevationClass(elevation)} ${hoverMotionClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Card usa borda OU sombra, nunca os dois (regra do DS).
   * A prop única torna a combinação impossível por construção.
   */
  elevation?: "border" | "shadow";
};

export function Card({
  elevation = "border",
  className = "",
  children,
  ...props
}: CardProps) {
  const elevationClass =
    elevation === "border"
      ? "border border-oc-divider"
      : "shadow-oc-lg";

  return (
    <div
      className={`bg-white rounded-oc-card p-6 ${elevationClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

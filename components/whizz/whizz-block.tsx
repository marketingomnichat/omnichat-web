import "./tokens.css";

type WhizzBlockProps = {
  title: string;
  children: React.ReactNode;
};

/**
 * Bloco de momento de IA (Whizz). Único lugar onde o roxo e o gradient
 * Whizz podem aparecer — mantenha qualquer nova UI de IA nesta pasta.
 */
export function WhizzBlock({ title, children }: WhizzBlockProps) {
  return (
    <div
      className="oc-whizz p-6 text-white"
      style={{
        background: "var(--oc-whizz-gradient)",
        borderRadius: "var(--oc-whizz-radius)",
      }}
    >
      <p className="oc-h5">{title}</p>
      <div className="oc-body mt-2">{children}</div>
    </div>
  );
}

import "./tokens.css";

type HeroHighlightProps = {
  children: string;
};

export function HeroHighlight({ children }: HeroHighlightProps) {
  return (
    <span className="oc-whizz">
      <span className="whizz-text-gradient">{children}</span>
    </span>
  );
}

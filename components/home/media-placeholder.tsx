/** Placeholder visual no lugar de screenshots do Figma. */
export function MediaPlaceholder({
  label = "Preview do produto",
  className = "",
  aspectClass = "aspect-[16/10]",
}: {
  label?: string;
  className?: string;
  aspectClass?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#F6F7F8] ${aspectClass} ${className}`}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,208,77,0.2),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(255,188,0,0.12),transparent_45%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#DCDEE5] bg-white">
          <i className="ri-image-line text-xl text-[#414658]" aria-hidden />
        </div>
        <p className="text-[12px] font-medium text-[#414658]">{label}</p>
      </div>
    </div>
  );
}

type Social = { platform: string; url: string };

export function Footer({ footerText, social = [] }: { footerText?: string; social?: Social[] }) {
  return (
    <footer className="mt-auto bg-oc-dark">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <p className="oc-h5 text-oc-yellow-mass">OmniChat</p>
        {footerText && <p className="oc-body-sm mt-3 max-w-[480px] text-oc-neutral">{footerText}</p>}
        <div className="mt-6 flex gap-5">
          {social.map((s) => (
            <a key={s.platform} href={s.url} className="oc-caption text-oc-neutral hover:text-oc-yellow-mass">
              {s.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

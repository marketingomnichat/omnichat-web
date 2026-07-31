import Image from "next/image";
import { Panel } from "@/components/ui/panel";

type Logo = { name: string; imageUrl: string };

export function LogoCloud({ title, logos = [] }: { title?: string; logos?: Logo[] }) {
  if (!logos.length) return null;
  return (
    <section className="bg-oc-body">
      <div className="mx-auto max-w-oc-container px-6 py-oc-section">
        <Panel elevation="border">
          {title && <p className="oc-overline mb-6 text-center text-oc-neutral-dark">{title}</p>}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map((l) => (
              <Image
                key={l.name}
                src={l.imageUrl}
                alt={l.name}
                width={160}
                height={32}
                className="h-8 w-auto"
              />
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

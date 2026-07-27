import { sectionRegistry } from "./registry";
import type { SectionData } from "@/shared/types";

export function SectionRenderer({ sections }: { sections?: SectionData[] | null }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map(({ _type, _key, ...props }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Section = sectionRegistry[_type] as any;
        if (!Section) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`Seção sem componente no registry: ${_type}`);
          }
          return null;
        }
        return <Section key={_key} {...props} />;
      })}
    </>
  );
}

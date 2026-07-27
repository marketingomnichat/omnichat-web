import { sectionRegistry } from "./registry";
import type { SectionData } from "@/shared/types";

export function SectionRenderer({ sections }: { sections?: SectionData[] | null }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map(({ _type, _key, ...props }) => {
        const Section = sectionRegistry[_type];
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

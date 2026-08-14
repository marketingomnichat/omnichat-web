import { PortableText, type PortableTextBlock } from "next-sanity";

export function RichText({
  content,
  align = "start",
}: {
  content?: PortableTextBlock[];
  align?: "start" | "center";
}) {
  if (!content?.length) return null;
  const centered = align === "center";
  return (
    <section
      className={`mx-auto max-w-oc-container px-6 py-oc-section ${centered ? "text-center" : ""}`}
    >
      <div
        className={`flex flex-col gap-4 text-oc-ink [&_a]:underline [&_h2]:oc-h2 [&_h3]:oc-h3 ${
          centered ? "oc-h2 [&_p]:oc-h2" : "oc-body"
        }`}
      >
        <PortableText value={content} />
      </div>
    </section>
  );
}

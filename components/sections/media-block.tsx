import Image from "next/image";

type Media = { imageUrl: string; alt: string };

export function MediaBlock({
  title,
  image,
  imageMobile,
}: {
  title?: string;
  image: Media;
  imageMobile?: Media;
}) {
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-8 text-center">{title}</h2>}
      <div className="relative mx-auto w-full max-w-[1126px]">
        <Image
          src={image.imageUrl}
          alt={image.alt}
          width={1126}
          height={600}
          className={`h-auto w-full ${imageMobile?.imageUrl ? "hidden lg:block" : ""}`}
        />
        {imageMobile?.imageUrl && (
          <Image
            src={imageMobile.imageUrl}
            alt={imageMobile.alt || image.alt}
            width={600}
            height={800}
            className="h-auto w-full lg:hidden"
          />
        )}
      </div>
    </section>
  );
}

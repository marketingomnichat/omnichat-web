import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { safeHref } from "@/lib/safe-href";
import { TestimonialsCarousel } from "./testimonials-carousel";

type Testimonial = {
  quote: string;
  name?: string;
  role?: string;
  company?: string;
  logoUrl?: string;
  logoAlt?: string;
  href?: string;
};

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card elevation="shadow" className="flex h-full flex-col items-center text-center">
      {testimonial.logoUrl && (
        <Image
          src={testimonial.logoUrl}
          alt={testimonial.logoAlt ?? testimonial.company ?? ""}
          width={160}
          height={48}
          className="mb-6 h-12 w-auto object-contain"
        />
      )}
      <blockquote className="oc-body-lg">&quot;{testimonial.quote}&quot;</blockquote>
      {(testimonial.name || testimonial.role || testimonial.company) && (
        <>
          {testimonial.name && <p className="oc-label mt-4">{testimonial.name}</p>}
          <p className="oc-caption text-oc-neutral-dark">
            {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
          </p>
        </>
      )}
      {testimonial.href && (
        <Link
          href={safeHref(testimonial.href)}
          className="oc-button-label mt-6 text-oc-yellow-ink underline-offset-4 hover:underline"
        >
          Saiba mais
        </Link>
      )}
    </Card>
  );
}

export function Testimonials({
  title,
  items = [],
  variant = "grid",
}: {
  title?: string;
  items?: Testimonial[];
  variant?: "grid" | "carousel";
}) {
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-8 text-center">{title}</h2>}
      {variant === "carousel" ? (
        <TestimonialsCarousel itemCount={items.length}>
          {items.map((testimonial, index) => (
            <div
              key={testimonial.name ?? testimonial.logoAlt ?? index}
              className="min-w-full shrink-0 snap-start md:min-w-[calc(50%-12px)]"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </TestimonialsCarousel>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name ?? testimonial.logoAlt ?? index}
              testimonial={testimonial}
            />
          ))}
        </div>
      )}
    </section>
  );
}

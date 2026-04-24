import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type { IItemDocument } from "@/models/Item";
import AnimatedElement from "./AnimatedElement";

interface FeaturedSectionProps {
  items: IItemDocument[];
}

const ACCENT_BG: Record<string, string> = {
  primary: "bg-ldc-coral/10 border-ldc-coral/20",
  secondary: "bg-ldc-verde/10 border-ldc-verde/20",
  accent: "bg-ldc-amarillo/10 border-ldc-amarillo/20",
};

export default function FeaturedSection({ items }: FeaturedSectionProps) {
  if (items.length === 0) return null;

  const { featured } = siteConfig.sections;

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-8">
      <AnimatedElement className="text-center mb-12">
        <Badge variant="outline" className="text-ldc-coral border-ldc-coral/30 mb-4">
          {featured.badge}
        </Badge>
        <h2
          className="text-3xl md:text-4xl font-bold text-foreground mb-3"
          style={{ fontFamily: "DynaPuff, sans-serif" }}
        >
          {featured.title}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">{featured.subtitle}</p>
      </AnimatedElement>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => {
          console.log(item);
          const accentClass = ACCENT_BG[item.accentColor ?? "primary"];
          return (
            <AnimatedElement key={item._id.toString()} delay={idx * 0.1}>
              <div
                className={`rounded-2xl border overflow-hidden ${accentClass} p-6 flex flex-col h-full`}
              >
                {item.image && (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-5">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <Badge variant="outline" className="w-fit mb-3 capitalize">
                  {item.type}
                </Badge>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "DynaPuff, sans-serif" }}
                >
                  {item.title}
                </h3>
                {item.slogan && (
                  <p className="text-sm text-muted-foreground italic mb-3">{item.slogan}</p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-5">
                  {item.pricing && (
                    <span className="font-bold text-ldc-coral text-lg">
                      ${item.pricing.basePrice.toLocaleString("es-AR")}
                    </span>
                  )}
                  <Button asChild className="bg-ldc-coral hover:bg-ldc-coral/90 text-white min-h-[44px]">
                    <Link href={`/${item.slug}`}>{item.heroSlide?.ctaText}</Link>
                  </Button>
                </div>
              </div>
            </AnimatedElement>
          );
        })}
      </div>
    </section>
  );
}

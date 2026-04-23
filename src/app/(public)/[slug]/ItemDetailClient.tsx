"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Share2, ShoppingBag, CheckCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import AnimatedElement from "@/components/common/AnimatedElement";
import type { ItemDTO } from "@/types/item";
import { cn } from "@/lib/utils";

const ACCENT_COLORS: Record<string, string> = {
  primary: "bg-ldc-coral/10",
  secondary: "bg-ldc-verde/10",
  accent: "bg-ldc-amarillo/10",
};

interface ItemDetailClientProps {
  item: ItemDTO;
}

export default function ItemDetailClient({ item }: ItemDetailClientProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  const bgClass = ACCENT_COLORS[item.accentColor ?? "secondary"];

  function handleAddToCart() {
    addItem({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.pricing?.basePrice ?? 0,
      qty,
    });
    setAdded(true);
    toast.success(`${item.title} agregado al carrito`);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: item.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado al portapapeles");
    }
  }

  // Group features by section
  const groupedFeatures: Record<string, typeof item.features> = {};
  const ungrouped: typeof item.features = [];
  for (const feat of item.features) {
    if (feat.group) {
      groupedFeatures[feat.group] = [...(groupedFeatures[feat.group] ?? []), feat];
    } else {
      ungrouped.push(feat);
    }
  }
  const groupedEntries = Object.entries(groupedFeatures);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Hero Image */}
        <div className={`relative aspect-square rounded-3xl overflow-hidden ${bgClass}`}>
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-24 h-24 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div>
            <Badge variant="outline" className="mb-3 capitalize">
              {item.type}
            </Badge>
            <h1
              className="text-3xl md:text-4xl font-bold leading-tight mb-3"
              style={{ fontFamily: "DynaPuff, sans-serif" }}
            >
              {item.title}
            </h1>
            {item.slogan && (
              <p className="text-muted-foreground italic text-lg">{item.slogan}</p>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{item.description}</p>

          {item.pricing && (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-ldc-coral">
                ${item.pricing.basePrice.toLocaleString("es-AR")}
              </span>
              <span className="text-muted-foreground text-sm">ARS</span>
            </div>
          )}

          {/* Quantity + CTA */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-background transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold text-sm">{qty}</span>
              <button
                onClick={() => setQty(Math.min(3, qty + 1))}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-background transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              className={cn(
                "flex-1 min-h-[48px] font-semibold text-white transition-colors",
                added
                  ? "bg-ldc-verde hover:bg-ldc-verde"
                  : "bg-ldc-coral hover:bg-ldc-coral/90",
              )}
            >
              {added ? (
                <><CheckCircle className="w-4 h-4 mr-2" /> Agregado</>
              ) : (
                "Lo quiero"
              )}
            </Button>

            <button
              onClick={handleShare}
              className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Compartir"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Checkout note */}
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-xl p-4 leading-relaxed">
            Estamos desarrollando nuestra sección de pagos. Completá tus datos y te contactamos
            para coordinar la entrega.
          </p>
        </div>
      </div>

      {/* Long description */}
      {item.longDescription && (
        <AnimatedElement className="mt-16">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "DynaPuff, sans-serif" }}
          >
            Más detalles
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            {item.longDescription}
          </p>
        </AnimatedElement>
      )}

      {/* Features */}
      {item.features.length > 0 && (
        <AnimatedElement className="mt-16">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: "DynaPuff, sans-serif" }}
          >
            Características
          </h2>

          {/* Grouped features */}
          {groupedEntries.length > 0 && (
            <div className={cn("grid gap-8", groupedEntries.length >= 2 && "md:grid-cols-2")}>
              {groupedEntries.map(([group, feats]) => (
                <section key={group}>
                  <h3
                    className="text-lg font-bold mb-4 text-ldc-coral"
                    style={{ fontFamily: "DynaPuff, sans-serif" }}
                  >
                    {group}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {feats.map((feat, idx) => (
                      <div key={idx} className="bg-muted/50 rounded-xl p-5 border border-border">
                        <h4 className="font-semibold mb-1 text-sm">{feat.title}</h4>
                        <p className="text-sm text-muted-foreground">{feat.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Ungrouped features (below grouped, lower priority) */}
          {ungrouped.length > 0 && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ungrouped.map((feat, idx) => (
                <div key={idx} className="bg-muted/50 rounded-xl p-5 border border-border">
                  <h3 className="font-semibold mb-1 text-sm">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.description}</p>
                </div>
              ))}
            </div>
          )}
        </AnimatedElement>
      )}

      {/* Gallery */}
      {item.gallery.length > 0 && (
        <AnimatedElement className="mt-16">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "DynaPuff, sans-serif" }}
          >
            Galería
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {item.gallery.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={url} alt={`${item.title} ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </AnimatedElement>
      )}
    </div>
  );
}

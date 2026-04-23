"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import type { ItemDTO } from "@/types/item";

interface ItemCardProps {
  item: ItemDTO;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { addItem, openCart } = useCart();
  const [hovered, setHovered] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.pricing?.basePrice ?? 0,
      qty: 1,
    });
    toast.success(`${item.title} agregado al carrito`);
    openCart();
  }

  return (
    <Link href={`/${item.slug}`}>
      <div
        className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-ldc-coral/40 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full text-foreground capitalize">
              {item.type}
            </span>
          </div>

          {/* Hover overlay */}
          {hovered && item.description && (
            <div className="absolute inset-0 bg-ldc-coral/90 flex items-center justify-center p-4 transition-opacity">
              <p className="text-white text-sm text-center leading-relaxed line-clamp-4">
                {item.description}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <h3 className="font-bold text-base leading-tight" style={{ fontFamily: "DynaPuff, sans-serif" }}>
            {item.title}
          </h3>

          {item.pricing && (
            <p className="text-ldc-coral font-bold text-lg">
              ${item.pricing.basePrice.toLocaleString("es-AR")}
            </p>
          )}

          <Button
            onClick={handleAddToCart}
            className="mt-auto bg-foreground text-background hover:bg-ldc-coral hover:text-white transition-colors min-h-[44px] font-semibold"
            size="sm"
          >
            Lo quiero
          </Button>
        </div>
      </div>
    </Link>
  );
}

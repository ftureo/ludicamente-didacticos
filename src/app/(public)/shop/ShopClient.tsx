"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemCard from "@/components/shop/ItemCard";
import AnimatedElement from "@/components/common/AnimatedElement";
import { siteConfig } from "@/config/site";
import type { ItemDTO } from "@/types/item";

interface ShopClientProps {
  kits: ItemDTO[];
  productos: ItemDTO[];
}

export default function ShopClient({ kits, productos }: ShopClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultTab = searchParams.get("type") === "kit" ? "kits" : "productos";

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", value === "kits" ? "kit" : "producto");
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20">
      <AnimatedElement className="text-center mb-10">
        <Badge variant="outline" className="text-ldc-coral border-ldc-coral/30 mb-4">
          {siteConfig.sections.shop.badge}
        </Badge>
        <h1
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ fontFamily: "DynaPuff, sans-serif" }}
        >
          {siteConfig.sections.shop.title}
        </h1>
      </AnimatedElement>

      <Tabs value={defaultTab} onValueChange={handleTabChange}>
        <TabsList className="mx-auto flex w-fit mb-10 bg-muted rounded-xl p-1">
          <TabsTrigger value="productos" className="rounded-lg px-6 data-[state=active]:bg-ldc-coral data-[state=active]:text-white">
            Productos ({productos.length})
          </TabsTrigger>
          <TabsTrigger value="kits" className="rounded-lg px-6 data-[state=active]:bg-ldc-coral data-[state=active]:text-white">
            Kits ({kits.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="productos">
          {productos.length === 0 ? (
            <EmptyState message="No hay productos disponibles aún." />
          ) : (
            <Grid items={productos} />
          )}
        </TabsContent>

        <TabsContent value="kits">
          {kits.length === 0 ? (
            <EmptyState message="No hay kits disponibles aún." />
          ) : (
            <Grid items={kits} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Grid({ items }: { items: ItemDTO[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <AnimatedElement key={item.id} delay={idx * 0.05}>
          <ItemCard item={item} />
        </AnimatedElement>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <p className="text-lg">{message}</p>
    </div>
  );
}

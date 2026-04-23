"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "./ImageUpload";
import { createItemAction, updateItemAction } from "@/actions/item.actions";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import type { ItemDTO } from "@/types/item";

interface ItemFormProps {
  item?: ItemDTO;
}

interface Feature {
  title: string;
  description: string;
  group?: string;
}

export default function ItemForm({ item }: ItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(item?.title ?? "");
  const [type, setType] = useState<"kit" | "producto">(item?.type ?? "producto");
  const [slogan, setSlogan] = useState(item?.slogan ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [longDescription, setLongDescription] = useState(item?.longDescription ?? "");
  const [image, setImage] = useState(item?.image ?? "");
  const [gallery, setGallery] = useState<string[]>(item?.gallery ?? []);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [order, setOrder] = useState(String(item?.order ?? 0));
  const [basePrice, setBasePrice] = useState(String(item?.pricing?.basePrice ?? ""));
  const [features, setFeatures] = useState<Feature[]>(item?.features ?? []);
  const [heroSlide, setHeroSlide] = useState(item?.heroSlide ?? null);
  const [showHeroSlide, setShowHeroSlide] = useState(!!item?.heroSlide);

  function addFeature() {
    setFeatures([...features, { title: "", description: "", group: "" }]);
  }

  function removeFeature(idx: number) {
    setFeatures(features.filter((_, i) => i !== idx));
  }

  function updateFeature(idx: number, field: keyof Feature, value: string) {
    setFeatures(features.map((f, i) => (i === idx ? { ...f, [field]: value } : f)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      toast.error("La imagen principal es requerida");
      return;
    }
    setLoading(true);

    const payload = {
      title,
      type,
      slogan: slogan || undefined,
      description,
      longDescription: longDescription || undefined,
      image,
      gallery,
      featured,
      isActive,
      order: parseInt(order) || 0,
      pricing: basePrice ? { basePrice: parseFloat(basePrice), currency: "ARS" } : undefined,
      features: features.filter((f) => f.title && f.description),
      heroSlide: showHeroSlide && heroSlide ? heroSlide : undefined,
    };

    const result = item
      ? await updateItemAction(item.id, payload)
      : await createItemAction(payload as Parameters<typeof createItemAction>[0]);

    setLoading(false);

    if (result.success) {
      toast.success(item ? "Producto actualizado" : "Producto creado");
      router.push("/admin/items");
      router.refresh();
    } else {
      toast.error(result.error ?? "Error al guardar");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Básico */}
      <section className="space-y-4 p-6 rounded-xl border border-border bg-card">
        <h2 className="font-semibold text-base">Información básica</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Nombre del producto"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="type">Tipo *</Label>
            <Select value={type} onValueChange={(v) => setType(v as "kit" | "producto")}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="producto">Producto</SelectItem>
                <SelectItem value="kit">Kit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slogan">Slogan</Label>
          <Input
            id="slogan"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            placeholder="Ej: Más que un juego..."
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Descripción corta *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Descripción visible en cards (máx 500 caracteres)"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="longDescription">Descripción larga</Label>
          <Textarea
            id="longDescription"
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            rows={5}
            placeholder="Descripción completa en la página de detalle"
          />
        </div>
      </section>

      {/* Imagen */}
      <section className="space-y-4 p-6 rounded-xl border border-border bg-card">
        <h2 className="font-semibold text-base">Imágenes</h2>
        <ImageUpload value={image} onChange={setImage} label="Imagen principal *" />

        <div className="space-y-2">
          <Label>Galería adicional</Label>
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <ImageUpload
              value=""
              onChange={(url) => url && setGallery([...gallery, url])}
              label="+ Agregar"
            />
          </div>
        </div>
      </section>

      {/* Precio y configuración */}
      <section className="space-y-4 p-6 rounded-xl border border-border bg-card">
        <h2 className="font-semibold text-base">Precio y configuración</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">Precio ARS</Label>
            <Input
              id="price"
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="0.00"
              min={0}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="order">Orden</Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              min={0}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Destacado en Home</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Activo</span>
          </label>
        </div>
      </section>

      {/* Hero Slide */}
      <section className="p-6 rounded-xl border border-border bg-card">
        <button
          type="button"
          className="flex items-center gap-2 font-semibold text-base w-full"
          onClick={() => setShowHeroSlide(!showHeroSlide)}
        >
          {showHeroSlide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Slide del Hero Carousel
          {showHeroSlide && (
            <Badge variant="secondary" className="ml-2">
              Habilitado
            </Badge>
          )}
        </button>

        {showHeroSlide && (
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Punchline</Label>
              <Input
                value={heroSlide?.punchline ?? ""}
                onChange={(e) =>
                  setHeroSlide({ ...(heroSlide ?? { punchline: "", ctaText: "", ctaHref: "" }), punchline: e.target.value })
                }
                placeholder="Ej: Más que un dominó: una experiencia sensorial"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Texto del CTA</Label>
                <Input
                  value={heroSlide?.ctaText ?? ""}
                  onChange={(e) =>
                    setHeroSlide({ ...(heroSlide ?? { punchline: "", ctaText: "", ctaHref: "" }), ctaText: e.target.value })
                  }
                  placeholder="Descubrilo"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Destino del CTA</Label>
                <Input
                  value={heroSlide?.ctaHref ?? ""}
                  onChange={(e) =>
                    setHeroSlide({ ...(heroSlide ?? { punchline: "", ctaText: "", ctaHref: "" }), ctaHref: e.target.value })
                  }
                  placeholder="/shop"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="p-6 rounded-xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base">Características</h2>
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        </div>

        {features.map((f, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-start">
            <Input
              placeholder="Título"
              value={f.title}
              onChange={(e) => updateFeature(idx, "title", e.target.value)}
            />
            <Input
              placeholder="Descripción"
              value={f.description}
              onChange={(e) => updateFeature(idx, "description", e.target.value)}
            />
            <Input
              placeholder="Grupo (opcional)"
              value={f.group ?? ""}
              onChange={(e) => updateFeature(idx, "group", e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFeature(idx)}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {features.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Sin características. Hacé click en &quot;Agregar&quot;.
          </p>
        )}
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="bg-ldc-coral hover:bg-ldc-coral/90 text-white">
          {loading ? "Guardando..." : item ? "Guardar cambios" : "Crear producto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

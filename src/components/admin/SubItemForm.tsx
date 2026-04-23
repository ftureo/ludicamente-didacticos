"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "./ImageUpload";
import { createSubItemAction, updateSubItemAction } from "@/actions/subitem.actions";
import { X } from "lucide-react";
import type { SubItemDTO, ItemDTO } from "@/types/item";

interface SubItemFormProps {
  subitem?: SubItemDTO;
  parentItems: ItemDTO[];
}

export default function SubItemForm({ subitem, parentItems }: SubItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(subitem?.title ?? "");
  const [parentItem, setParentItem] = useState(subitem?.parentItem?.toString() ?? "");
  const [description, setDescription] = useState(subitem?.description ?? "");
  const [image, setImage] = useState(subitem?.image ?? "");
  const [status, setStatus] = useState<"draft" | "active" | "archived">(
    subitem?.status ?? "draft",
  );
  const [tags, setTags] = useState<string[]>(subitem?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [featured, setFeatured] = useState(subitem?.featured ?? false);
  const [isActive, setIsActive] = useState(subitem?.isActive ?? true);
  const gallery = subitem?.gallery ?? [];

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) { toast.error("La imagen es requerida"); return; }
    if (!parentItem) { toast.error("Seleccioná un item padre"); return; }
    setLoading(true);

    const payload = { title, parentItem, description, image, gallery, status, tags, featured, isActive };

    const result = subitem
      ? await updateSubItemAction(subitem.id, payload)
      : await createSubItemAction(payload);

    setLoading(false);
    if (result.success) {
      toast.success(subitem ? "Variante actualizada" : "Variante creada");
      router.push("/admin/subitems");
      router.refresh();
    } else {
      toast.error(result.error ?? "Error al guardar");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4 p-6 rounded-xl border border-border bg-card">
        <h2 className="font-semibold">Información básica</h2>
        <div className="space-y-1.5">
          <Label>Título *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Item padre *</Label>
          <Select value={parentItem} onValueChange={setParentItem}>
            <SelectTrigger><SelectValue placeholder="Seleccioná el kit/producto padre" /></SelectTrigger>
            <SelectContent>
              {parentItems.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title} ({p.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Descripción *</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="archived">Archivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Destacado
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Activo
          </label>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border bg-card">
        <ImageUpload value={image} onChange={setImage} label="Imagen *" />
      </div>

      <div className="p-6 rounded-xl border border-border bg-card space-y-3">
        <h2 className="font-semibold">Tags</h2>
        <div className="flex gap-2">
          <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Ej: madera, sensorial"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
          <Button type="button" variant="outline" onClick={addTag}>Agregar</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1 bg-muted text-sm px-3 py-1 rounded-full">
              {t}
              <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="bg-ldc-coral hover:bg-ldc-coral/90 text-white">
          {loading ? "Guardando..." : subitem ? "Guardar cambios" : "Crear variante"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}

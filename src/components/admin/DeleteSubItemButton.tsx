"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteSubItemAction } from "@/actions/subitem.actions";
import { toast } from "sonner";

export default function DeleteSubItemButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("¿Eliminar esta variante?")) return;
    setLoading(true);
    const result = await deleteSubItemAction(id);
    setLoading(false);
    if (result.success) {
      toast.success("Variante eliminada");
      router.refresh();
    } else {
      toast.error(result.error ?? "Error al eliminar");
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading} className="text-destructive hover:text-destructive">
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}

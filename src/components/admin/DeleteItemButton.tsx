"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteItemAction } from "@/actions/item.actions";
import { toast } from "sonner";

export default function DeleteItemButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("¿Eliminar este producto?")) return;
    setLoading(true);
    const result = await deleteItemAction(id);
    setLoading(false);
    if (result.success) {
      toast.success("Producto eliminado");
      router.refresh();
    } else {
      toast.error(result.error ?? "Error al eliminar");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}

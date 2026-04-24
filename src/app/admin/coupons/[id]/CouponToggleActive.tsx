"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface Props {
  id: string;
  active: boolean;
  expired: boolean;
}

export default function CouponToggleActive({ id, active: initialActive, expired }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (expired) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      if (json.success) {
        setActive(!active);
        toast.success(`Cupón ${!active ? "activado" : "desactivado"}`);
        router.refresh();
      } else {
        toast.error(json.error ?? "Error al actualizar");
      }
    } catch {
      toast.error("Error al actualizar el cupón");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        onClick={handleToggle}
        disabled={loading || expired}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${active ? "bg-ldc-verde" : "bg-muted-foreground/30"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
      <Label className={expired ? "text-muted-foreground" : "cursor-pointer select-none"} onClick={!expired ? handleToggle : undefined}>
        {expired ? "Expirado (no editable)" : active ? "Activo" : "Inactivo"}
      </Label>
    </div>
  );
}

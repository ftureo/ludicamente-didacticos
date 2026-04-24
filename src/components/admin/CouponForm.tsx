"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CouponType } from "@/models/Coupon";

interface CouponFormProps {
  redirectTo?: string;
}

const COUPON_TYPE_LABELS: Record<CouponType, string> = {
  percentage: "Porcentaje (%)",
  fixed: "Monto fijo ($)",
  free_shipping: "Envío gratis",
};

function sanitizeCouponCode(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export default function CouponForm({ redirectTo = "/admin/coupons" }: CouponFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [type, setType] = useState<CouponType>("percentage");
  const [value, setValue] = useState("");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [maxUsesPerUser, setMaxUsesPerUser] = useState("1");
  const [expiresAt, setExpiresAt] = useState("");
  const [active, setActive] = useState(true);

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(sanitizeCouponCode(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!code || code.length < 3) {
      toast.error("El código debe tener al menos 3 caracteres");
      return;
    }
    if (!expiresAt) {
      toast.error("La fecha de expiración es requerida");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      toast.error("El valor debe ser un número válido");
      return;
    }
    if (type === "percentage" && numValue > 100) {
      toast.error("El porcentaje no puede ser mayor a 100");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          type,
          value: numValue,
          minPurchaseAmount: minPurchaseAmount ? parseFloat(minPurchaseAmount) : undefined,
          maxUses: maxUses ? parseInt(maxUses, 10) : undefined,
          maxUsesPerUser: parseInt(maxUsesPerUser, 10) || 1,
          expiresAt: new Date(expiresAt).toISOString(),
          active,
        }),
      });

      const json = await res.json() as { success: boolean; error?: string };

      if (json.success) {
        toast.success("Cupón creado exitosamente");
        router.push(redirectTo);
        router.refresh();
      } else {
        toast.error(json.error ?? "Error al crear el cupón");
      }
    } catch {
      toast.error("Error al crear el cupón");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
        <h2 className="font-semibold text-base">Datos del cupón</h2>

        <div className="space-y-1.5">
          <Label htmlFor="code">
            Código <span className="text-destructive">*</span>
          </Label>
          <Input
            id="code"
            value={code}
            onChange={handleCodeChange}
            placeholder="VERANO20"
            maxLength={20}
            required
            className="font-mono uppercase"
          />
          <p className="text-xs text-muted-foreground">
            Solo letras y números. Los caracteres especiales se eliminan automáticamente.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>
              Tipo <span className="text-destructive">*</span>
            </Label>
            <Select value={type} onValueChange={(v) => setType(v as CouponType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(COUPON_TYPE_LABELS) as CouponType[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {COUPON_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="value">
              {type === "percentage" ? "Descuento (%)" : type === "fixed" ? "Monto ($)" : "Valor"}
              {type !== "free_shipping" && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id="value"
              type="number"
              min={0}
              max={type === "percentage" ? 100 : undefined}
              step={type === "percentage" ? 1 : 0.01}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === "percentage" ? "20" : "500"}
              required={type !== "free_shipping"}
              disabled={type === "free_shipping"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="minPurchaseAmount">Monto mínimo ($)</Label>
            <Input
              id="minPurchaseAmount"
              type="number"
              min={0}
              step={0.01}
              value={minPurchaseAmount}
              onChange={(e) => setMinPurchaseAmount(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="maxUses">Usos totales máximos</Label>
            <Input
              id="maxUses"
              type="number"
              min={1}
              step={1}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="Sin límite"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="maxUsesPerUser">Usos por usuario</Label>
            <Input
              id="maxUsesPerUser"
              type="number"
              min={1}
              step={1}
              value={maxUsesPerUser}
              onChange={(e) => setMaxUsesPerUser(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expiresAt">
              Expira el <span className="text-destructive">*</span>
            </Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={active}
            onClick={() => setActive(!active)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none ${active ? "bg-ldc-verde" : "bg-muted-foreground/30"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
          <Label className="cursor-pointer select-none" onClick={() => setActive(!active)}>
            {active ? "Activo" : "Inactivo"}
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="bg-ldc-coral hover:bg-ldc-coral/90 text-white"
        >
          {loading ? "Creando..." : "Crear cupón"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(redirectTo)}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

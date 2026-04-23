"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { createOrderAction } from "@/actions/order.actions";
import { toast } from "sonner";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Copy, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

interface FormState {
  nombre: string;
  apellido: string;
  email: string;
  whatsapp: string;
  comentario: string;
  comprobanteUrl: string;
}

export default function CheckoutClient() {
  const { items, total, count, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    nombre: "",
    apellido: "",
    email: "",
    whatsapp: "",
    comentario: "",
    comprobanteUrl: "",
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function copyToClipboard(value: string, field: string) {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  async function handleComprobanteUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json() as { url?: string; error?: string };
      if (json.url) {
        setForm((prev) => ({ ...prev, comprobanteUrl: json.url as string }));
        toast.success("Comprobante subido");
      } else {
        toast.error("Error al subir el comprobante");
      }
    } catch {
      toast.error("Error al subir el comprobante");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    setLoading(true);

    const result = await createOrderAction({
      ...form,
      comentario: form.comentario || undefined,
      comprobanteUrl: form.comprobanteUrl || undefined,
      items: items.map((i) => ({
        itemId: i.id,
        title: i.title,
        image: i.image,
        qty: i.qty,
        price: i.price,
      })),
      total,
    });

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
      clearCart();
      router.push("/checkout/success");
    } else {
      toast.error(result.error ?? "Error al procesar el pedido");
    }
  }

  if (count === 0 && !submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30" />
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "DynaPuff, sans-serif" }}
        >
          Tu carrito está vacío
        </h1>
        <p className="text-muted-foreground">Agregá algún producto antes de continuar.</p>
        <Button asChild className="bg-ldc-coral hover:bg-ldc-coral/90 text-white">
          <Link href="/shop">Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20">
      <Link
        href="/shop"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Seguir comprando
      </Link>

      <h1
        className="text-3xl md:text-4xl font-bold mb-10"
        style={{ fontFamily: "DynaPuff, sans-serif" }}
      >
        Completá tu pedido
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
            <h2 className="font-semibold text-base">Tus datos</h2>
            <p className="text-sm text-muted-foreground">
              Estamos desarrollando nuestra sección de pagos. Completá tus datos y te
              contactamos para coordinar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="María"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  placeholder="González"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="maria@ejemplo.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                value={form.whatsapp}
                onChange={handleChange}
                required
                placeholder="+54 9 11 0000-0000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comentario">Comentario (opcional)</Label>
              <Textarea
                id="comentario"
                name="comentario"
                value={form.comentario}
                onChange={handleChange}
                rows={3}
                placeholder="¿Alguna consulta o indicación especial?"
              />
            </div>
          </div>

          {/* Transferencia bancaria */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
            <div>
              <h2 className="font-semibold text-base">Pago por transferencia</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Opcional — si ya realizaste el pago, podés adjuntar el comprobante.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "CBU", value: siteConfig.payment.transferencia.cbu, key: "cbu" },
                { label: "Alias", value: siteConfig.payment.transferencia.alias, key: "alias" },
                { label: "Titular", value: siteConfig.payment.transferencia.titular, key: "titular" },
                { label: "Banco", value: siteConfig.payment.transferencia.banco, key: "banco" },
              ].map(({ label, value, key }) => (
                <div key={key} className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(value, key)}
                    className="text-muted-foreground hover:text-ldc-coral transition-colors p-1"
                    aria-label={`Copiar ${label}`}
                  >
                    {copiedField === key ? (
                      <CheckCircle2 className="w-4 h-4 text-ldc-verde" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Comprobante de pago (opcional)</Label>
              {form.comprobanteUrl ? (
                <div className="flex items-center gap-3 p-3 bg-ldc-verde/10 rounded-xl border border-ldc-verde/30">
                  <CheckCircle2 className="w-5 h-5 text-ldc-verde shrink-0" />
                  <p className="text-sm text-muted-foreground truncate flex-1">Comprobante adjunto</p>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, comprobanteUrl: "" }))}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-ldc-coral/50 hover:bg-ldc-coral/5 transition-colors">
                  <span className="text-sm text-muted-foreground">
                    Subir foto o PDF del comprobante
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="sr-only"
                    onChange={handleComprobanteUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full min-h-[52px] text-base font-semibold bg-ldc-coral hover:bg-ldc-coral/90 text-white"
          >
            {loading ? "Enviando pedido..." : "Enviar pedido"}
          </Button>
        </form>

        {/* Order summary */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-5 lg:sticky lg:top-24">
          <h2 className="font-semibold text-base">Resumen del pedido</h2>

          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                {item.image && (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Cant: {item.qty}</p>
                </div>
                <p className="font-semibold text-sm shrink-0">
                  ${(item.price * item.qty).toLocaleString("es-AR")}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span className="text-ldc-coral">${total.toLocaleString("es-AR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/mongodb";
import { couponRepository } from "@/lib/repositories/coupon.repository";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CouponType } from "@/models/Coupon";
import CouponToggleActive from "./CouponToggleActive";

const TYPE_LABELS: Record<CouponType, string> = {
  percentage: "Porcentaje",
  fixed: "Monto fijo",
  free_shipping: "Envío gratis",
};

export default async function CouponDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const coupon = await couponRepository.findById(id);
  if (!coupon) notFound();

  const redemptions = await couponRepository.findRedemptionsByCode(coupon.code);
  const expired = new Date(coupon.expiresAt) < new Date();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/coupons"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a cupones
        </Link>
        <div className="flex items-center gap-4 flex-wrap">
          <h1
            className="text-2xl font-bold font-mono"
            style={{ fontFamily: "monospace" }}
          >
            {coupon.code}
          </h1>
          {expired ? (
            <Badge variant="outline" className="text-muted-foreground">Expirado</Badge>
          ) : coupon.active ? (
            <Badge className="bg-ldc-verde/20 text-ldc-verde border-ldc-verde/30">Activo</Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">Inactivo</Badge>
          )}
        </div>
      </div>

      {/* Coupon details */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <h2 className="font-semibold text-base">Detalles del cupón</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <dt className="text-xs text-muted-foreground mb-1">Tipo</dt>
            <dd className="text-sm font-medium">{TYPE_LABELS[coupon.type]}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground mb-1">Valor</dt>
            <dd className="text-sm font-medium">
              {coupon.type === "percentage"
                ? `${coupon.value}%`
                : coupon.type === "fixed"
                  ? `$${coupon.value.toLocaleString("es-AR")}`
                  : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground mb-1">Monto mínimo</dt>
            <dd className="text-sm font-medium">
              {coupon.minPurchaseAmount
                ? `$${coupon.minPurchaseAmount.toLocaleString("es-AR")}`
                : "Sin mínimo"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground mb-1">Usos totales máx.</dt>
            <dd className="text-sm font-medium">
              {coupon.maxUses ?? "Sin límite"} ({redemptions.length} usados)
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground mb-1">Usos por usuario</dt>
            <dd className="text-sm font-medium">{coupon.maxUsesPerUser}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground mb-1">Expira el</dt>
            <dd className="text-sm font-medium">
              {new Date(coupon.expiresAt).toLocaleString("es-AR")}
            </dd>
          </div>
        </dl>

        <div className="pt-2 border-t border-border">
          <CouponToggleActive
            id={coupon._id.toString()}
            active={coupon.active}
            expired={expired}
          />
        </div>
      </div>

      {/* Redemptions */}
      <div>
        <h2 className="font-semibold text-base mb-4">
          Usos ({redemptions.length})
        </h2>
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario (email)</TableHead>
                <TableHead>Pedido</TableHead>
                <TableHead>Fecha de uso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redemptions.map((r) => (
                <TableRow key={r._id.toString()} className="hover:bg-muted/50">
                  <TableCell className="text-sm">{r.userId}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {r.orderId ? (
                      <Link
                        href={`/admin/orders/${r.orderId}`}
                        className="hover:text-ldc-coral underline"
                      >
                        {r.orderId.slice(-8)}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(r.usedAt).toLocaleString("es-AR")}
                  </TableCell>
                </TableRow>
              ))}
              {redemptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                    Todavía no se usó este cupón.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

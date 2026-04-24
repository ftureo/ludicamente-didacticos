export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/mongodb";
import { couponRepository } from "@/lib/repositories/coupon.repository";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import type { CouponType } from "@/models/Coupon";

const TYPE_LABELS: Record<CouponType, string> = {
  percentage: "Porcentaje",
  fixed: "Monto fijo",
  free_shipping: "Envío gratis",
};

export default async function AdminCouponsPage() {
  await connectDB();
  const coupons = await couponRepository.findAllWithUsage();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "DynaPuff, sans-serif" }}>
          Cupones
        </h1>
        <Button asChild className="bg-ldc-coral hover:bg-ldc-coral/90 text-white">
          <Link href="/admin/coupons/new">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo cupón
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Expira</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => {
              const expired = new Date(coupon.expiresAt) < new Date();
              return (
                <TableRow key={coupon._id.toString()} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-semibold">{coupon.code}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {TYPE_LABELS[coupon.type]}
                  </TableCell>
                  <TableCell className="text-sm">
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : coupon.type === "fixed"
                        ? `$${coupon.value.toLocaleString("es-AR")}`
                        : "—"}
                  </TableCell>
                  <TableCell>
                    {expired ? (
                      <Badge variant="outline" className="text-muted-foreground">
                        Expirado
                      </Badge>
                    ) : coupon.active ? (
                      <Badge className="bg-ldc-verde/20 text-ldc-verde border-ldc-verde/30">
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(coupon.expiresAt).toLocaleDateString("es-AR")}
                  </TableCell>
                  <TableCell className="text-sm">{coupon.usageCount}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/coupons/${coupon._id.toString()}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {coupons.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay cupones aún. Creá el primero.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

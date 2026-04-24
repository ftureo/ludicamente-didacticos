export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db/mongodb";
import { orderRepository } from "@/lib/repositories/order.repository";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/admin/OrderStatusSelector";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { OrderStatus } from "@/models/Order";
import { getOrderMonetaryBreakdown } from "@/lib/order-totals";

export default async function AdminOrdersPage() {
  await connectDB();
  const orders = await orderRepository.findRecent(100);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "DynaPuff, sans-serif" }}>
        Pedidos
      </h1>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Importe</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const { subtotal, discount, finalTotal } = getOrderMonetaryBreakdown(order);
              const hasCoupon = Boolean(order.couponCode);
              return (
              <TableRow key={order._id.toString()} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {order.nombre} {order.apellido}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{order.email}</TableCell>
                <TableCell className="text-sm">{order.whatsapp}</TableCell>
                <TableCell className="text-sm">{order.items.length}</TableCell>
                <TableCell>
                  <div className="font-semibold">${finalTotal.toLocaleString("es-AR")}</div>
                  {(discount > 0 || hasCoupon) && (
                    <div className="text-xs text-muted-foreground mt-0.5 space-y-0.5">
                      {discount > 0 && (
                        <div>
                          Subt. ${subtotal.toLocaleString("es-AR")} · Desc. -$
                          {discount.toLocaleString("es-AR")}
                        </div>
                      )}
                      {hasCoupon && (
                        <div className="font-mono">{order.couponCode}</div>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status as OrderStatus} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/orders/${order._id.toString()}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
              );
            })}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No hay pedidos aún.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

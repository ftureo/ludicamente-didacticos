export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongodb";
import { orderRepository } from "@/lib/repositories/order.repository";
import OrderStatusSelector from "@/components/admin/OrderStatusSelector";
import Image from "next/image";
import type { OrderStatus } from "@/models/Order";
import { getOrderMonetaryBreakdown } from "@/lib/order-totals";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const order = await orderRepository.findById(id);
  if (!order) notFound();

  const { subtotal, discount, finalTotal } = getOrderMonetaryBreakdown(order);

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/orders"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver a pedidos
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "DynaPuff, sans-serif" }}>
          Pedido de {order.nombre} {order.apellido}
        </h1>
        <OrderStatusSelector orderId={id} currentStatus={order.status as OrderStatus} />
      </div>

      <div className="space-y-5">
        <section className="p-5 rounded-xl border border-border bg-card space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Datos del cliente
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Nombre:</span>{" "}
              <span className="font-medium">{order.nombre} {order.apellido}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>{" "}
              <span className="font-medium">{order.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">WhatsApp:</span>{" "}
              <a
                href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ldc-verde hover:underline"
              >
                {order.whatsapp}
              </a>
            </div>
            <div>
              <span className="text-muted-foreground">Fecha:</span>{" "}
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          {order.comentario && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Comentario:</p>
              <p className="text-sm">{order.comentario}</p>
            </div>
          )}
        </section>

        <section className="p-5 rounded-xl border border-border bg-card space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Productos pedidos
          </h2>
          <div className="divide-y divide-border">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-3">
                {item.image && (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Cant: {item.qty}</p>
                </div>
                <p className="font-semibold text-sm">
                  ${(item.price * item.qty).toLocaleString("es-AR")}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-3 border-t border-border text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal (productos)</span>
              <span>${subtotal.toLocaleString("es-AR")}</span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Cupón <span className="font-mono">{order.couponCode}</span>
                </span>
                <span className={discount > 0 ? "text-ldc-verde font-medium" : ""}>
                  {discount > 0
                    ? `-$${discount.toLocaleString("es-AR")}`
                    : "Beneficio sin descuento en monto (ej. envío)"}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Total a pagar</span>
              <span className="text-ldc-coral">${finalTotal.toLocaleString("es-AR")}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

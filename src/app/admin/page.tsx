export const dynamic = "force-dynamic";
import { itemRepository } from "@/lib/repositories/item.repository";
import { orderRepository } from "@/lib/repositories/order.repository";
import { Package, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { connectDB } from "@/lib/db/mongodb";

export default async function AdminDashboardPage() {
  await connectDB();
  const [totalItems, orderCounts] = await Promise.all([
    itemRepository.count(),
    orderRepository.countByStatus(),
  ]);

  const stats = [
    {
      label: "Total Productos / Kits",
      value: totalItems,
      icon: Package,
      color: "text-ldc-coral",
      href: "/admin/items",
    },
    {
      label: "Pedidos nuevos",
      value: orderCounts["nuevo"],
      icon: ShoppingBag,
      color: "text-ldc-amarillo",
      href: "/admin/orders",
    },
    {
      label: "En proceso",
      value: orderCounts["en-proceso"],
      icon: TrendingUp,
      color: "text-ldc-verde",
      href: "/admin/orders",
    },
    {
      label: "Entregados",
      value: orderCounts["entregado"],
      icon: Star,
      color: "text-ldc-azul",
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "DynaPuff, sans-serif" }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className={`w-5 h-5 ${color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/items/new"
          className="flex items-center gap-3 p-5 rounded-xl border-2 border-dashed border-border hover:border-ldc-coral hover:bg-ldc-coral/5 transition-colors group"
        >
          <Package className="w-6 h-6 text-muted-foreground group-hover:text-ldc-coral" />
          <div>
            <p className="font-semibold text-sm">Nuevo producto / kit</p>
            <p className="text-xs text-muted-foreground">Agregar al catálogo</p>
          </div>
        </Link>
        <Link
          href="/admin/subitems/new"
          className="flex items-center gap-3 p-5 rounded-xl border-2 border-dashed border-border hover:border-ldc-azul hover:bg-ldc-azul/5 transition-colors group"
        >
          <Package className="w-6 h-6 text-muted-foreground group-hover:text-ldc-azul" />
          <div>
            <p className="font-semibold text-sm">Nueva variante</p>
            <p className="text-xs text-muted-foreground">Subitem vinculado</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 p-5 rounded-xl border-2 border-dashed border-border hover:border-ldc-amarillo hover:bg-ldc-amarillo/5 transition-colors group"
        >
          <ShoppingBag className="w-6 h-6 text-muted-foreground group-hover:text-ldc-amarillo" />
          <div>
            <p className="font-semibold text-sm">Ver pedidos</p>
            <p className="text-xs text-muted-foreground">Gestionar bandeja</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

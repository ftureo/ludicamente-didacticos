export const dynamic = "force-dynamic";
import Link from "next/link";
import { itemRepository } from "@/lib/repositories/item.repository";
import { connectDB } from "@/lib/db/mongodb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import Image from "next/image";
import DeleteItemButton from "@/components/admin/DeleteItemButton";

export default async function AdminItemsPage() {
  await connectDB();
  const items = await itemRepository.findAll({}, { sort: { order: 1 } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "DynaPuff, sans-serif" }}>
          Productos / Kits
        </h1>
        <Button asChild className="bg-ldc-coral hover:bg-ldc-coral/90 text-white">
          <Link href="/admin/items/new">
            <Plus className="w-4 h-4 mr-1" />
            Nuevo
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Img</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id.toString()}>
                <TableCell>
                  {item.image && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <Badge variant={item.type === "kit" ? "default" : "secondary"}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.pricing ? `$${item.pricing.basePrice.toLocaleString("es-AR")}` : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? "default" : "destructive"}>
                    {item.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.featured && (
                    <Badge variant="outline" className="text-ldc-amarillo border-ldc-amarillo/30">
                      ★ Destacado
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/items/${item._id.toString()}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteItemButton id={item._id.toString()} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay productos. Creá el primero.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

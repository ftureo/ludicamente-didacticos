export const dynamic = "force-dynamic";
import Link from "next/link";
import { subItemRepository } from "@/lib/repositories/subitem.repository";
import { itemRepository } from "@/lib/repositories/item.repository";
import { connectDB } from "@/lib/db/mongodb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import Image from "next/image";
import DeleteSubItemButton from "@/components/admin/DeleteSubItemButton";

export default async function AdminSubItemsPage() {
  await connectDB();
  const [subitems, items] = await Promise.all([
    subItemRepository.findAll({}, { sort: { createdAt: -1 } }),
    itemRepository.findAll(),
  ]);

  const itemMap = new Map(items.map((i) => [i._id.toString(), i.title]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "DynaPuff, sans-serif" }}>
          Variantes
        </h1>
        <Button asChild className="bg-ldc-coral hover:bg-ldc-coral/90 text-white">
          <Link href="/admin/subitems/new">
            <Plus className="w-4 h-4 mr-1" />
            Nueva variante
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Img</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Padre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subitems.map((s) => (
              <TableRow key={s._id.toString()}>
                <TableCell>
                  {s.image && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                      <Image src={s.image} alt={s.title} fill className="object-cover" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {itemMap.get(s.parentItem?.toString()) ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={s.status === "active" ? "default" : s.status === "archived" ? "destructive" : "secondary"}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/subitems/${s._id.toString()}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteSubItemButton id={s._id.toString()} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {subitems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay variantes. Creá la primera.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

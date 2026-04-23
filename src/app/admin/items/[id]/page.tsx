export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { itemRepository } from "@/lib/repositories/item.repository";
import { connectDB } from "@/lib/db/mongodb";
import { toItemDTO } from "@/lib/mappers/item.mapper";
import ItemForm from "@/components/admin/ItemForm";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const item = await itemRepository.findById(id);
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "DynaPuff, sans-serif" }}>
        Editar Producto
      </h1>
      <ItemForm item={toItemDTO(item)} />
    </div>
  );
}

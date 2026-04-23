export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongodb";
import { subItemRepository } from "@/lib/repositories/subitem.repository";
import { itemRepository } from "@/lib/repositories/item.repository";
import { toItemDTO, toSubItemDTO } from "@/lib/mappers/item.mapper";
import SubItemForm from "@/components/admin/SubItemForm";

export default async function EditSubItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const [subitem, items] = await Promise.all([
    subItemRepository.findById(id),
    itemRepository.findAll({ isActive: true }, { sort: { title: 1 } }),
  ]);
  if (!subitem) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "DynaPuff, sans-serif" }}>
        Editar Variante
      </h1>
      <SubItemForm subitem={toSubItemDTO(subitem)} parentItems={items.map(toItemDTO)} />
    </div>
  );
}

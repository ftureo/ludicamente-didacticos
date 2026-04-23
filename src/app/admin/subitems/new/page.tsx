export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db/mongodb";
import { itemRepository } from "@/lib/repositories/item.repository";
import { toItemDTO } from "@/lib/mappers/item.mapper";
import SubItemForm from "@/components/admin/SubItemForm";

export default async function NewSubItemPage() {
  await connectDB();
  const items = await itemRepository.findAll({ isActive: true }, { sort: { title: 1 } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "DynaPuff, sans-serif" }}>
        Nueva Variante
      </h1>
      <SubItemForm parentItems={items.map(toItemDTO)} />
    </div>
  );
}

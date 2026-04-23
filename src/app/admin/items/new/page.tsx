export const dynamic = "force-dynamic";
import ItemForm from "@/components/admin/ItemForm";

export default function NewItemPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "DynaPuff, sans-serif" }}>
        Nuevo Producto / Kit
      </h1>
      <ItemForm />
    </div>
  );
}

import { NextRequest } from "next/server";
import { itemRepository } from "@/lib/repositories/item.repository";
import { updateItemSchema } from "@/lib/validators/item.schema";
import { apiError, apiOk } from "@/types/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await itemRepository.findById(id);
    if (!item) return apiError("Item no encontrado", 404);
    return apiOk(item);
  } catch {
    return apiError("Error al obtener item", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateItemSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    const item = await itemRepository.updateById(id, parsed.data);
    if (!item) return apiError("Item no encontrado", 404);
    return apiOk(item, "Item actualizado");
  } catch {
    return apiError("Error al actualizar item", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await itemRepository.deleteById(id);
    if (!deleted) return apiError("Item no encontrado", 404);
    return apiOk(null, "Item eliminado");
  } catch {
    return apiError("Error al eliminar item", 500);
  }
}

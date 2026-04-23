import { NextRequest } from "next/server";
import { subItemRepository } from "@/lib/repositories/subitem.repository";
import { updateSubItemSchema } from "@/lib/validators/subitem.schema";
import { apiError, apiOk } from "@/types/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await subItemRepository.findById(id);
    if (!item) return apiError("SubItem no encontrado", 404);
    return apiOk(item);
  } catch {
    return apiError("Error al obtener subitem", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSubItemSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    const item = await subItemRepository.updateById(id, parsed.data);
    if (!item) return apiError("SubItem no encontrado", 404);
    return apiOk(item, "SubItem actualizado");
  } catch {
    return apiError("Error al actualizar subitem", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await subItemRepository.deleteById(id);
    if (!deleted) return apiError("SubItem no encontrado", 404);
    return apiOk(null, "SubItem eliminado");
  } catch {
    return apiError("Error al eliminar subitem", 500);
  }
}

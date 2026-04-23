import { NextRequest } from "next/server";
import { subItemRepository } from "@/lib/repositories/subitem.repository";
import { createSubItemSchema, subItemQuerySchema } from "@/lib/validators/subitem.schema";
import { apiError, apiOk } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = subItemQuerySchema.safeParse(searchParams);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    const items = await subItemRepository.findWithFilters(parsed.data);
    return apiOk(items);
  } catch {
    return apiError("Error al obtener subitems", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSubItemSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 400);
    const item = await subItemRepository.create(parsed.data);
    return apiOk(item, "SubItem creado");
  } catch {
    return apiError("Error al crear subitem", 500);
  }
}

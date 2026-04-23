import { NextRequest } from "next/server";
import { itemRepository } from "@/lib/repositories/item.repository";
import { createItemSchema, itemQuerySchema } from "@/lib/validators/item.schema";
import { apiError, apiOk } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = itemQuerySchema.safeParse(searchParams);
    if (!parsed.success) {
      return apiError(parsed.error.message, 400);
    }
    const items = await itemRepository.findWithFilters(parsed.data);
    return apiOk(items);
  } catch {
    return apiError("Error al obtener items", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createItemSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.message, 400);
    }
    const item = await itemRepository.create(parsed.data);
    return apiOk(item, "Item creado");
  } catch {
    return apiError("Error al crear item", 500);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { itemRepository } from "@/lib/repositories/item.repository";
import { createItemSchema, updateItemSchema } from "@/lib/validators/item.schema";
import type { CreateItemInput, UpdateItemInput } from "@/lib/validators/item.schema";

export async function createItemAction(data: CreateItemInput) {
  const parsed = createItemSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }
  try {
    await itemRepository.create(parsed.data);
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/items");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateItemAction(id: string, data: UpdateItemInput) {
  const parsed = updateItemSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }
  try {
    const item = await itemRepository.updateById(id, parsed.data);
    if (!item) return { success: false, error: "Item no encontrado" };
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/${item.slug}`);
    revalidatePath("/admin/items");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteItemAction(id: string) {
  try {
    const deleted = await itemRepository.deleteById(id);
    if (!deleted) return { success: false, error: "Item no encontrado" };
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/items");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getItemsAction(filters?: { type?: "kit" | "producto"; featured?: boolean }) {
  try {
    const items = await itemRepository.findWithFilters({
      isActive: true,
      ...filters,
    });
    return { success: true, data: items.map((i) => i._id.toString()) };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getAllItemsAdminAction() {
  try {
    const items = await itemRepository.findAll({}, { sort: { order: 1 } });
    return { success: true, data: items.map((i) => i._id.toString()) };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

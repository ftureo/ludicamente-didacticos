"use server";

import { revalidatePath } from "next/cache";
import { subItemRepository } from "@/lib/repositories/subitem.repository";
import { createSubItemSchema, updateSubItemSchema } from "@/lib/validators/subitem.schema";
import type { CreateSubItemInput, UpdateSubItemInput } from "@/lib/validators/subitem.schema";

export async function createSubItemAction(data: CreateSubItemInput) {
  const parsed = createSubItemSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.message };
  try {
    const item = await subItemRepository.create(parsed.data);
    revalidatePath("/admin/subitems");
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateSubItemAction(id: string, data: UpdateSubItemInput) {
  const parsed = updateSubItemSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.message };
  try {
    const item = await subItemRepository.updateById(id, parsed.data);
    if (!item) return { success: false, error: "SubItem no encontrado" };
    revalidatePath("/admin/subitems");
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteSubItemAction(id: string) {
  try {
    const deleted = await subItemRepository.deleteById(id);
    if (!deleted) return { success: false, error: "SubItem no encontrado" };
    revalidatePath("/admin/subitems");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getAllSubItemsAdminAction() {
  try {
    const items = await subItemRepository.findAll({}, { sort: { createdAt: -1 } });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

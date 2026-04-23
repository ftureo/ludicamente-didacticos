import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/adapters/cloudinary.adapter";
import { apiError, apiOk } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No se proporcionó archivo", 400);
    }

    if (!file.type.startsWith("image/")) {
      return apiError("Solo se permiten imágenes", 400);
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return apiError("El archivo es demasiado grande (máx 10MB)", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer);

    return apiOk(result);
  } catch (error) {
    console.error("Upload error:", error);
    return apiError("Error al subir la imagen", 500);
  }
}

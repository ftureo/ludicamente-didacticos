import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { connectDB } from "@/lib/db/mongodb";
import AdminUser from "@/models/AdminUser";
import { apiError, apiOk } from "@/types/api";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return apiError("Email y contraseña son requeridos", 400);
    }

    await connectDB();
    const user = await AdminUser.findOne({ email: email.toLowerCase() });

    if (!user) {
      return apiError("Credenciales inválidas", 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return apiError("Credenciales inválidas", 401);
    }

    const token = await new SignJWT({ sub: user._id.toString(), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("ldc-admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return apiOk({ name: user.name, email: user.email }, "Login exitoso");
  } catch {
    return apiError("Error interno del servidor", 500);
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("ldc-admin-token");
  return apiOk(null, "Sesión cerrada");
}

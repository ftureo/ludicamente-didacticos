import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative">
          <p
            className="text-8xl font-black text-ldc-coral/20 select-none"
            style={{ fontFamily: "DynaPuff, sans-serif" }}
          >
            404
          </p>
          <p
            className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-foreground"
            style={{ fontFamily: "DynaPuff, sans-serif" }}
          >
            ¡Ups!
          </p>
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "DynaPuff, sans-serif" }}
        >
          Esta página no existe
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Parece que te perdiste en el juego. No te preocupes, volvamos al catálogo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-ldc-coral hover:bg-ldc-coral/90 text-white min-h-[48px]">
            <Link href="/shop">Ver catálogo</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-[48px]">
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

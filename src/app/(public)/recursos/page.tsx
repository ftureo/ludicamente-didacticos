import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Recursos Didácticos — Lúdicamente Didácticos",
  description:
    "Recursos didácticos gratuitos para docentes, terapeutas y familias. Próximamente.",
};

const WHATSAPP_URL = `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("¡Hola! Me interesa saber cuándo estarán disponibles los recursos didácticos 🎨")}`;

export default function RecursosPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero — imagen con overlay coral */}
      <div className="relative md:h-[40vh] h-[30vh] overflow-hidden bg-ldc-coral">
        {/* Overlay gradiente de marca */}
        <div className="absolute inset-0 bg-gradient-to-br from-ldc-coral via-ldc-coral/90 to-ldc-amarillo/60 " />

        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-white" />
          <div className="absolute bottom-20 left-1/3 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-10 right-10 w-52 h-52 rounded-full bg-white" />
        </div>

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white text-center px-6">
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md"
            style={{ fontFamily: "DynaPuff, sans-serif" }}
          >
            Recursos
            <br />
            Didácticos
          </h1>
        </div>
      </div>

      {/* Contenido inferior */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 gap-6 bg-background">
        <Badge
          variant="outline"
          className="text-ldc-coral border-ldc-coral/40 text-sm px-4 py-1"
        >
          Próximamente
        </Badge>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
          Estamos preparando una biblioteca de recursos didácticos gratuitos
          para docentes, terapeutas y familias. Fichas, guías y materiales
          descargables con enfoque psicopedagógico.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button asChild size="lg" className="bg-ldc-coral hover:bg-ldc-coral/90 text-white">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Avisame cuando esté listo
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/shop">Explorar la tienda</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

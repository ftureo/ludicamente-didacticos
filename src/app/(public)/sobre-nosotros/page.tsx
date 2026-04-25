import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import InfoCards from "@/components/common/InfoCards";
import AnimatedElement from "@/components/common/AnimatedElement";
import CallToAction from "@/components/common/CallToAction";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sobre Nosotros — Lúdicamente Didácticos",
  description:
    "Conocé la historia detrás de Lúdicamente Didácticos y nuestra misión de hacer del juego un puente hacia el aprendizaje.",
};

const OWNER_PHOTO =
  "https://res.cloudinary.com/mern-project-fabi/image/upload/v1776955237/assets-ludicamente/vicky-zoppi_ggewzj.jpg";

export default function SobreNosotrosPage() {
  const { owner } = siteConfig;

  return (
    <main>
      {/* Hero split — texto izquierda / foto derecha */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Col izquierda — texto */}
          <AnimatedElement className="flex flex-col gap-6 order-2 md:order-1">
            <Badge
              variant="outline"
              className="text-ldc-coral border-ldc-coral/40 w-fit"
            >
              Sobre nosotros
            </Badge>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground"
              style={{ fontFamily: "DynaPuff, sans-serif" }}
            >
              El juego como
              <br />
              <span className="text-ldc-coral">puente al aprendizaje</span>
            </h1>

            <p className="text-sm font-semibold text-ldc-coral uppercase tracking-widest">
              {owner.role}
            </p>

            <div className="text-muted-foreground text-lg leading-relaxed space-y-6">
              {owner.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              En Lúdicamente Didácticos diseñamos materiales que ponen el juego
              en el centro del proceso educativo. Cada producto nace de la
              observación clínica y el amor por acompañar a los niños en su
              camino único de aprendizaje.
            </p>
          </AnimatedElement>

          {/* Col derecha — foto */}
          <AnimatedElement delay={0.15} className="order-1 md:order-2">
            <div className="relative w-full aspect-4/5 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={OWNER_PHOTO}
                alt="Equipo Lúdicamente Didácticos"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Decoración de color de marca */}
              <div className="absolute inset-0 bg-linear-to-t from-ldc-coral/20 to-transparent pointer-events-none" />
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Pilares — reutiliza InfoCards */}
      <InfoCards />

      <CallToAction
        title="Conocé nuestros kits y productos"
        description="Diseñados con mirada psicopedagógica para acompañar el desarrollo integral de cada niño."
        buttonText="Ir a la tienda"
        href="/shop"
      />
    </main>
  );
}

import { Sparkles, Brain, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import AnimatedElement from "./AnimatedElement";

const ICONS: Record<string, React.ElementType> = {
  sparkles: Sparkles,
  brain: Brain,
  heart: Heart,
};

export default function InfoCards() {
  return (
    <section className="py-16 md:py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.sections.pillars.map((pillar, idx) => {
            const Icon = ICONS[pillar.icon] ?? Sparkles;
            return (
              <AnimatedElement key={pillar.title} delay={idx * 0.1}>
                <div
                  className={`${pillar.color} rounded-2xl p-8 h-full flex flex-col gap-4 border border-white/40`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ fontFamily: "DynaPuff, sans-serif" }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </AnimatedElement>
            );
          })}
        </div>
      </div>
    </section>
  );
}

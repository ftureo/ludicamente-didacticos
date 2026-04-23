import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import AnimatedElement from "@/components/common/AnimatedElement";
import CallToAction from "@/components/common/CallToAction";

export const metadata: Metadata = {
  title: "Insights — Lúdicamente Didácticos",
  description:
    "Artículos y reflexiones basados en evidencia sobre aprendizaje lúdico, psicomotricidad y desarrollo infantil.",
};

interface Insight {
  id: string;
  category: string;
  title: string;
  summary: string;
  quote: string;
  source: string;
  sourceUrl?: string;
}

const INSIGHTS: Insight[] = [
  {
    id: "aprendizaje-basado-en-el-juego",
    category: "Aprendizaje",
    title: "Aprendizaje basado en el juego",
    summary:
      "El aprendizaje basado en el juego (play-based learning) es ampliamente reconocido como una estrategia clave en el desarrollo infantil temprano. Según organismos internacionales, el juego no solo promueve el disfrute, sino que también fortalece habilidades cognitivas, sociales y emocionales fundamentales.\n\nCuando un niño juega, explora, experimenta y construye significado. Este proceso activa múltiples áreas del cerebro y facilita aprendizajes más profundos y duraderos que los métodos tradicionales centrados únicamente en la instrucción.\n\nEn este contexto, los materiales didácticos diseñados desde una lógica lúdica no son un complemento: son una herramienta central en el desarrollo integral.",
    quote:
      "El juego es esencial para el desarrollo saludable del cerebro y promueve habilidades clave como la creatividad, la resolución de problemas y la regulación emocional.",
    source: "UNICEF — Learning through play",
    sourceUrl: "https://www.unicef.org/early-childhood-development/play",
  },
  {
    id: "rol-de-la-experiencia",
    category: "Pedagogía experiencial",
    title: "El rol de la experiencia en el aprendizaje",
    summary:
      "El aprendizaje significativo ocurre cuando las personas pueden conectar la información con experiencias concretas. En la infancia, esto se logra principalmente a través de la interacción con el entorno.\n\nManipular objetos, explorar texturas y experimentar situaciones reales permite que el conocimiento deje de ser abstracto y se convierta en algo comprensible y aplicable.\n\nPor eso, los recursos didácticos que involucran el cuerpo y los sentidos no solo facilitan el aprendizaje: lo hacen posible.",
    quote: "Dime y lo olvido, enséñame y lo recuerdo, involúcrame y lo aprendo.",
    source: "Benjamin Franklin — Pedagogía experiencial",
  },
  {
    id: "desarrollo-integral-y-juego",
    category: "Desarrollo integral",
    title: "Desarrollo integral y juego",
    summary:
      "El desarrollo infantil no puede entenderse como una suma de habilidades aisladas. Cognición, emoción y motricidad están profundamente interconectadas.\n\nEl juego es uno de los pocos contextos donde estas dimensiones se integran de forma natural. A través del juego, los niños no solo aprenden contenidos, sino que desarrollan autonomía, regulación emocional y habilidades sociales.\n\nEste enfoque integral es clave para diseñar propuestas educativas realmente efectivas.",
    quote:
      "Los niños aprenden mejor cuando están activamente involucrados y emocionalmente comprometidos.",
    source:
      "Harvard University Center on the Developing Child — Serve and Return",
    sourceUrl: "https://developingchild.harvard.edu",
  },
];

export default function InsightsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16 md:py-24">
      {/* Hero header */}
      <AnimatedElement className="text-center mb-16">
        <h1
          className="text-6xl md:text-7xl font-bold leading-tight text-foreground mb-4"
          style={{ fontFamily: "DynaPuff, sans-serif" }}
        >
          Insights
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          Reflexiones basadas en evidencia sobre aprendizaje lúdico,
          psicomotricidad y desarrollo infantil.
        </p>
      </AnimatedElement>

      {/* Lista de InsightCards */}
      <div className="flex flex-col gap-10">
        {INSIGHTS.map((insight, idx) => (
          <InsightCard key={insight.id} insight={insight} delay={idx * 0.1} />
        ))}
      </div>

      <CallToAction
        title="¿Te interesa el aprendizaje lúdico?"
        description="Explorá nuestros materiales didácticos diseñados con fundamento psicopedagógico."
        buttonText="Volver al inicio"
        href="/"
      />
    </main>
  );
}

function InsightCard({ insight, delay }: { insight: Insight; delay?: number }) {
  return (
    <AnimatedElement delay={delay}>
      <article className="rounded-2xl border border-border bg-card p-8 md:p-10 flex flex-col gap-6 shadow-md hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3">
        <Badge className="bg-ldc-coral text-white hover:bg-ldc-coral/90 w-fit">
          {insight.category}
        </Badge>
        </div>

        <h2
          className="text-2xl md:text-3xl font-bold text-foreground"
          style={{ fontFamily: "DynaPuff, sans-serif" }}
        >
          {insight.title}
        </h2>

        <div className="prose prose-sm text-muted-foreground leading-relaxed max-w-2xl">
          {insight.summary.split("\n\n").map((paragraph, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static seed content
            <p key={i} className={i > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Cita destacada */}
        <blockquote className="border-l-4 border-ldc-coral pl-6 py-1">
          <p className="text-foreground italic text-base md:text-lg leading-relaxed">
            &ldquo;{insight.quote}&rdquo;
          </p>
          <footer className="mt-3 text-sm text-muted-foreground">
            {insight.sourceUrl ? (
              <a
                href={insight.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ldc-coral transition-colors underline underline-offset-2"
              >
                — {insight.source}
              </a>
            ) : (
              <span>— {insight.source}</span>
            )}
          </footer>
        </blockquote>
      </article>
    </AnimatedElement>
  );
}

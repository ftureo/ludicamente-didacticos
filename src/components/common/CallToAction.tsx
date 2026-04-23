import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CallToActionProps {
  title: string;
  description?: string;
  buttonText: string;
  href?: string;
  target?: string;
  rel?: string;
}

export default function CallToAction({
  title,
  description,
  buttonText,
  href = "/shop",
  target,
  rel,
}: CallToActionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-20">
      <div className="w-full rounded-2xl bg-ldc-coral/8 border border-ldc-coral/20 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3
              className="text-2xl md:text-3xl font-bold text-foreground mb-2"
              style={{ fontFamily: "DynaPuff, sans-serif" }}
            >
              {title}
            </h3>
            {description && (
              <p className="text-muted-foreground max-w-lg">{description}</p>
            )}
          </div>

          <Link
            href={href}
            target={target}
            rel={rel}
            className="inline-flex items-center justify-center gap-2
              w-full sm:w-auto px-8 py-4 min-h-[48px]
              bg-ldc-coral hover:bg-ldc-coral/90 text-white
              font-semibold rounded-xl transition-all duration-300
              hover:shadow-lg hover:shadow-ldc-coral/25 group shrink-0"
          >
            {buttonText}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

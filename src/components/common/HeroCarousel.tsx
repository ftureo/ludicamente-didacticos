"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type { ItemDTO } from "@/types/item";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface HeroCarouselProps {
  slides: ItemDTO[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const swiperRef = useRef(null);

  const hasSlides = slides.length > 0;
  const fallback = siteConfig.hero.fallbackSlide;

  if (!hasSlides) {
    return (
      <section className="relative w-full h-[70vh] min-h-[480px] bg-ldc-verde/15 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="max-w-xl">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              style={{ fontFamily: "DynaPuff, sans-serif" }}
            >
              {fallback.punchline}
            </h1>
            <Button asChild size="lg" className="bg-ldc-coral hover:bg-ldc-coral/90 text-white min-h-[48px]">
              <Link href={fallback.ctaHref}>{fallback.ctaText}</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop={slides.length > 1}
        className="w-full h-[70vh] min-h-[480px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="bg-ldc-verde/15">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center">

                {/* Col izquierda — texto */}
                <div className="flex flex-col gap-5 py-8 md:py-0">
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground"
                    style={{ fontFamily: "DynaPuff, sans-serif" }}
                  >
                    {slide.heroSlide?.punchline ?? slide.title}
                  </h2>

                  {slide.slogan && (
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {slide.slogan}
                    </p>
                  )}

                  <div>
                    <Button
                      asChild
                      size="lg"
                      className="bg-ldc-coral hover:bg-ldc-coral/90 text-white min-h-[48px]"
                    >
                      <Link href={slide.heroSlide?.ctaHref ?? "/shop"}>
                        {slide.heroSlide?.ctaText ?? "Descubrilo"}
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Col derecha — imagen 4:3 contenida */}
                {slide.image && (
                  <div className="hidden md:flex justify-center items-center h-full py-8">
                    <div className="relative w-full max-w-lg aspect-4/3 rounded-2xl overflow-hidden shadow-2xl bg-white">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

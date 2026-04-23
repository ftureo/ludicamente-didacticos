export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db/mongodb";
import { itemRepository } from "@/lib/repositories/item.repository";
import { toItemDTO } from "@/lib/mappers/item.mapper";
import HeroCarousel from "@/components/common/HeroCarousel";
import FeaturedSection from "@/components/common/FeaturedSection";
import InfoCards from "@/components/common/InfoCards";
import CallToAction from "@/components/common/CallToAction";

export default async function HomePage() {
  await connectDB();
  const [heroSlides, featuredItems] = await Promise.all([
    itemRepository.findForHero(),
    itemRepository.findFeatured(3),
  ]);

  return (
    <>
      <HeroCarousel slides={heroSlides.map(toItemDTO)} />
      <FeaturedSection items={featuredItems} />
      <InfoCards />
      <CallToAction
        title="¿Querés explorar nuestros productos?"
        description="Kits y materiales didácticos con enfoque psicopedagógico, pensados para acompañar cada etapa del aprendizaje."
        buttonText="Ver catálogo"
        href="/shop"
      />
    </>
  );
}

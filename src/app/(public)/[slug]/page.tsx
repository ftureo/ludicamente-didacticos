export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongodb";
import { itemRepository } from "@/lib/repositories/item.repository";
import { toItemDTO } from "@/lib/mappers/item.mapper";
import type { Metadata } from "next";
import ItemDetailClient from "./ItemDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const item = await itemRepository.findBySlug(slug);
  if (!item) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const ogImages = item.image
    ? [{ url: item.image, width: 800, height: 800, alt: item.title }]
    : [];

  return {
    title: `${item.title} — Lúdicamente Didácticos`,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      url: `${siteUrl}/${item.slug}`,
      siteName: "Lúdicamente Didácticos",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: item.image ? [item.image] : [],
    },
  };
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const item = await itemRepository.findBySlug(slug);
  if (!item) notFound();

  return <ItemDetailClient item={toItemDTO(item)} />;
}

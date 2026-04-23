export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db/mongodb";
import { itemRepository } from "@/lib/repositories/item.repository";
import { toItemDTO } from "@/lib/mappers/item.mapper";
import ShopClient from "./ShopClient";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Catálogo — ${siteConfig.branding.name}`,
  description: "Explorá todos nuestros kits y productos didácticos.",
};

export default async function ShopPage() {
  await connectDB();
  const [kits, productos] = await Promise.all([
    itemRepository.findByType("kit"),
    itemRepository.findByType("producto"),
  ]);

  return <ShopClient kits={kits.map(toItemDTO)} productos={productos.map(toItemDTO)} />;
}

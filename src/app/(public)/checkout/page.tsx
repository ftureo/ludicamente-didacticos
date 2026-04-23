import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: `Completar pedido — ${siteConfig.branding.name}`,
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

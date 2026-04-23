import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/components/cart/CartProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords: [...siteConfig.seo.keywords],
  openGraph: {
    title: siteConfig.seo.openGraph.title,
    description: siteConfig.seo.openGraph.description,
    url: siteConfig.seo.url,
    siteName: siteConfig.branding.name,
    type: "website",
    images: siteConfig.seo.openGraph.images.map((url) => ({ url })),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.openGraph.title,
    description: siteConfig.seo.openGraph.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <CartProvider>
          {children}
          <Toaster richColors position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}

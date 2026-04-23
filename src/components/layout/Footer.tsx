import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-10">
          {/* Brand — ocupa todo el ancho en mobile */}
          <div className="col-span-2 md:col-span-1 text-center md:text-left">
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "DynaPuff, sans-serif" }}
            >
              {siteConfig.branding.shortName}
            </h3>
            <p className="text-sidebar-foreground/60 text-sm leading-relaxed">
              {siteConfig.branding.tagline}
            </p>
          </div>

          {/* Columns */}
          {siteConfig.footer.columns.map((col) => (
            <div key={col.title} className="text-center md:text-left">
              <h4 className="font-semibold text-sm mb-4 text-sidebar-foreground/80 uppercase tracking-wide">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-sidebar-border text-center">
          <p className="text-xs text-sidebar-foreground/40">{siteConfig.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}

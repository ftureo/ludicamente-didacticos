"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu,  ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import CartSidebar from "@/components/cart/CartSidebar";

export default function Navbar() {
  const pathname = usePathname();
  const { count, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {siteConfig.branding.logo ? (
              <Image
                src={siteConfig.branding.logo}
                alt={siteConfig.branding.name}
                width={140}
                height={48}
                className="h-40 w-auto object-contain"
                priority
              />
            ) : (
              <span
                className="text-xl font-bold text-foreground"
                style={{ fontFamily: "DynaPuff, sans-serif" }}
              >
                {siteConfig.branding.shortName}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {siteConfig.navigation.main.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href || pathname.startsWith(href.split("?")[0])
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {label}
              </Link>
            ))}

            {/* Dropdown */}
            <div className="relative">
              {(() => {
                const isDropdownActive = siteConfig.navigation.dropdown.items.some(
                  ({ href }) => pathname === href,
                );
                return (
                  <>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        isDropdownActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {siteConfig.navigation.dropdown.label}
                      <ChevronDown className={cn("w-3 h-3 transition-transform", dropdownOpen && "rotate-180")} />
                    </button>
                    {dropdownOpen && (
                      <div
                        className="absolute top-full mt-1 right-0 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50"
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        {siteConfig.navigation.dropdown.items.map(({ label, href }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setDropdownOpen(false)}
                            className={cn(
                              "block px-4 py-2 text-sm transition-colors",
                              pathname === href
                                ? "text-primary font-semibold bg-muted"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted",
                            )}
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
              aria-label="Carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle asChild>
              {siteConfig.branding.logo ? (
                <div>
                  <Image
                    src={siteConfig.branding.logo}
                    alt={siteConfig.branding.name}
                    width={120}
                    height={40}
                    className="h-9 w-auto object-contain"
                  />
                </div>
              ) : (
                <span style={{ fontFamily: "DynaPuff, sans-serif" }}>
                  {siteConfig.branding.shortName}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1">
            {siteConfig.navigation.main.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {siteConfig.navigation.dropdown.label}
              </p>
              {siteConfig.navigation.dropdown.items.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 text-sm rounded-lg transition-colors",
                    pathname === href
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}

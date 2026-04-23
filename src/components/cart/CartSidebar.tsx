"use client";

import { useCart } from "@/hooks/useCart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:w-[420px] flex flex-col p-0">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="flex items-center gap-2" style={{ fontFamily: "DynaPuff, sans-serif" }}>
            <ShoppingBag className="w-5 h-5 text-ldc-coral" />
            Carrito {count > 0 && <span className="text-ldc-coral">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <ShoppingBag className="w-12 h-12 opacity-30" />
              <p className="text-sm">Tu carrito está vacío</p>
              <Button asChild variant="outline" size="sm" onClick={closeCart}>
                <Link href="/shop">Ver catálogo</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5">
                  {item.image && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight truncate">{item.title}</p>
                    <p className="text-ldc-coral font-semibold text-sm mt-1">
                      ${item.price.toLocaleString("es-AR")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, Math.min(item.qty + 1, 10))}
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <p className="font-semibold text-sm">
                      ${(item.price * item.qty).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-4">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span className="text-lg">${total.toLocaleString("es-AR")}</span>
            </div>
            <Button
              asChild
              className="w-full bg-ldc-coral hover:bg-ldc-coral/90 text-white font-semibold min-h-[48px]"
              onClick={closeCart}
            >
              <Link href="/checkout">Completar pedido</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

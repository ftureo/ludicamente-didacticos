import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-ldc-verde/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-ldc-verde" />
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "DynaPuff, sans-serif" }}
        >
          ¡Pedido enviado!
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Recibimos tu pedido. Nos vamos a poner en contacto por WhatsApp o email en las
          próximas horas para coordinar la entrega.
        </p>
        <p className="text-sm text-muted-foreground">
          ¡Gracias por elegir Lúdicamente Didácticos!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-ldc-coral hover:bg-ldc-coral/90 text-white min-h-[48px]">
            <Link href="/shop">Seguir comprando</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-[48px]">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

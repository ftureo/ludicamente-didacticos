import CouponForm from "@/components/admin/CouponForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCouponPage() {
  return (
    <div>
      <Link
        href="/admin/coupons"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a cupones
      </Link>

      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "DynaPuff, sans-serif" }}>
        Nuevo cupón
      </h1>

      <CouponForm />
    </div>
  );
}

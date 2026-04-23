"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatusAction } from "@/actions/order.actions";
import { toast } from "sonner";
import type { OrderStatus } from "@/models/Order";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<OrderStatus, string> = {
  nuevo: "Nuevo",
  "en-proceso": "En proceso",
  finalizado: "Finalizado",
  entregado: "Entregado",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  nuevo: "bg-ldc-amarillo/20 text-yellow-700 border-ldc-amarillo/40",
  "en-proceso": "bg-ldc-azul/20 text-blue-700 border-ldc-azul/40",
  finalizado: "bg-ldc-verde/20 text-green-700 border-ldc-verde/40",
  entregado: "bg-ldc-rosa/20 text-pink-700 border-ldc-rosa/40",
};

interface OrderStatusSelectorProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        STATUS_COLORS[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function OrderStatusSelector({ orderId, currentStatus }: OrderStatusSelectorProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(value: string) {
    const newStatus = value as OrderStatus;
    setLoading(true);
    const result = await updateOrderStatusAction(orderId, newStatus);
    setLoading(false);
    if (result.success) {
      setStatus(newStatus);
      toast.success("Estado actualizado");
      router.refresh();
    } else {
      toast.error("Error al actualizar estado");
    }
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
          <SelectItem key={s} value={s}>
            {STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

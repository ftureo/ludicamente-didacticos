import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus = "nuevo" | "en-proceso" | "finalizado" | "entregado";

export interface IOrderItem {
  itemId: string;
  title: string;
  image: string;
  qty: number;
  price: number;
}

export interface IOrder {
  nombre: string;
  apellido: string;
  email: string;
  whatsapp: string;
  comentario?: string;
  comprobanteUrl?: string;
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {
  _id: mongoose.Types.ObjectId;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    itemId: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    nombre: { type: String, required: [true, "El nombre es requerido"], trim: true },
    apellido: { type: String, required: [true, "El apellido es requerido"], trim: true },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      lowercase: true,
      trim: true,
    },
    whatsapp: { type: String, required: [true, "El WhatsApp es requerido"], trim: true },
    comentario: { type: String, maxlength: 1000, trim: true },
    comprobanteUrl: { type: String, trim: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["nuevo", "en-proceso", "finalizado", "entregado"],
      default: "nuevo",
    },
  },
  { timestamps: true },
);

OrderSchema.index({ status: 1, createdAt: -1 });

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as Record<string, unknown>)["Order"];
}

const Order: Model<IOrderDocument> =
  (mongoose.models.Order as Model<IOrderDocument>) ||
  mongoose.model<IOrderDocument>("Order", OrderSchema);

export default Order;

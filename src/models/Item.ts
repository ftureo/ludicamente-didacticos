import mongoose, { Schema, Document, Model } from "mongoose";

// ── Types ────────────────────────────────────────────────────────
export type ItemType = "kit" | "producto";
export type ItemAccentColor = "primary" | "secondary" | "accent";

export interface IItemFeature {
  title: string;
  description: string;
  group?: string;
}

export interface IItemPricing {
  basePrice: number;
  currency: string;
}

export interface IItemHeroSlide {
  punchline: string;
  ctaText: string;
  ctaHref: string;
}

export interface IItem {
  title: string;
  slug: string;
  slogan?: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery: string[];
  type: ItemType;
  featured: boolean;
  heroSlide?: IItemHeroSlide;
  accentColor?: ItemAccentColor;
  features: IItemFeature[];
  pricing?: IItemPricing;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IItemDocument extends IItem, Document {
  _id: mongoose.Types.ObjectId;
}

// ── Sub-schemas ──────────────────────────────────────────────────

const ItemFeatureSchema = new Schema<IItemFeature>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    group: { type: String },
  },
  { _id: false },
);

const ItemPricingSchema = new Schema<IItemPricing>(
  {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: "ARS" },
  },
  { _id: false },
);

const ItemHeroSlideSchema = new Schema<IItemHeroSlide>(
  {
    punchline: { type: String, required: true },
    ctaText: { type: String, required: true },
    ctaHref: { type: String, required: true },
  },
  { _id: false },
);

// ── Schema principal ─────────────────────────────────────────────

const ItemSchema = new Schema<IItemDocument>(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      maxlength: [100, "El título no puede exceder 100 caracteres"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    slogan: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      maxlength: 500,
    },
    longDescription: {
      type: String,
      maxlength: 2000,
    },
    image: { type: String, required: [true, "La imagen es requerida"] },
    gallery: { type: [String], default: [] },
    type: {
      type: String,
      enum: ["kit", "producto"],
      required: [true, "El tipo es requerido"],
      default: "producto",
    },
    featured: { type: Boolean, default: false },
    heroSlide: { type: ItemHeroSlideSchema },
    accentColor: {
      type: String,
      enum: ["primary", "secondary", "accent"],
    },
    features: { type: [ItemFeatureSchema], default: [] },
    pricing: { type: ItemPricingSchema },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ItemSchema.index({ isActive: 1, order: 1 });
ItemSchema.index({ type: 1, isActive: 1 });
ItemSchema.index({ featured: 1, isActive: 1 });

ItemSchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as Record<string, unknown>)["Item"];
}

const Item: Model<IItemDocument> =
  (mongoose.models.Item as Model<IItemDocument>) ||
  mongoose.model<IItemDocument>("Item", ItemSchema);

export default Item;

import mongoose, { Schema, Document, Model } from "mongoose";

export type SubItemStatus = "draft" | "active" | "archived";

export interface ISubItemMetadata {
  views: number;
  likes: number;
}

export interface ISubItem {
  title: string;
  slug: string;
  slogan?: string;
  description: string;
  image: string;
  gallery: string[];
  status: SubItemStatus;
  parentItem: mongoose.Types.ObjectId | string;
  tags: string[];
  featured: boolean;
  metadata: ISubItemMetadata;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubItemDocument extends ISubItem, Document {
  _id: mongoose.Types.ObjectId;
}

const SubItemMetadataSchema = new Schema<ISubItemMetadata>(
  { views: { type: Number, default: 0 }, likes: { type: Number, default: 0 } },
  { _id: false },
);

const SubItemSchema = new Schema<ISubItemDocument>(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      maxlength: 150,
    },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    slogan: { type: String, trim: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 1000 },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    parentItem: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "El item padre es requerido"],
    },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    metadata: { type: SubItemMetadataSchema, default: () => ({ views: 0, likes: 0 }) },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

SubItemSchema.index({ isActive: 1, status: 1 });
SubItemSchema.index({ isActive: 1, featured: 1 });
SubItemSchema.index({ parentItem: 1, isActive: 1 });
SubItemSchema.index({ createdAt: -1 });

SubItemSchema.virtual("parentInfo", {
  ref: "Item",
  localField: "parentItem",
  foreignField: "_id",
  justOne: true,
});

SubItemSchema.pre("validate", function () {
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
  delete (mongoose.models as Record<string, unknown>)["SubItem"];
}

const SubItem: Model<ISubItemDocument> =
  (mongoose.models.SubItem as Model<ISubItemDocument>) ||
  mongoose.model<ISubItemDocument>("SubItem", SubItemSchema);

export default SubItem;

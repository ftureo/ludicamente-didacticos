export interface ItemFeatureDTO {
  title: string;
  description: string;
  group?: string;
}

export interface ItemHeroSlideDTO {
  punchline: string;
  ctaText: string;
  ctaHref: string;
}

export interface ItemDTO {
  id: string;
  title: string;
  slug: string;
  slogan?: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery: string[];
  type: "kit" | "producto";
  featured: boolean;
  heroSlide?: ItemHeroSlideDTO;
  accentColor?: "primary" | "secondary" | "accent";
  features: ItemFeatureDTO[];
  pricing?: { basePrice: number; currency: string };
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubItemDTO {
  id: string;
  title: string;
  slug: string;
  slogan?: string;
  description: string;
  image: string;
  gallery: string[];
  status: "draft" | "active" | "archived";
  parentItem: string;
  tags: string[];
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  qty: number;
}

export interface OrderItemDTO {
  itemId: string;
  title: string;
  image: string;
  qty: number;
  price: number;
}

export interface OrderDTO {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  whatsapp: string;
  comentario?: string;
  items: OrderItemDTO[];
  total: number;
  status: "nuevo" | "en-proceso" | "finalizado" | "entregado";
  createdAt: string;
  updatedAt: string;
}

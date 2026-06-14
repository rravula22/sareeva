import type { OrderStatus, Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  description?: string | null;
  logo?: string | null;
  verified: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  images: string[];
  createdAt: string | Date;
  user?: {
    name?: string | null;
    image?: string | null;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  images: string[];
  fabric: string;
  occasion: string[];
  color: string[];
  sizes: string[];
  stock: number;
  category: string;
  subcategory?: string | null;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  sellerId?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  seller?: SellerProfile | null;
  reviews?: Array<Pick<Review, "rating"> & Partial<Review>>;
  averageRating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id?: string;
  cartId?: string;
  productId: string;
  quantity: number;
  size?: string | null;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  paymentId?: string | null;
  paymentMethod?: string | null;
  shippingAddress: Record<string, string>;
  createdAt: string | Date;
  updatedAt?: string | Date;
  items?: Array<{
    id: string;
    productId: string;
    quantity: number;
    size?: string | null;
    price: number;
    product?: Product;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  phone?: string | null;
  sellerProfile?: SellerProfile | null;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

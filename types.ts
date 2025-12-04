export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER'
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
  pixKey?: string; 
  blocked?: boolean;
  isOnline?: boolean;
  createdAt: number;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string; // Denormalized for speed
  sellerAvatar?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  condition: 'new' | 'used';
  paymentMethods: string[];
  createdAt: number;
  active: boolean; 
  shopName: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  timestamp: number;
}

// Public chat for specific product
export interface ProductMessage {
  id: string;
  productId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: number;
  isSeller: boolean;
}

export interface ChatSession {
  id: string;
  participants: string[]; // [buyerId, sellerId]
  productId?: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

export interface Report {
  id: string;
  targetId: string; // Seller ID or Product ID
  reporterId: string;
  reason: string;
  details: string;
  evidence?: string;
  timestamp: number;
}

export interface HelpReport {
  id: string;
  context: string;
  description: string;
  relatedUser?: string;
  timestamp: number;
}

// Event types for Real-time Multiplayer
export type SyncEvent = 
  | { type: 'NEW_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'NEW_PRODUCT_MSG'; payload: ProductMessage }
  | { type: 'NEW_REPORT'; payload: any };
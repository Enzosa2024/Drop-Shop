import { User, Product, ChatSession, Report, HelpReport, CartItem, ProductMessage, SyncEvent } from '../types';

const KEYS = {
  USERS: 'dropshop_users',
  CURRENT_USER: 'dropshop_session',
  PRODUCTS: 'dropshop_products',
  CHATS: 'dropshop_chats',
  REPORTS: 'dropshop_reports',
  CART: 'dropshop_cart',
  HELP_REPORTS: 'dropshop_help_reports',
  PRODUCT_MESSAGES_PREFIX: 'dropshop_msg_prod_'
};

// Real-time Multiplayer Channel
const syncChannel = new BroadcastChannel('dropshop_multiplayer_sync');

export const broadcast = (event: SyncEvent) => {
  syncChannel.postMessage(event);
};

export const subscribeToSync = (callback: (event: SyncEvent) => void) => {
  syncChannel.onmessage = (ev) => callback(ev.data);
  return () => {
    syncChannel.onmessage = null;
  };
};

export const storageService = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(KEYS.USERS, JSON.stringify(users)),

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  saveCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  getProducts: (): Product[] => JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]'),
  saveProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    // NOTE: Broadcast is handled in the Context or where this is called to avoid loops if needed, 
    // but typically we broadcast AFTER saving.
  },

  getChats: (): ChatSession[] => JSON.parse(localStorage.getItem(KEYS.CHATS) || '[]'),
  saveChats: (chats: ChatSession[]) => localStorage.setItem(KEYS.CHATS, JSON.stringify(chats)),

  getReports: (): Report[] => JSON.parse(localStorage.getItem(KEYS.REPORTS) || '[]'),
  saveReports: (reports: Report[]) => localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports)),
  
  getCart: (): { [itemId: string]: number } => JSON.parse(localStorage.getItem(KEYS.CART) || '{}'),
  saveCart: (cart: { [itemId: string]: number }) => localStorage.setItem(KEYS.CART, JSON.stringify(cart)),

  getHelpReports: (): HelpReport[] => JSON.parse(localStorage.getItem(KEYS.HELP_REPORTS) || '[]'),
  saveHelpReports: (reports: HelpReport[]) => localStorage.setItem(KEYS.HELP_REPORTS, JSON.stringify(reports)),

  // Public Product Chat
  getProductMessages: (productId: string): ProductMessage[] => {
    const key = `${KEYS.PRODUCT_MESSAGES_PREFIX}${productId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },
  saveProductMessage: (productId: string, message: ProductMessage) => {
    const key = `${KEYS.PRODUCT_MESSAGES_PREFIX}${productId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(message);
    localStorage.setItem(key, JSON.stringify(existing));
    broadcast({ type: 'NEW_PRODUCT_MSG', payload: message });
  }
};
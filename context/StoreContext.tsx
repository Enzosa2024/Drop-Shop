import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, UserRole, HelpReport, ProductMessage } from '../types';
import { storageService, broadcast, subscribeToSync } from '../services/storageService';
import { useAuth } from './AuthContext';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  reportProduct: (productId: string, reason: string, details: string) => void;
  submitHelpReport: (context: string, description: string, relatedUser?: string) => void;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Initial Load
  useEffect(() => {
    setProducts(storageService.getProducts());
    
    // Load cart
    const savedCartMap = storageService.getCart();
    const loadedProds = storageService.getProducts();
    const derivedCart: CartItem[] = [];
    Object.entries(savedCartMap).forEach(([pid, qty]) => {
        const prod = loadedProds.find(p => p.id === pid);
        if (prod) derivedCart.push({ ...prod, quantity: qty });
    });
    setCart(derivedCart);
  }, []);

  // MULTIPLAYER SYNC
  useEffect(() => {
    const unsubscribe = subscribeToSync((event) => {
        // When another tab updates data, we update our state immediately
        console.log("Real-time Update Received:", event);
        switch (event.type) {
            case 'NEW_PRODUCT':
                setProducts(prev => [event.payload, ...prev]);
                break;
            case 'UPDATE_PRODUCT':
                setProducts(prev => prev.map(p => p.id === event.payload.id ? event.payload : p));
                break;
            case 'DELETE_PRODUCT':
                setProducts(prev => prev.filter(p => p.id !== event.payload));
                break;
            // Chat messages handled locally in ProductDetails component usually, but could be global here
        }
    });
    return unsubscribe;
  }, []);

  // Persist Cart
  useEffect(() => {
      const cartMap: {[key:string]: number} = {};
      cart.forEach(c => cartMap[c.id] = c.quantity);
      storageService.saveCart(cartMap);
  }, [cart]);

  const addProduct = (product: Product) => {
    const newProducts = [product, ...products];
    setProducts(newProducts);
    storageService.saveProducts(newProducts);
    broadcast({ type: 'NEW_PRODUCT', payload: product });
  };

  const updateProduct = (product: Product) => {
    const newProducts = products.map(p => p.id === product.id ? product : p);
    setProducts(newProducts);
    storageService.saveProducts(newProducts);
    broadcast({ type: 'UPDATE_PRODUCT', payload: product });
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    storageService.saveProducts(newProducts);
    broadcast({ type: 'DELETE_PRODUCT', payload: id });
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(p => p.id === productId ? { ...p, quantity } : p));
  };

  const clearCart = () => {
    setCart([]);
  };

  const reportProduct = (productId: string, reason: string, details: string) => {
     if(!user) return;
     const reports = storageService.getReports();
     const newReport = {
         id: Date.now().toString(),
         targetId: productId,
         reporterId: user.id,
         reason,
         details,
         timestamp: Date.now()
     };
     reports.push(newReport);
     storageService.saveReports(reports);
     broadcast({ type: 'NEW_REPORT', payload: newReport });
  };

  const submitHelpReport = (context: string, description: string, relatedUser?: string) => {
      const reports = storageService.getHelpReports();
      const newReport: HelpReport = {
          id: Date.now().toString(),
          context,
          description,
          relatedUser,
          timestamp: Date.now()
      };
      reports.push(newReport);
      storageService.saveHelpReports(reports);
  };

  return (
    <StoreContext.Provider value={{ products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, addProduct, updateProduct, deleteProduct, reportProduct, submitHelpReport }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
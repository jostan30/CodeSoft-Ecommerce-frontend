// lib/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  brand?: string;
  selectedQuantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'selectedQuantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product) => set((state) => {
        const existingItem = state.items.find(item => item._id === product._id);
        
        if (existingItem) {
          return {
            items: state.items.map(item => 
              item._id === product._id 
                ? { ...item, selectedQuantity: item.selectedQuantity + 1 } 
                : item
            )
          };
        }
        
        return {
          items: [...state.items, { ...product, selectedQuantity: 1 }]
        };
      }),
      
      removeFromCart: (productId) => set((state) => ({
        items: state.items.filter(item => item._id !== productId)
      })),
      
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item => 
          item._id === productId 
            ? { ...item, selectedQuantity: quantity } 
            : item
        )
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.price * item.selectedQuantity), 
          0
        );
      },
      
      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.selectedQuantity, 
          0
        );
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
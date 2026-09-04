import { create } from 'zustand';
import api from '@/app/lib/api';

interface CartState {
  itemsCount: number;
  subtotal: number;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  itemsCount: 0,
  subtotal: 0,
  fetchCart: async () => {
    try {
      const response = await api.get('/cart');
      set({
        itemsCount: response.data.items_count || 0,
        subtotal: response.data.subtotal || 0,
      });
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  },
}));

import { create } from 'zustand';
import { dataService } from '../services/dataService';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  save: (product: Product) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const products = await dataService.getProducts();
      set({ products, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  save: async (product) => {
    await dataService.saveProduct(product);
    set((s) => ({ products: [...s.products, product] }));
  },

  remove: async (id) => {
    await dataService.deleteProduct(id);
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
  },
}));

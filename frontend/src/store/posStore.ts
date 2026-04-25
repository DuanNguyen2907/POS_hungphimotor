import { create } from 'zustand';
import type { CartItem, Customer, Product } from '../types';

interface PosState {
  products: Product[];
  customers: Customer[];
  selectedCustomer?: Customer;
  cartItems: CartItem[];
  setProducts: (products: Product[]) => void;
  setCustomers: (customers: Customer[]) => void;
  setSelectedCustomer: (customer?: Customer) => void;
  addProductToCart: (product: Product) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  getTotal: () => number;
  clearCart: () => void;
}

export const usePosStore = create<PosState>((set, get) => ({
  products: [],
  customers: [],
  selectedCustomer: undefined,
  cartItems: [],

  setProducts: (products) => set({ products }),
  setCustomers: (customers) => set({ customers }),
  setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),

  addProductToCart: (product) =>
    set((state) => {
      if (product.stock <= 0 || !product.isActive) {
        return state;
      }

      const existing = state.cartItems.find((x) => x.productId === product.id);
      if (existing) {
        return {
          cartItems: state.cartItems.map((x) =>
            x.productId === product.id && x.quantity < x.stock
              ? { ...x, quantity: x.quantity + 1 }
              : x
          )
        };
      }

      return {
        cartItems: [
          ...state.cartItems,
          {
            productId: product.id,
            name: product.name,
            unitPrice: product.price,
            quantity: 1,
            stock: product.stock
          }
        ]
      };
    }),

  increaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.productId === productId && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    })),

  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.productId !== productId)
    })),

  getTotal: () =>
    get().cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),

  clearCart: () => set({ cartItems: [] })
}));

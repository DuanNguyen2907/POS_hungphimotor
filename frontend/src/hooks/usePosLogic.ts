import { useCallback, useMemo, useState } from 'react';
import { api } from '../api/api';
import { usePosStore } from '../store/posStore';
import type { Product } from '../types';

export type DiscountType = 'none' | 'fixed' | 'percent';

export interface DiscountState {
  type: DiscountType;
  value: number;
}

export function usePosLogic() {
  const products = usePosStore((s) => s.products);
  const cartItems = usePosStore((s) => s.cartItems);
  const selectedCustomer = usePosStore((s) => s.selectedCustomer);

  const setProducts = usePosStore((s) => s.setProducts);
  const addProductToCart = usePosStore((s) => s.addProductToCart);
  const increaseQuantity = usePosStore((s) => s.increaseQuantity);
  const decreaseQuantity = usePosStore((s) => s.decreaseQuantity);
  const clearCart = usePosStore((s) => s.clearCart);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [discount, setDiscount] = useState<DiscountState>({ type: 'none', value: 0 });

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cartItems]
  );

  const discountAmount = useMemo(() => {
    if (discount.type === 'fixed') {
      return Math.min(Math.max(discount.value, 0), subtotal);
    }

    if (discount.type === 'percent') {
      const percent = Math.min(Math.max(discount.value, 0), 100);
      return subtotal * (percent / 100);
    }

    return 0;
  }, [discount, subtotal]);

  const total = useMemo(() => Math.max(subtotal - discountAmount, 0), [subtotal, discountAmount]);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const response = await api.getProducts();
      setProducts(response);
    } catch {
      setProductsError('Failed to load products from API.');
    } finally {
      setLoadingProducts(false);
    }
  }, [setProducts]);

  const addToCart = (product: Product): string | null => {
    if (!product || !product.id) {
      return 'Invalid product selected.';
    }

    if (!product.isActive) {
      return 'This product is inactive.';
    }

    if (product.stock <= 0) {
      return `Product '${product.name}' is out of stock.`;
    }

    const existing = cartItems.find((i) => i.productId === product.id);
    if (existing && existing.quantity >= existing.stock) {
      return `No more stock left for '${product.name}'.`;
    }

    addProductToCart(product);
    return null;
  };

  const increaseCartItem = (productId: string): string | null => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return 'Invalid product in cart.';

    if (item.quantity >= item.stock) {
      return `No more stock left for '${item.name}'.`;
    }

    increaseQuantity(productId);
    return null;
  };

  const decreaseCartItem = (productId: string): void => {
    decreaseQuantity(productId);
  };

  const submitOrder = async (): Promise<{ ok: boolean; message: string }> => {
    if (!cartItems.length) {
      return { ok: false, message: 'Please add at least one product to cart.' };
    }

    setCheckoutLoading(true);
    try {
      // Re-fetch latest stock to minimize race conditions before placing order.
      const latestProducts = await api.getProducts();
      const latestById = new Map(latestProducts.map((p) => [p.id, p]));

      for (const item of cartItems) {
        const latest = latestById.get(item.productId);
        if (!latest || !latest.isActive) {
          return { ok: false, message: `Invalid product '${item.name}'. Please refresh cart.` };
        }

        if (item.quantity > latest.stock) {
          return {
            ok: false,
            message: `Stock changed for '${item.name}'. Available: ${latest.stock}, requested: ${item.quantity}.`
          };
        }
      }

      const order = await api.createOrder({
        customerId: selectedCustomer?.id,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      clearCart();
      setDiscount({ type: 'none', value: 0 });
      return { ok: true, message: `Order ${order.orderNo} created successfully.` };
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) {
        return { ok: false, message: 'One or more products are invalid.' };
      }

      if (status === 400 || status === 409) {
        return { ok: false, message: 'Order failed due to stock conflict. Please reload and retry.' };
      }

      return { ok: false, message: 'Checkout failed. Please try again.' };
    } finally {
      setCheckoutLoading(false);
    }
  };

  return {
    products,
    cartItems,
    subtotal,
    discount,
    discountAmount,
    total,
    loadingProducts,
    productsError,
    checkoutLoading,
    setDiscount,
    loadProducts,
    addToCart,
    increaseCartItem,
    decreaseCartItem,
    submitOrder
  };
}

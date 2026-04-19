import axios from 'axios';
import type { Product } from '../types';

export interface CreateOrderRequest {
  customerId?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface CreateOrderResponse {
  id: string;
  orderNo: string;
  customerId?: string;
  totalAmount: number;
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  timeout: 10000
});

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await http.get<Product[]>('/products');
    return response.data;
  },

  async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await http.post<CreateOrderResponse>('/orders', payload);
    return response.data;
  }
};

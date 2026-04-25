import type { Product } from '../types';
import { axiosClient } from './axiosClient';

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

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await axiosClient.get<Product[]>('/products');
    return response.data;
  },

  async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await axiosClient.post<CreateOrderResponse>('/orders', payload);
    return response.data;
  }
};

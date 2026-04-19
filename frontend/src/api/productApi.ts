import { axiosClient } from './axiosClient';
import type { Product } from '../types';

export const productApi = {
  async getAll(search?: string): Promise<Product[]> {
    const response = await axiosClient.get<Product[]>('/products', {
      params: search ? { search } : undefined
    });
    return response.data;
  }
};

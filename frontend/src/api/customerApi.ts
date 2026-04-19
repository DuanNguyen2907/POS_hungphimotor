import { axiosClient } from './axiosClient';
import type { Customer } from '../types';

export const customerApi = {
  async getAll(): Promise<Customer[]> {
    const response = await axiosClient.get<Customer[]>('/customers');
    return response.data;
  }
};

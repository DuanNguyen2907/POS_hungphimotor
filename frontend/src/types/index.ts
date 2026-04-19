export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  stock: number;
}

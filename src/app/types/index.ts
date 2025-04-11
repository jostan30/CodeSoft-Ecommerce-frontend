export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  export interface Order {
    _id: string;
    products: CartItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentId?: string;
    createdAt: string;
  }
'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentResult {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  status?: string;
  email_address?: string;
}

interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentResult: PaymentResult;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const token =useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/sellerOrder`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Orders fetched:', response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    if (activeTab === 'pending') return orders.filter(order => !order.isPaid);
    if (activeTab === 'processing') return orders.filter(order => order.isPaid && !order.isDelivered);
    if (activeTab === 'delivered') return orders.filter(order => order.isDelivered);
    return orders;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (order: Order) => {
    if (!order.isPaid) {
      return <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">Payment Pending</span>;
    } else if (!order.isDelivered) {
      return <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Processing</span>;
    } else {
      return <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Delivered</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-blue-400">My Orders</h1>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-gray-400 mb-6">You haven&apos;t placed any orders yet</p>
            <Link href="/shop" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">My Orders</h1>
        
        {/* Filter Tabs */}
        <div className="flex mb-6 border-b border-gray-700 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('all')}
            className={`cursor-pointer px-4 py-2 font-medium mr-4 whitespace-nowrap ${activeTab === 'all' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            All Orders
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`cursor-pointer px-4 py-2 font-medium mr-4 whitespace-nowrap ${activeTab === 'pending' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Payment Pending
          </button>
          <button 
            onClick={() => setActiveTab('processing')}
            className={`cursor-pointer px-4 py-2 font-medium mr-4 whitespace-nowrap ${activeTab === 'processing' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Processing
          </button>
          <button 
            onClick={() => setActiveTab('delivered')}
            className={`cursor-pointer px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'delivered' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Delivered
          </button>
        </div>
        
        {/* Orders List */}
        <div className="space-y-6">
          {getFilteredOrders().map((order) => (
            <div key={order._id} className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-750 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700">
                <div>
                  <div className="flex items-center mb-2 sm:mb-0">
                    <span className="text-sm text-gray-400 mr-2">Order ID:</span>
                    <span className="font-mono">{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center mt-2 sm:mt-0">
                  <div className="mr-4 mb-2 sm:mb-0">
                    <span className="text-sm text-gray-400 mr-2">Date:</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    {getStatusBadge(order)}
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden mr-3">
                        {item.image && (
                          <img
                            src={`data:image/jpeg;base64,${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="bg-gray-750 p-4 border-t border-gray-700">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-gray-400 text-sm">Items Total</p>
                    <p className="text-gray-400 text-sm">Shipping</p>
                    <p className="text-gray-400 text-sm">Tax</p>
                    <p className="font-medium mt-1">Total</p>

                  </div>
                  <div className="text-right">
                    <p className="text-sm">₹{(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</p>
                    <p className="text-sm">₹{order.shippingPrice.toFixed(2)}</p>
                    <p className="text-sm">₹{order.taxPrice.toFixed(2)}</p>
                    <p className="font-medium mt-1 text-blue-400">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t border-gray-700">
                  <div className="mb-3 sm:mb-0">
                    <p className="text-sm text-gray-400">Shipping Address:</p>
                    <p className="text-sm">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}
                    </p>
                  </div>
                 
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
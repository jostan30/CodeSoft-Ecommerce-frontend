'use client'

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";
import { useEffect, useState } from "react";

const Cart = () => {
    const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCartStore();
    const [isClient, setIsClient] = useState(false);
    
    // Hydration fix for server/client mismatch with localStorage
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-200 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-200 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8 text-blue-400">Your Cart</h1>
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
                        <p className="text-gray-400 mb-6">Looks like you haven't added any products to your cart yet.</p>
                        <Link href="/shop" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    const totalAmount = getTotal();

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-400">Your Cart</h1>
                    <Link href="/shop" className="text-vlue-400 hover:text-blue-300 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            <div className="p-4 border-b border-gray-700 flex justify-between">
                                <h2 className="text-xl font-semibold">Cart Items ({items.length})</h2>
                                <Button 
                                    variant={"destructive"}
                                    onClick={clearCart}
                                    className="cursor-pointer"
                                >
                                    Clear Cart
                                </Button>
                            </div>
                            
                            <div className="divide-y divide-gray-700">
                                {items.map(item => (
                                    <div key={item._id} className="p-4 flex flex-col sm:flex-row gap-4">
                                        {/* Product Image */}
                                        <div className="w-full sm:w-24 h-24 bg-gray-700 rounded flex items-center justify-center">
                                            {item.image ? (
                                                <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} className="object-cover rounded" />
                                            ) : (
                                                <div className="text-gray-500 text-sm">No image</div>
                                            )}
                                        </div>
                                        
                                        {/* Product Details */}
                                        <div className="flex-1">
                                            {item.brand && <p className="text-blue-400 text-sm">{item.brand}</p>}
                                            <h3 className="font-medium text-lg">{item.name}</h3>
                                            <p className="text-gray-400 text-sm mb-2">
                                                In stock: {item.quantity}
                                            </p>
                                        </div>
                                        
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => updateQuantity(item._id, Math.max(1, item.selectedQuantity - 1))}
                                                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-gray-400 hover:border-gray-500"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{item.selectedQuantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item._id, Math.min(item.quantity, item.selectedQuantity + 1))}
                                                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-gray-400 hover:border-gray-500"
                                                disabled={item.selectedQuantity >= item.quantity}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        {/* Price and Remove */}
                                        <div className="flex flex-col items-end justify-between">
                                            <div className="text-lg font-semibold">₹{(item.price * item.selectedQuantity).toFixed(2)}</div>
                                            <Button 
                                                variant={"destructive"}
                                                onClick={() => removeFromCart(item._id)}
                                                className="cursor-pointer"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 sticky top-4">
                            <div className="p-4 border-b border-gray-700">
                                <h2 className="text-xl font-semibold">Order Summary</h2>
                            </div>
                            
                            <div className="p-4 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Shipping</span>
                                    <span>₹40.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Tax</span>
                                    <span>₹{(totalAmount * 0.05).toFixed(2)}</span>
                                </div>
                                
                                <div className="border-t border-gray-700 pt-4 mt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{(totalAmount + 40 + totalAmount * 0.05).toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                <Link 
                                    href="/shop/checkout"
                                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-4"
                                >
                                    Proceed to Checkout
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
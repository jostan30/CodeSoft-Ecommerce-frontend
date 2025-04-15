'use client'

import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { toast } from "sonner";

interface RazorpayResponse {
    razorpay_payment_id: string; 
    razorpay_order_id: string;
    razorpay_signature: string;
}

const Checkout = () => {
    const token = useAuth();
    const [role ,setRole] =useState(''); 
    const { items, getTotal, clearCart } = useCartStore();
    const [isClient, setIsClient] = useState(false);
    const [formData, setFormData] = useState({
        street: '',
        state: '',
        city: '',
        zipcode: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [storeName ,setStoreName] =useState(''); 
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');

    const totalAmount = getTotal();
    const shipping = 40;
    const tax = totalAmount * 0.05;
    const finalAmount = totalAmount + shipping + tax;

    // Hydration fix for server/client mismatch with localStorage
    useEffect(() => {
        setIsClient(true);

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        // Get user ID - replace with your actual auth method
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRole(response.data.user.role); // Assuming the response contains user role
                setName(response.data.user.name); // Assuming the response contains user name
                setEmail(response.data.user.email); // Assuming the response contains user email
                setContact(response.data.user.phone); // Assuming the response contains user contact number
                setStoreName(response.data.user.storeName); // Assuming the response contains storeName
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Initialize Razorpay payment
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Format the cart items for the order
    const formatOrderItems = () => {
        return items.map(item => ({
            name: item.name,
            quantity: item.selectedQuantity,
            image: item.image,
            price: item.price,
            product: item._id
        }));
    };
   
    // Handle form submission and payment
    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Create order in your database
            if (!token) {
                alert('Please login to continue');
                router.push('/login');
                return;
            }
            if(role === "seller") {
                toast.error("You are not authorized to place an order as a seller.");
                setIsLoading(false);
                return;
            }

            const orderData = {
                orderItems: formatOrderItems(),
                shippingAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipcode
                },
                taxPrice: tax,
                shippingPrice: shipping,
                totalPrice: finalAmount
            };

            console.log('Order Data:', orderData);

            const orderResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/`,
                orderData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
           
            const orderId = orderResponse.data.data._id;
          
            // Step 2: Load Razorpay SDK
            const res = await loadRazorpayScript();

            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                setIsLoading(false);
                return;
            }

            // Step 3: Get Razorpay key
            const keyRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/key`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
           
            const razorpayKey = keyRes.data.key;

            // Step 4: Create Razorpay order
            const orderRes = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/create-order`,{
                amount: finalAmount,
                currency: 'INR',
                receipt: orderId,
            },{
                headers:{
                    Authorization: `Bearer ${token}`
                },
            });

            const { id: razorpay_order_id, amount, currency } = orderRes.data;

            // Step 5: Initialize Razorpay checkout
            const options = {
                key: razorpayKey,
                amount: amount,
                currency: currency,
                name: storeName, 
                description: 'Purchase of grocery items',
                order_id: razorpay_order_id,
                handler: async (response: RazorpayResponse) => {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                    // Step 6: Verify payment
                    try {
                        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/verify`, {
                            razorpay_payment_id,
                            razorpay_order_id,
                            razorpay_signature,
                            orderId: orderId
                        },{
                            headers:{
                                Authorization: `Bearer ${token}`
                            }
                        });

                        // Step 7: Clear cart and redirect to success page
                        clearCart();
                        toast.success('Payment successful!');
                        router.push(`/shop/order`);
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: name, // You can add these fields to your form if needed
                    email: email,
                    contact: contact
                },
                theme: {
                    color: '#3B82F6' // Blue color to match your UI
                },
                modal: {
                    ondismiss: function() {
                        setIsLoading(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error("Payment process failed:", error);
            alert("Payment process failed. Please try again later.");
            setIsLoading(false);
        }
    };

    // Form validation
    const validateForm = () => {
        const { street, city, state, zipcode } = formData;

        if (!street || !city || !state || !zipcode) {
            alert("Please fill in all required fields");
            return false;
        }

        if (zipcode.length !== 6) {
            alert("Please enter a valid ZIP code");
            return false;
        }

        return true;
    };

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
                    <h1 className="text-3xl font-bold mb-8 text-blue-400">Checkout</h1>
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H15m1-4.5H5.4M7 13L4.7 6.3c-.2-.7.1-1.3.8-1.3H18c.6 0 1.1.4 1.3 1L21 10" />
                        </svg>
                        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-6">Add some products to your cart before proceeding to checkout</p>
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
                <h1 className="text-3xl font-bold mb-8 text-blue-400">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                            <form onSubmit={handlePayment}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="street" className="block text-sm font-medium text-gray-400 mb-1">Street </label>
                                        <input
                                            type="text"
                                            id="street"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-1">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-400 mb-1">State </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                  
                                    <div>
                                        <label htmlFor="zipcode" className="block text-sm font-medium text-gray-400 mb-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            id="zipcode"
                                            name="zipcode"
                                            value={formData.zipcode}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay ₹${finalAmount.toFixed(2)}`
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between">
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
                                                <p className="text-sm text-gray-400">Qty: {item.selectedQuantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">₹{(item.price * item.selectedQuantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-700 pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-gray-400">Subtotal</p>
                                    <p>₹{totalAmount.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-400">Shipping</p>
                                    <p>₹{shipping.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-400">Tax (5%)</p>
                                    <p>₹{tax.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                                    <p className="font-semibold">Total</p>
                                    <p className="font-semibold text-blue-400">₹{finalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link href="/cart" className="block text-center text-gray-300 underline hover:text-blue-400">
                                    Return to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
'use client';

import React from 'react';
import axios from 'axios';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};


const RazorpayTest = () => {
    const handlePayment = async () => {
        const backendUrl = 'http://localhost:5050';
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }
        try {
            // 1. Get Razorpay public key
            const keyRes = await axios.get(`${backendUrl}/api/payments/key`);
            const razorpayKey = keyRes.data.key;
            //order id
            const mongodborderid = '67effdc4d89597df2a8df3b6';

            // 2. Create order on backend
            const orderRes = await axios.post(`${backendUrl}/api/payments/create-order`, {
                amount: 5,
                currency: 'INR',
                receipt: mongodborderid,
            });
            const { id: razorpay_order_id, amount, currency } = orderRes.data;

            // 3. Open Razorpay checkout
            const options = {
                key: razorpayKey,
                amount: amount,
                currency: currency,
                name: 'Test Payment',
                description: 'Testing Razorpay Integration',
                order_id: razorpay_order_id,
                handler: async (response: any) => {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                    // 4. Send verification request to backend
                    await axios.post(`${backendUrl}/api/payments/verify`, {
                        razorpay_payment_id,
                        razorpay_order_id,
                        razorpay_signature,
                        orderId: mongodborderid // or your own order's Mongo _id if different
                    });
``
                    alert('Payment verified!');
                },
                prefill: {
                    name: 'Test User',
                    email: 'test@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#3399cc'
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <button
                onClick={handlePayment}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
                Pay ₹5.00
            </button>
        </div>
    );
};

export default RazorpayTest;

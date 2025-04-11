'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from "@/lib/cart-store";

const UserNavbar = () => {
  const {  getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <nav className="border-b dark:border-[#333] bg-white dark:bg-[#1a1a1a]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#737373] dark:text-[#737373]">
          Shopverse
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/shop/order">
            <Button variant="ghost" className="text-[#737373] dark:text-[#737373] cursor-pointer">
              Orders
            </Button>
          </Link>
          <Link href="/shop/cart" className="relative">
            <div className="p-2 bg-gray-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
export default UserNavbar;
'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-white">
              FutureShop
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Shop</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Categories</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="relative text-gray-300 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-gray-900/95"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Home</a>
          <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Shop</a>
          <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Categories</a>
          <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">About</a>
          <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Contact</a>
        </div>
        <div className="px-5 py-3 border-t border-gray-700 flex justify-around">
          <button className="text-gray-300 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button className="relative text-gray-300 hover:text-white transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
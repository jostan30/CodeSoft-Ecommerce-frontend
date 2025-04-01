'use client'
import React from 'react';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sale</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Collections</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; 2024 Your Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
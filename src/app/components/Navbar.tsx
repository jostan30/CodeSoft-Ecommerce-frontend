'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Auth } from './Auth';
import { Dialog, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogContent } from '@/components/ui/dialog';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  //  Check for if  Logged in or not
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoggedIn(false);
          return;
        }
        const response = await axios.get("http://localhost:5050/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsLoggedIn(response.data.success);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
  
    checkLoginStatus();
  }, []);
  

  return (
    <nav className="fixed w-screen z-50 bg-gray-900/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">ShopVerse</Link>
          </div>

        

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
         
            {
              isLoggedIn ? (<>
                <button className="text-gray-300 hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </button>
                
              </>
              ) : (
                <Dialog>
                  <DialogTitle></DialogTitle>
                <DialogTrigger asChild>
                  <Button variant="outline" className='bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer'>
                    Login/Signup
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] justify-center">
                  <Auth/>
                </DialogContent>
              </Dialog>

              )
            }

          
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
      
        <div className="px-5 py-3 border-t border-gray-700 flex justify-around">
       
          {
            isLoggedIn ? (
              <button className="text-gray-300 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className='bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300'>
                    Login/Signup
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <Auth/>
                </DialogContent>
              </Dialog>



            )
          }
        
        </div>
      </motion.div>
    </nav>
  );
}

function async() {
  throw new Error('Function not implemented.');
}

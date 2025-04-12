'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/lib/useAuth";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";
import { toast } from "sonner";

interface Product {
    _id: string
    name: string
    price: number
    originalPrice?: number
    category: string
    quantity: number
    description: string
    image?: string
    brand?: string
    unit?: string
    weight?: string
    discount?: number
}

const Shop = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const token = useAuth();
    
    // Cart functionality
    const { addToCart, items } = useCartStore();


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
                    headers: {  
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Adding some sample data for demonstration
                const processedData = res.data.data.map((product: Product) => {
                    // Calculate a random discount between 5% and 30% for demo purposes
                    const discount = Math.floor(Math.random() * 26) + 5;
                    const originalPrice = parseFloat((product.price * (100 / (100 - discount))).toFixed(2));
                    
                    return {
                        ...product,
                        originalPrice,
                        discount,
                        unit: product.unit || "pc",
                        weight: product.weight || `(approx. ${Math.floor(Math.random() * 200) + 400} to ${Math.floor(Math.random() * 200) + 600} g)`
                    };
                });
                
                setProducts(processedData);
                setError(null);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    // Get unique categories
    const categories = ["All", ...new Set(products.map(product => product.category))];

    // Filter products based on search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Check if product is in cart
    const isInCart = (productId: string) => {
        return items.some(item => item._id === productId);
    };

    // Get quantity of product in cart
    const getCartQuantity = (productId: string) => {
        const item = items.find(item => item._id === productId);
        return item ? item.selectedQuantity : 0;
    };

    const handleAddToCart = (product: Product) => {
        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            image: product.image,
            brand: product.brand
        });
        toast.success(`${product.name} added to cart!`, {
            duration: 3000,
            description: `You have added ${product.name} to your cart.`,
            action: {
                label: 'View Cart',
                onClick: () => window.location.href = '/shop/cart'
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="bg-gray-800 p-4 rounded-md border border-red-500">
                    <p className="text-red-400">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200">
            <div className="container mx-auto px-4 py-8">
              
                {/* Search and Filter */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        />
                    </div>
                    
                    <div className="w-full md:w-1/3">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-400">No products found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 relative">
                                {/* Discount tag */}
                                {product.discount && (
                                    <div className="absolute top-0 left-0 bg-blue-600 text-white px-2 py-1 rounded-tr-lg rounded-bl-lg z-10 font-semibold text-sm">
                                        {product.discount}% OFF
                                    </div>
                                )}
                                
                                {/* Product image */}
                                <div className="h-48 bg-gray-700 flex items-center justify-center p-2">
                                    {product.image ? (
                                        <img 
                                        src={`data:image/jpeg;base64,${product.image}`}
                                            alt={product.name} 
                                            className=" object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-500">No image available</div>
                                    )}
                                </div>
                                
                                {/* Product info */}
                                <div className="p-4">
                                    {/* Brand */}
                                    <p className="text-blue-400 text-sm mb-1">{product.brand}</p>
                                    
                                    {/* Product name */}
                                    <h2 className="text-lg font-semibold text-gray-100 mb-2">{product.name}</h2>
                                    
                                    {/* Quantity/Weight info */}
                                    <div className="bg-gray-700 px-3 py-2 rounded mb-3">
                                        <p className="text-sm text-gray-300">1 {product.unit} {product.weight}</p>
                                    </div>
                                    
                                    {/* Price section */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xl font-bold text-white">₹{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-gray-400 line-through text-sm">₹{product.originalPrice.toFixed(2)}</span>
                                        )}
                                    </div>
                                    
                                    {/* Action buttons */}
                                    <div className="flex gap-2">
                                        
                                        
                                        {isInCart(product._id) ? (
                                            <Link href="/shop/cart" className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center">
                                                <span>In Cart ({getCartQuantity(product._id)})</span>
                                            </Link>
                                        ) : (
                                            <button 
                                                className="flex-1 bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-gray-200 transition cursor-pointer"
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.quantity <= 0}
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Shop;
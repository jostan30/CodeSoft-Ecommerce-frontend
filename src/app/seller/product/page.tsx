"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MoreHorizontal, Plus } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { useAuth } from "@/lib/useAuth"
import DeleteProduct from "@/app/components/DeleteProduct"
import UpdateProduct from "@/app/components/UpdateProduct"

interface Product {
  _id: string
  name: string
  price: number
  category: string
  quantity: number
  description: string
  image?: string

}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const token = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/userproduct`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        if(res.data.success) {
          setProducts(res.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch products", err)
      }
    }

    fetchProducts()
    if(products.length !== 0) {
        window.location.reload();

    }
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/seller/product/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="my-6">
        <Input placeholder="Search products..." className="max-w-sm" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
     
          { 
          products.length === 0 ? (
            <TableRow >
              <TableCell colSpan={6} className="text-center">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product: Product) => (
            <TableRow className="cursor-pointer" key={product._id}>
              <TableCell>
                {
                  product.image ? (

                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.name}
                      className="h-30 w-30 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded" />
                  )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>Rs {product.price.toFixed(2)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <DropdownMenu >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost"  size="sm" className="cursor-pointer">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      {/* UpdateProduct component */}
                      <UpdateProduct  product={product} />
                    </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                         {/* DeleteProduct component */}
                        <DeleteProduct productid={product._id}/>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
          )
         
          }
        </TableBody>
      </Table>
    </div>
  )
}

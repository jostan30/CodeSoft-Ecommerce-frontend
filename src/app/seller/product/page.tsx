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
import Image from "next/image"

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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/products", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        if(res.data.status === "success") {
          setProducts(res.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch products", err)
      }
    }

    fetchProducts()
  }, [token])

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
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product: Product) => (
            <TableRow key={product._id}>
              <TableCell>
                {
                  product.image ? (

                    <Image
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
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">Update</DropdownMenuItem>
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

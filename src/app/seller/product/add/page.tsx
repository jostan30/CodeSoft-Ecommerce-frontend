"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { toast } from "sonner"
import { useAuth } from "@/lib/useAuth"



export default function AddProductPage() {
  const router = useRouter()
  const token = useAuth()

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("quantity", stock)
      formData.append("description", description)
      if (image) formData.append("image", image)

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      if (res.data.success) {
        toast.success("Success", {
          description: "Product has been added successfully.",
        })
      }

      router.push("/seller/product")
    } catch (error) {
      console.error(error)
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md border bg-white dark:bg-[#1a1a1a] text-[#737373] border-[#737373] dark:border-[#737373] dark:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#737373] "
              >
                <option value="" disabled>Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" value={stock} onChange={e => setStock(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} required />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="cursor-pointer">
                {loading ? "Adding..." : "Add Product"}
              </Button>
              <Button className="cursor-pointer" type="button" variant="outline" onClick={() => router.push("/seller/products")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/lib/useAuth"
import axios from "axios"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

interface Product {
    _id: string
    name: string
    price: number
    category: string
    quantity: number
    description: string
    image?: string
}

const UpdateProduct = ({ product }: { product: Product }) => {
    const token = useAuth()

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(product.name)
    const [price, setPrice] = useState(product.price.toString())
    const [category, setCategory] = useState(product.category)
    const [stock, setStock] = useState(product.quantity.toString())
    const [description, setDescription] = useState(product.description)
    const [image, setImage] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(`data:image/jpeg;base64,${product.image}` || null)



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setImage(file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setPreviewImage(null)
        }
    }

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

            const res = await axios.put(`http://localhost:5050/api/products/${product._id}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            console.log(res)
            if (res.data.success) {
                toast.success("Success", {
                    description: "Product has been updated successfully.",
                })
            }
            window.location.reload()
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
        <Sheet  >
            <SheetTrigger asChild>
                <Button variant="ghost">Update</Button>
            </SheetTrigger>
            <SheetContent className=" px-2 overflow-y-auto" >
                <SheetHeader>
                    <SheetTitle>Update Product Details</SheetTitle>
                    <SheetDescription>
                        Modify the product fields below and click &ldquo;Save changes&ldquo;.
                    </SheetDescription>
                </SheetHeader>
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
                        <Input id="category" name="category" value={category} onChange={e => setCategory(e.target.value)} required />
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
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setImage(file);
                                handleImageChange(e); // Pass the event to the preview handler
                            }}
                        />
                        {previewImage && (
                            <div className="mt-2">
                                <img
                                    src={`${previewImage}`}
                                    alt="Preview"
                                    width={200}
                                    height={200}
                                    className="rounded-md border"
                                />
                            </div>
                        )}

                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Saving Changes"}
                        </Button>

                    </div>
                </form>
                <SheetFooter>
                    <SheetClose asChild>

                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default UpdateProduct

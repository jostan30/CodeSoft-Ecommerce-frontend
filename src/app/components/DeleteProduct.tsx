import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/useAuth";
import axios from "axios";
import { toast } from "sonner";

const DeleteProduct = (productid :{productid:string}) => {
    const token = useAuth();
    const productId = productid.productid;
    
    const deleteproduct = async ()=>{
        try {
          
            const res = await axios.delete(`http://localhost:5050/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(res.data.success) {
                toast.success("Product deleted successfully")
            }
        } catch (error) {
            toast.error("Failed to delete product")
            console.error("Error deleting product:", error);
        }
    }
    return (
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="text-red-500">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
                <Button onClick={deleteproduct}>Continue</Button>                
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}

export default DeleteProduct;
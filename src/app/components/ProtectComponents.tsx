"use client";

import { useAuth } from "@/lib/useAuth"; // Assuming useAuthToken is the correct hook
import { toast } from "sonner";

const ProtectedComponent = ({ children }: { children: React.ReactNode }) => {
  const token = useAuth() 
    console.log("ProtectedComponent Token: ", token); 
 

  if (!token)  {
        toast.error("Please login to access this page.",{duration:3000});
        setTimeout(()=>{
            if (typeof window === "undefined") return;
            window.location.href = "/";
        },3000);
    }

  return <>{children}</>;
};

export default ProtectedComponent;

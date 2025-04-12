// app/become-seller/page.tsx
"use client";

import { useState } from "react";
import { ChevronRight, DollarSign, BarChart, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";

export default function BecomeSeller() {
  const [submitted, setSubmitted] = useState(false);
  const token = useAuth();
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const store = formData.get("store");
        const description = formData.get("description");
        console.log(store, description);

      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/becomeseller`,{ storeName:store, description:description },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const name = response.data.user.name;
        toast.success(`Hello ${name} your application submitted successfully!`, { duration: 3000});
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
    } catch (error) {
        toast.error("Error submitting application. Please try again.", { duration: 3000});
        console.log(error);
    }
  
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 max-w-6xl mx-auto px-7">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
          Turn Your Passion Into Profit
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl">
          Join thousands of successful entrepreneurs who have transformed their skills and products into thriving businesses on our marketplace.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {submitted ? (
              <Alert className="bg-emerald-900/30 border-emerald-600 mb-6">
                <AlertTitle className="text-emerald-400">Application received!</AlertTitle>
                <AlertDescription>
                  Thanks for applying to become a seller. We&apos;ll review your information and get back to you within 24 hours.
                </AlertDescription>
              </Alert>
            ) : null}
            
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl">Seller Application</CardTitle>
                <CardDescription className="text-slate-400">
                  Start your journey as a seller in just a few steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
 
                    <div className="grid gap-3">
                      <Label htmlFor="store">Store Name</Label>
                      <Input 
                        id="store" 
                        name="store"
                        placeholder="Enter your store name" 
                        className="bg-slate-800 border-slate-700 focus-visible:ring-purple-500"
                        required
                      />
                      <p className="text-xs text-slate-400">This will be displayed to customers</p>
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="description">Tell us about what you&apos;ll be selling</Label>
                      <textarea 
                        id="description" 
                        name="description"
                        rows={4}
                        placeholder="Describe your products or services..." 
                        className="flex min-h-20 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" className="data-[state=checked]:bg-purple-500" required />
                      <label htmlFor="terms" className="text-sm text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I agree to the terms and conditions
                      </label>
                    </div>
                  </div>
                  <Button  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                    Submit Application <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Side Content */}
          <div className="lg:col-span-2">
            {/* Benefits */}
            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader>
                <CardTitle>Why Sell With Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 bg-purple-500/20 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-slate-100">Competitive Fees</h3>
                    <p className="text-sm text-slate-400">Only 5% commission on each sale, lower than industry average</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-cyan-500/20 p-2 rounded-full">
                    <Globe className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-slate-100">Global Reach</h3>
                    <p className="text-sm text-slate-400">Access millions of customers worldwide with our platform</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-emerald-500/20 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-slate-100">Analytics Dashboard</h3>
                    <p className="text-sm text-slate-400">Track performance with detailed sales analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-amber-500/20 p-2 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-slate-100">Secure Payments</h3>
                    <p className="text-sm text-slate-400">Receive payments quickly and securely</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial */}
            <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent"></div>
              <CardHeader>
                <CardTitle className="text-lg">Seller Success Story</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <blockquote className="italic text-slate-300">
                &quot;I started selling my handcrafted items as a side hustle, and within 6 months I was able to quit my day job. The platform&apos;s tools made scaling my business incredibly easy.&quot;
                </blockquote>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-slate-700"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-slate-400">Artisan Crafts • Seller since 2023</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-slate-400">Earning $12,000+ monthly</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
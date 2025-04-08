"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

export function Auth() {
  // State for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State for signup
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      
      const res = await axios.post("http://localhost:5050/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      toast("Login success");

      // Handle redirect or session here
      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error("Login error",{duration: 3000 });
        console.error("Login failed:",err);
      } else {
        toast.error("Login error",{duration: 3000 });
      }
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5050/api/auth/register", signupData);
      if(res.data.success) {
        toast("Signup success",{description:"Login now!!" ,duration: 3000 });
        }
      
    } catch (err) {
      if(axios.isAxiosError(err)) {
        toast.error("Signup failed:",{duration: 3000 });
        console.error("Signup failed:",err);
      } else {
        toast.error("Signup failed:",{duration: 3000 });
      }
    }
  };

  return (
    <Tabs defaultValue="login" className="w-[400px] mx-auto">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signUp">Sign Up</TabsTrigger>
      </TabsList>

      {/* Login Tab */}
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full cursor-pointer" onClick={handleLogin}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Sign Up Tab */}
      <TabsContent value="signUp">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                type="tel"
                value={signupData.phone}
                onChange={(e) =>
                  setSignupData({ ...signupData, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input
                value={signupData.address}
                onChange={(e) =>
                  setSignupData({ ...signupData, address: e.target.value })
                }
                placeholder="Your address"
              />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full cursor-pointer" onClick={handleSignup}>
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Package, ShoppingCart, LayoutDashboard, Settings } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'
import { useEffect, useState } from 'react'
import axios from 'axios'

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/seller",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/seller/product",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/seller/order",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    href: "/seller/setting",
    icon: Settings,
  },
]

const SidebarSeller = () => {
  const pathname = usePathname()
  const token = useAuth()
  const [shopName, setShopName] = useState("");

  useEffect(() => {

    const fetchName = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        setShopName(res.data.user.storeInfo.storeName)   
      } catch (error) {
       console.error("Failed to fetch shop name", error) 
      }
    }
    fetchName()
  }, [])
  return (
    <div className="flex h-screen border-r">
      <div className="flex w-64 flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/seller" className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="font-bold">{
              shopName !== "" ? shopName : "Seller Panel"
            }</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-muted"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default SidebarSeller;
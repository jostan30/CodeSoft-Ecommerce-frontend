"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Package, ShoppingCart, LayoutDashboard, Settings, Users } from 'lucide-react'

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
    title: "Customers",
    href: "/seller/customer",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/seller/setting",
    icon: Settings,
  },
]

const  SidebarSeller=()=> {
  const pathname = usePathname()

  return (
    <div className="flex h-screen border-r">
      <div className="flex w-64 flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/seller" className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="font-bold">Seller Panel</span>
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
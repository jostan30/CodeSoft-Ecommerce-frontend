"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const RecentOrders =() => {
  return (
    <div className="space-y-8">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={order.avatar} alt="Avatar" />
            <AvatarFallback>{order.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.name}</p>
            <p className="text-sm text-muted-foreground">
              {order.email}
            </p>
          </div>
          <div className="ml-auto font-medium">+${order.amount}</div>
        </div>
      ))}
    </div>
  )
}

const recentOrders = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    amount: "250.00",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    amount: "150.00",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    amount: "299.99",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@example.com",
    amount: "175.50",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  }
]



export default RecentOrders;
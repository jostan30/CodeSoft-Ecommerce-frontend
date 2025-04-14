'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/useAuth"
import { toast } from "sonner"
import axios from "axios"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react"


// Order structure used in "recentOrders"
export interface DashboardOrder {
  _id: string;
  createdAt: string;
  totalAmount: number;
  isPaid: boolean;
  isDelivered: boolean;
}

// Product structure used in "topSellingProducts"
export interface TopSellingProduct {
  _id: string;
  name: string;
  price: number;
  totalSold: number;
  totalRevenue: number;
  image?: string; // base64 or Buffer image from backend
}

// Revenue chart data
export interface RevenueChartEntry {
  name: string; // e.g. "Jan", "Feb"
  revenue: number;
}

// API response from GET /api/seller/stats
export interface SellerDashboardStats {
  totalRevenue: number;
  revenueChange: number;
  monthlyRevenue: RevenueChartEntry[];

  totalOrders: number;
  recentOrdersCount: number;
  recentOrders: DashboardOrder[];

  totalProducts: number;
  newProductsCount: number;
  topSellingProducts: TopSellingProduct[];

  activeUsers: number;
}

interface OverviewProps {
  data: RevenueChartEntry[];
}

interface RecentOrdersProps {
  orders: DashboardOrder[];
}


// Component for the overview chart
const Overview: React.FC<OverviewProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-4 md:p-6 w-full h-[400px] " >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Revenue Overview</h2>
      <ResponsiveContainer width="100%" height="100%" >
        <LineChart data={data} >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"  />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            formatter={(value) => `Rs${value}`} 
            contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", border: "none" }} 
            labelStyle={{ color: "#f1f5f9" }} 
            itemStyle={{ color: "#fbbf24" }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 4, stroke: "#3b82f6", fill: "#fff"  }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Component for recent orders
const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Order #{order._id.substring(0, 8)}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">${order.totalAmount.toFixed(2)}</p>
            <div className={`h-2 w-2 rounded-full ${order.isDelivered ?
              'bg-green-500' :
              (order.isPaid ? 'bg-yellow-500' : 'bg-red-500')
              }`} />
          </div>
        </div>
      ))}
    </div>
  );
};

const SellerDashboard = () => {
  const token = useAuth();
  const [stats, setStats] = useState<SellerDashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    monthlyRevenue: [],
    totalOrders: 0,
    recentOrdersCount: 0,
    recentOrders:[],
    totalProducts: 0,
    newProductsCount: 0,
    topSellingProducts: [],
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seller/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        setStats(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching dashboard statistics");
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              {stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recentOrdersCount} in last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newProductsCount} new in last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active buyers in last 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={stats.monthlyRevenue} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={stats.recentOrders} />
          </CardContent>
        </Card>
      </div>

      {/* Top selling products section */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topSellingProducts.map(product => (
              <div key={product._id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-3">
                  {product.image && (
                    <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                      <img
                        src={`data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}`}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Rs {product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{product.totalSold} sold</p>
                    <p className="text-xs text-muted-foreground">Rs {product.totalRevenue.toFixed(2)} revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDashboard;
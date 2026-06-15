"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Calendar, Eye, AlertCircle, ShoppingBag, ArrowRight } from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderNumber?: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const verifyRes = await fetch("/api/auth/verify");
        if (!verifyRes.ok) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        const verifyData = await verifyRes.json();
        if (!verifyData.authenticated) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        setAuthenticated(true);

        const ordersRes = await fetch("/api/user/orders");
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load order history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium tracking-wide">Loading order history...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated State
  if (authenticated === false) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center px-6 font-sans">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-sm rounded-2xl border border-black/[0.04] p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#0f3a2a]/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-[#0f3a2a] stroke-[1.2]" />
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#0f3a2a] mb-3">
            My Orders
          </h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Please log in to view your order history, manage delivery details, and inspect logistics updates.
          </p>
          <Link
            href="/login?redirect=/orders"
            className="block w-full py-3.5 bg-[#0f3a2a] hover:bg-[#134a31] text-white text-sm font-semibold tracking-wider uppercase rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            Sign In to Thread-aura
          </Link>
        </div>
      </div>
    );
  }

  // Empty Orders State
  if (orders.length === 0) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center px-6 font-sans">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border border-black/[0.06] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-6 h-6 text-slate-400 stroke-[1.2]" />
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#0f3a2a] mb-3">
            No Orders Found
          </h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            You haven&apos;t placed any orders yet. Explore our handcrafted bangle collections to make your first purchase.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 border border-[#0f3a2a] text-[#0f3a2a] hover:bg-[#0f3a2a] hover:text-white text-xs font-semibold tracking-widest uppercase transition-all duration-200"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 border-green-200 text-green-700";
      case "Shipped":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "Processing":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "Pending":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "Cancelled":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  return (
    <div className="bg-[#F1EFE7] min-h-screen py-28 px-6 md:px-8 lg:px-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 border-b border-black/10 pb-6 text-center sm:text-left">
          <h1 className="font-serif text-[36px] md:text-[46px] text-[#0f3a2a] leading-none mb-4">
            Order History
          </h1>
          <p className="text-slate-500 text-sm">
            Review and track all your handcrafted orders from Thread-aura.
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="bg-white/60 backdrop-blur-sm border border-black/[0.04] rounded-2xl p-6 sm:p-8 hover:shadow-md transition-shadow flex flex-col gap-6"
            >
              
              {/* Top Meta info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Order Ref</span>
                    <span className="text-xs font-semibold text-[#0f3a2a] font-sans">{order.orderNumber || order._id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Date Placed</span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-sans mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Grand Total</span>
                    <span className="text-sm font-bold text-slate-850 font-sans mt-0.5">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Items row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                {/* Thumbnails of items */}
                <div className="flex -space-x-3 overflow-hidden">
                  {order.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="relative w-12 h-16 rounded border border-white overflow-hidden shadow bg-[#1f332a] flex-shrink-0"
                      title={`${item.name} (${item.size}) × ${item.quantity}`}
                    >
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-white/30">
                          Bangle
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-16 rounded border border-white bg-slate-800 text-white flex items-center justify-center text-xs font-bold font-sans shadow">
                      +{order.items.length - 3}
                    </div>
                  )}
                  
                  <div className="pl-6 flex flex-col justify-center">
                    <p className="text-xs font-medium text-slate-700 leading-snug">
                      {order.items[0].name} {order.items.length > 1 ? `and ${order.items.length - 1} other item(s)` : ""}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Total items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                  </div>
                </div>

                {/* Track Button */}
                <Link
                  href={`/orders/${order.orderNumber || order._id}`}
                  className="w-full sm:w-auto px-5 py-2.5 bg-transparent border border-[#0f3a2a] text-[#0f3a2a] hover:bg-[#0f3a2a] hover:text-white text-[11px] font-bold tracking-widest uppercase rounded transition-colors flex items-center justify-center gap-2 font-sans cursor-pointer whitespace-nowrap"
                >
                  <Eye className="w-4 h-4" />
                  Track Order
                </Link>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Check, 
  Clock, 
  Wrench, 
  Truck, 
  Home, 
  AlertTriangle 
} from "lucide-react";

interface TrackingUpdate {
  status: string;
  description: string;
  timestamp: string;
  _id: string;
}

interface OrderItem {
  product: {
    _id: string;
    bgColor?: string;
  };
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
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  trackingUpdates: TrackingUpdate[];
  items: OrderItem[];
}

interface OrderTrackingPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { orderId } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const verifyRes = await fetch("/api/auth/verify");
        if (!verifyRes.ok) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        setAuthenticated(true);

        const res = await fetch(`/api/user/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        } else {
          const errData = await res.json();
          setError(errData.error || "Failed to fetch order details.");
        }
      } catch (err) {
        console.error("Failed to load tracking order details:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium tracking-wide">Retrieving tracking timeline...</p>
        </div>
      </div>
    );
  }

  if (authenticated === false) {
    router.push(`/login?redirect=/orders/${orderId}`);
    return null;
  }

  if (error || !order) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 flex flex-col items-center justify-center text-center font-sans">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-[32px] text-slate-900 mb-4 capitalize">
          Failed to load order
        </h1>
        <p className="text-slate-600 max-w-md mb-8">
          {error || "The requested order details are not accessible or do not exist."}
        </p>
        <Link 
          href="/orders" 
          className="px-6 py-3 bg-[#0F3A2A] text-white text-[12px] font-bold tracking-widest uppercase hover:bg-[#134A31] transition-colors rounded-lg shadow font-sans"
        >
          View Order History
        </Link>
      </div>
    );
  }

  // Determine active steps for tracking timeline
  const stages = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStatus = order.orderStatus;
  const currentStepIndex = stages.indexOf(currentStatus === "Cancelled" ? "Pending" : currentStatus);

  const trackingTimeline = [
    {
      name: "Order Placed",
      status: "Pending",
      description: "We have received your order details.",
      icon: Clock,
    },
    {
      name: "Weaving Studio",
      status: "Processing",
      description: "Our master artisans are hand-weaving your pieces.",
      icon: Wrench,
    },
    {
      name: "In Transit",
      status: "Shipped",
      description: "Package handed over to our courier partner.",
      icon: Truck,
    },
    {
      name: "Delivered",
      status: "Delivered",
      description: "Bangles delivered and handed over safely.",
      icon: Home,
    },
  ];

  return (
    <div className="bg-[#F1EFE7] min-h-screen py-28 px-6 md:px-8 lg:px-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation back */}
        <Link 
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-black transition-colors mb-8 uppercase tracking-wider font-sans"
        >
          <ArrowLeft className="w-4.5 h-4.5" /> Back to History
        </Link>

        {/* Top Header details */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/10 pb-8 mb-10">
          <div>
            <h1 className="font-serif text-[32px] md:text-[42px] text-[#0f3a2a] leading-none mb-3">
              Track Order
            </h1>
            <p className="text-slate-500 text-xs font-sans">
              Order Reference ID: <span className="font-bold text-[#0f3a2a]">{order.orderNumber || order._id}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 font-sans">
            <div className="flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-slate-400" />
              <span>Ordered: {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
              order.orderStatus === "Delivered" 
                ? "bg-green-50 border-green-200 text-green-700" 
                : order.orderStatus === "Cancelled"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-amber-50 border-amber-200 text-amber-700"
            }`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* VISUAL TIMELINE PROGRESS */}
        {order.orderStatus === "Cancelled" ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-start gap-4 mb-10">
            <AlertTriangle className="w-6 h-6 text-red-650 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[13px] font-bold text-red-800 uppercase tracking-wider">Order Cancelled</h3>
              <p className="text-xs text-red-700 mt-1 leading-normal">
                This order was cancelled. Please check your email or contact client support for details.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-black/[0.04] p-6 sm:p-10 mb-10 shadow-sm">
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
              
              {/* Connecting progress line for desktop */}
              <div className="absolute left-6 top-6 bottom-6 md:left-10 md:right-10 md:top-[26px] md:bottom-auto w-[2px] md:w-auto md:h-[2px] bg-slate-200 pointer-events-none z-0">
                <div 
                  className="h-full md:h-full bg-[#0F3A2A] transition-all duration-500 ease-out"
                  style={{
                    height: window.innerWidth < 768 ? `${(currentStepIndex / (stages.length - 1)) * 100}%` : "100%",
                    width: window.innerWidth >= 768 ? `${(currentStepIndex / (stages.length - 1)) * 100}%` : "100%"
                  }}
                />
              </div>

              {/* Timeline nodes */}
              {trackingTimeline.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx <= currentStepIndex;
                const isActive = idx === currentStepIndex;

                return (
                  <div key={idx} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 md:text-center md:flex-1">
                    
                    {/* Node Circle */}
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted 
                        ? "bg-[#0F3A2A] border-[#0F3A2A] text-white" 
                        : "bg-white border-slate-200 text-slate-400"
                    } ${isActive ? "ring-4 ring-[#0F3A2A]/20" : ""}`}>
                      {isCompleted && !isActive ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Text labels */}
                    <div className="flex-1 md:flex-initial">
                      <h4 className={`text-[13px] font-bold uppercase tracking-wider ${
                        isCompleted ? "text-slate-800" : "text-slate-400"
                      }`}>{step.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug md:max-w-[150px] md:mx-auto">
                        {step.description}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        )}

        {/* SPLIT SECTION DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Shipping & Payment summaries */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Box: Shipping */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-black/[0.04] p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-[#0f3a2a] border-b border-black/5 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Address
              </h3>
              <div className="text-xs leading-relaxed text-slate-700">
                <p className="font-bold text-slate-800">{order.shippingDetails.name}</p>
                <p className="mt-1">{order.shippingDetails.address}</p>
                <p>{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.postalCode}</p>
                <p className="text-slate-500 mt-2 font-sans">📞 {order.shippingDetails.phone}</p>
                <p className="text-slate-500 font-sans">✉️ {order.shippingDetails.email}</p>
              </div>
            </div>

            {/* Box: Payment */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-black/[0.04] p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-[#0f3a2a] border-b border-black/5 pb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Billing Summary
              </h3>
              <div className="text-xs space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-semibold">{order.paymentMethod === "COD" ? "COD (Cash)" : "Razorpay"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                    order.paymentStatus === "Paid" 
                      ? "bg-green-50 border-green-200 text-green-700" 
                      : "bg-orange-50 border-orange-200 text-orange-700"
                  }`}>{order.paymentStatus}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between pt-1 border-t border-black/5">
                    <span className="text-slate-500">Tracking ID:</span>
                    <span className="font-bold text-slate-800 font-sans">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Logistics Log & Products List */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Timeline updates list */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-black/[0.04] p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-[#0f3a2a] border-b border-black/5 pb-2">
                Detailed Logistics Updates
              </h3>

              <div className="relative pl-6 border-l border-black/10 space-y-6 font-sans">
                {order.trackingUpdates.map((update, idx) => (
                  <div key={update._id || idx} className="relative">
                    {/* Node Dot */}
                    <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-[#0F3A2A] ring-4 ring-[#F1EFE7]" />
                    
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#0F3A2A] uppercase tracking-wider">
                        {update.status}
                      </span>
                      <p className="text-xs font-medium text-slate-800">
                        {update.description}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {new Date(update.timestamp).toLocaleString("en-IN", { 
                          dateStyle: "medium", 
                          timeStyle: "short" 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products inside order */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-black/[0.04] p-6 sm:p-8 space-y-4 shadow-sm font-sans">
              <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-[#0f3a2a] border-b border-black/5 pb-2">
                Order Items
              </h3>
              
              <div className="divide-y divide-black/5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div 
                      className="relative w-12 h-16 rounded overflow-hidden bg-[#1f332a] flex-shrink-0"
                      style={{ backgroundColor: item.product?.bgColor || "#1f332a" }}
                    >
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-semibold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#b13d33] font-bold uppercase mt-0.5">Size: {item.size}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-slate-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/10 pt-4 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Grand Total</span>
                <span className="text-sm font-bold text-[#0F3A2A] font-sans">₹{order.totalAmount.toFixed(2)}</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Package, Home, Calendar } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    async function fetchOrderDetails() {
      try {
        const res = await fetch(`/api/user/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to load successful order details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center">
        <div className="text-center font-sans">
          <div className="w-10 h-10 border-4 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium">Fetching order receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 md:px-8 lg:px-12 font-sans flex flex-col items-center">
      <div className="max-w-2xl w-full text-center">
        
        {/* Animated Check */}
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/25">
          <CheckCircle2 className="w-10 h-10 text-green-600 animate-bounce" />
        </div>

        <h1 className="font-serif text-[32px] md:text-[40px] text-[#0f3a2a] leading-none mb-3">
          Order Confirmed
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-10 leading-relaxed">
          Thank you for choosing Thread-aura. Your order for luxury handcrafted bangles has been placed and registered.
        </p>

        {order ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-black/[0.04] p-6 sm:p-8 text-left space-y-6 shadow-sm mb-10">
            
            {/* Quick Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Reference ID</p>
                <p className="text-sm font-semibold text-[#0f3a2a] font-sans mt-0.5">{order.orderNumber || order._id}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-right font-sans">
                <Calendar className="w-4 h-4" />
                <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Delivery Address</h4>
                <p className="text-xs font-semibold text-slate-800">{order.shippingDetails.name}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{order.shippingDetails.address}</p>
                <p className="text-xs text-slate-600 leading-normal">{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.postalCode}</p>
                <p className="text-xs text-slate-500 mt-1.5 font-sans">📞 {order.shippingDetails.phone}</p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payment selection</h4>
                <p className="text-xs font-semibold text-slate-800">
                  {order.paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Paid via Razorpay"}
                </p>
                <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                  order.paymentStatus === "Paid" 
                    ? "bg-green-50 border-green-200 text-green-700" 
                    : "bg-orange-50 border-orange-200 text-orange-700"
                }`}>
                  {order.paymentStatus === "Paid" ? "Payment Confirmed" : "Cash Pending"}
                </span>
                
                <div className="mt-4 pt-2 border-t border-black/5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grand Total</h4>
                  <p className="text-lg font-bold text-slate-800 mt-0.5 font-sans">₹{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Items review */}
            <div className="border-t border-black/5 pt-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Items Summary</h4>
              <div className="space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">
                      {item.name} <span className="font-bold text-[#b13d33] uppercase ml-1.5">({item.size})</span> × {item.quantity}
                    </span>
                    <span className="font-semibold text-slate-800 font-sans">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-150 mb-10 text-xs">
            We could not pull the detailed order receipt immediately. Rest assured your order is registered under reference ID: <span className="font-bold">{orderId}</span>.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Link
            href={`/orders/${order?.orderNumber || orderId}`}
            className="flex-1 py-3.5 bg-[#0f3a2a] hover:bg-[#134a31] text-white text-xs font-semibold tracking-widest uppercase rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
          >
            <Package className="w-4.5 h-4.5" />
            Track Logistics
          </Link>
          <Link
            href="/"
            className="flex-1 py-3.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold tracking-widest uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4.5 h-4.5 text-slate-500" />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F1EFE7] flex items-center justify-center">
          <div className="animate-pulse text-slate-400 text-sm font-sans">Loading receipt details...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

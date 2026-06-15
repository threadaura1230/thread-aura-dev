"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ChevronRight, Lock, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart, loading: cartLoading } = useCart();

  // Shipping Form State
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay">("Razorpay");
  const [submitting, setSubmitting] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Validate Authentication on Mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/verify");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setAuthenticated(true);
            // Pre-fill email and name from auth
            setShippingDetails((prev) => ({
              ...prev,
              email: data.user.email || "",
              name: data.user.name || "",
            }));
            setAuthLoading(false);
            return;
          }
        }
        setAuthenticated(false);
      } catch {
        setAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Inject Razorpay SDK script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Main Submit handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validations
    if (
      !shippingDetails.name ||
      !shippingDetails.email ||
      !shippingDetails.phone ||
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.state ||
      !shippingDetails.postalCode
    ) {
      alert("Please fill in all shipping details.");
      return;
    }

    setSubmitting(true);

    try {
      if (paymentMethod === "COD") {
        // Handle COD Checkout
        const res = await fetch("/api/checkout/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shippingDetails,
            items: cartItems,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          await clearCart();
          router.push(`/checkout/success?orderId=${data.orderId}`);
        } else {
          alert(data.error || "Failed to place COD order. Please try again.");
        }
      } else {
        // Handle Razorpay Checkout
        // 1. Load Razorpay Script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Failed to load payment portal. Please check your internet connection.");
          setSubmitting(false);
          return;
        }

        // 2. Initiate order on backend
        const orderRes = await fetch("/api/checkout/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
          alert(orderData.error || "Failed to initiate transaction.");
          setSubmitting(false);
          return;
        }

        // 3. Open Razorpay payment screen
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Thread Aura",
          description: "Artisanal Premium Bangles",
          order_id: orderData.orderId,
          handler: async function (response: any) {
            // Payment success handler - verify on backend
            setSubmitting(true);
            try {
              const verifyRes = await fetch("/api/checkout/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  shippingDetails,
                  items: cartItems,
                  mockMode: orderData.mockMode,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                await clearCart();
                router.push(`/checkout/success?orderId=${verifyData.orderId}`);
              } else {
                alert(verifyData.error || "Payment verification failed. Please contact support.");
              }
            } catch (err) {
              console.error(err);
              alert("Verification process failed. Please contact support.");
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name: shippingDetails.name,
            email: shippingDetails.email,
            contact: shippingDetails.phone,
          },
          theme: {
            color: "#0F3A2A",
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
            },
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error("Checkout process error:", error);
      alert("An error occurred during checkout. Please try again.");
    } finally {
      if (paymentMethod === "COD") {
        setSubmitting(false);
      }
    }
  };

  // Auth check loading state
  if (authLoading || cartLoading) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium tracking-wide">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  // Force login if unauthenticated
  if (authenticated === false) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-sm rounded-2xl border border-black/[0.04] p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#0f3a2a]/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#0f3a2a] stroke-[1.2]" />
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#0f3a2a] mb-3">
            Authentication Required
          </h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Please sign in to your account to review address options, select payments, and track order logistics.
          </p>
          <Link
            href="/login?redirect=/checkout"
            className="block w-full py-3.5 bg-[#0f3a2a] hover:bg-[#134a31] text-white text-sm font-semibold tracking-wider uppercase rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            Sign in and Continue
          </Link>
        </div>
      </div>
    );
  }

  // Handle empty cart
  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border border-black/[0.06] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-6 h-6 text-slate-400 stroke-[1.2]" />
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#0f3a2a] mb-3">
            Your Cart is Empty
          </h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Add some artisanal pieces to your bag before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 border border-[#0f3a2a] text-[#0f3a2a] hover:bg-[#0f3a2a] hover:text-white text-xs font-semibold tracking-widest uppercase transition-all duration-200"
          >
            Go Shop Collections
          </Link>
        </div>
      </div>
    );
  }

  const deliveryCharges = 0; // Free delivery
  const grandTotal = cartTotal + deliveryCharges;

  return (
    <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 md:px-8 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-black transition-colors mb-8 cursor-pointer uppercase tracking-wider"
        >
          <ArrowLeft className="w-4.5 h-4.5" /> Back
        </button>

        <h1 className="font-serif text-[32px] md:text-[42px] text-[#0f3a2a] leading-none mb-10">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Checkout Forms */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePlaceOrder}>
              
              {/* Box 1: Address */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-black/[0.04] p-6 sm:p-8 space-y-6 mb-6">
                <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                  <MapPin className="w-5 h-5 text-[#0f3a2a]" />
                  <h2 className="text-lg font-serif font-medium text-[#0f3a2a]">1. Location & Contact Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={shippingDetails.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={shippingDetails.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    placeholder="Flat/House no., Floor, Building, Street name"
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={shippingDetails.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={shippingDetails.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      value={shippingDetails.postalCode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN"
                      className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Box 2: Payment */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-black/[0.04] p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                  <CreditCard className="w-5 h-5 text-[#0f3a2a]" />
                  <h2 className="text-lg font-serif font-medium text-[#0f3a2a]">2. Payment selections</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Razorpay Option */}
                  <label 
                    onClick={() => setPaymentMethod("Razorpay")}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer bg-white ${
                      paymentMethod === "Razorpay" 
                        ? "border-[#0F3A2A] shadow-sm" 
                        : "border-black/[0.05] hover:border-black/[0.12]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === "Razorpay"}
                      readOnly
                      className="mt-1 accent-[#0F3A2A]"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900 leading-tight">Pay Online (Razorpay)</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        Pay securely using Credit Cards, Debit Cards, UPI, Netbanking, or Wallets.
                      </p>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label 
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer bg-white ${
                      paymentMethod === "COD" 
                        ? "border-[#0F3A2A] shadow-sm" 
                        : "border-black/[0.05] hover:border-black/[0.12]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === "COD"}
                      readOnly
                      className="mt-1 accent-[#0F3A2A]"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900 leading-tight">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        Pay cash directly to the delivery executive upon receiving your order package.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-4 bg-[#0F3A2A] hover:bg-[#134A31] disabled:bg-[#0F3A2A]/50 text-white text-[13px] font-bold tracking-widest uppercase rounded shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Place Order (₹{grandTotal.toFixed(2)})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 bg-white/60 backdrop-blur-sm rounded-xl border border-black/[0.04] p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-serif font-medium text-[#0f3a2a] border-b border-black/5 pb-4">
              Order Summary
            </h2>

            {/* Product items list */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3 pb-4 border-b border-black/5">
                  <div 
                    className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: item.bgColor || "#1f332a" }}
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
                    <h4 className="text-[12px] font-semibold text-slate-900 truncate leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Size: {item.size}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
                      {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-[12px] font-bold text-slate-800 font-sans">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations block */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2 font-sans">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-bold uppercase">Free</span>
              </div>
              <div className="border-t border-black/10 pt-4 flex justify-between text-sm">
                <span className="font-serif font-bold text-[#0f3a2a]">Total Amount</span>
                <span className="font-bold text-slate-900 text-[16px]">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed font-sans">
              <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
              <span>
                Your billing details are encrypted and securely processed. By finalizing your order, you agree to our Terms of Sale.
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

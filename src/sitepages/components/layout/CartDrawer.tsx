"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { cartItems, cartTotal, isOpen, closeCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out opacity-100" 
        onClick={closeCart}
      />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F1EFE7] shadow-xl flex flex-col h-full border-l border-black/5 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-6 border-b border-black/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0f3a2a]" />
              <h2 className="text-[18px] font-serif font-medium text-[#0f3a2a]">Shopping Bag</h2>
              <span className="text-[11px] bg-[#0f3a2a] text-white px-2 py-0.5 rounded-full font-sans font-bold">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button 
              onClick={closeCart}
              className="text-slate-500 hover:text-black transition-colors p-1 rounded-full hover:bg-black/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border border-black/10 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-6 h-6 stroke-[1.2]" />
                </div>
                <p className="text-[14px] font-serif font-medium text-[#0f3a2a]">Your bag is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                  Explore our luxury handcrafted bangles and add your favorites.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 border border-[#0f3a2a] text-[#0f3a2a] hover:bg-[#0f3a2a] hover:text-white text-[11px] font-bold tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Shop Collections
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-4 border-b border-black/5 pb-6">
                  
                  {/* Image container */}
                  <div 
                    className="relative w-20 h-24 rounded overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: item.bgColor || "#1f332a" }}
                  >
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/40 uppercase tracking-wider">
                        Bangle
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-[13px] font-medium text-slate-900 leading-snug">
                          <Link href={`/collections/${item.categorySlug}/${item.subCollectionSlug}/${item.slug}`} onClick={closeCart} className="hover:underline">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-[13px] font-semibold text-slate-900 font-sans">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-[11px] text-[#b13d33] font-bold tracking-wide uppercase mt-0.5">
                        Size: {item.size}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        ₹{item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="px-2 py-1 text-slate-500 hover:text-black transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-slate-800 font-sans min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-2 py-1 text-slate-500 hover:text-black transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-black/10 px-6 py-6 bg-white/40 backdrop-blur-sm space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="text-lg font-bold text-slate-900 font-sans">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Shipping and taxes calculated at checkout. Handcrafted orders typically ship in 3-5 business days.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-[#0F3A2A] hover:bg-[#134A31] text-white text-[12px] font-bold tracking-widest uppercase rounded shadow transition-all active:scale-[0.99] cursor-pointer"
                >
                  Checkout Now
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

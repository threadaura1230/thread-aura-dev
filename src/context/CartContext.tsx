"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  bgColor?: string;
  slug: string;
  categorySlug: string;
  subCollectionSlug: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isOpen: boolean;
  loading: boolean;
  addToCart: (product: any, size: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, size: string) => Promise<void>;
  updateQuantity: (productId: string, size: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  syncCartWithDB: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // Check user authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/verify");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setAuthenticated(true);
            return;
          }
        }
        setAuthenticated(false);
      } catch {
        setAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Load cart items on start
  useEffect(() => {
    if (authenticated === null) return;

    async function loadCart() {
      setLoading(true);
      // Retrieve guest cart from localStorage
      let localCart: CartItem[] = [];
      try {
        const stored = localStorage.getItem("thread_aura_cart");
        if (stored) {
          localCart = JSON.parse(stored);
        }
      } catch (err) {
        console.error("Failed to parse local cart:", err);
      }

      if (authenticated) {
        try {
          // Fetch user cart from database
          const res = await fetch("/api/user/cart");
          if (res.ok) {
            const data = await res.json();
            const dbCart: CartItem[] = data.cart || [];

            if (localCart.length > 0) {
              // Merge guest cart with db cart
              const merged = mergeCarts(dbCart, localCart);
              setCartItems(merged);
              localStorage.setItem("thread_aura_cart", JSON.stringify(merged));
              // Save merged cart to DB
              await saveCartToDB(merged);
              // Clear local storage guest cart
              localStorage.removeItem("thread_aura_cart");
            } else {
              setCartItems(dbCart);
            }
          } else {
            setCartItems(localCart);
          }
        } catch (err) {
          console.error("Failed to fetch DB cart, falling back to local:", err);
          setCartItems(localCart);
        }
      } else {
        setCartItems(localCart);
      }
      setLoading(false);
    }

    loadCart();
  }, [authenticated]);

  // Helper to merge two carts
  const mergeCarts = (cart1: CartItem[], cart2: CartItem[]): CartItem[] => {
    const merged = [...cart1];
    cart2.forEach((item2) => {
      const idx = merged.findIndex(
        (item1) => item1.productId === item2.productId && item1.size === item2.size
      );
      if (idx > -1) {
        merged[idx].quantity += item2.quantity;
      } else {
        merged.push(item2);
      }
    });
    return merged;
  };

  // Helper to save cart to DB
  const saveCartToDB = async (items: CartItem[]) => {
    if (!authenticated) return;
    try {
      await fetch("/api/user/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });
    } catch (err) {
      console.error("Error saving cart to DB:", err);
    }
  };

  const syncCartWithDB = async () => {
    try {
      const res = await fetch("/api/auth/verify");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
        }
      }
    } catch (err) {
      console.error("Verify failed during sync:", err);
    }
  };

  const addToCart = async (product: any, size: string, quantity: number = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === product.id && item.size === size
      );
      let updated: CartItem[];
      if (idx > -1) {
        updated = prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          size: size,
          quantity: quantity,
          image: product.images?.[0] || "",
          bgColor: product.bgColor,
          slug: product.slug,
          categorySlug: product.categorySlug || "collections",
          subCollectionSlug: product.subCollectionSlug || "general",
        };
        updated = [...prev, newItem];
      }

      if (authenticated) {
        saveCartToDB(updated);
      } else {
        localStorage.setItem("thread_aura_cart", JSON.stringify(updated));
      }
      return updated;
    });

    setIsOpen(true); // Open drawer on add
  };

  const removeFromCart = async (productId: string, size: string) => {
    setCartItems((prev) => {
      const updated = prev.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
      if (authenticated) {
        saveCartToDB(updated);
      } else {
        localStorage.setItem("thread_aura_cart", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateQuantity = async (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size);
      return;
    }
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      );
      if (authenticated) {
        saveCartToDB(updated);
      } else {
        localStorage.setItem("thread_aura_cart", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearCart = async () => {
    setCartItems([]);
    if (authenticated) {
      await saveCartToDB([]);
    } else {
      localStorage.removeItem("thread_aura_cart");
    }
  };

  const toggleCart = () => setIsOpen((prev) => !prev);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isOpen,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        syncCartWithDB,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

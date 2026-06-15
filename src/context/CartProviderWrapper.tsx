"use client";

import React from "react";
import { CartProvider } from "./CartContext";
import CartDrawer from "@/sitepages/components/layout/CartDrawer";

export default function CartProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}

"use client";

import { ShoppingCart } from "lucide-react";

export function EmptyCart() {
  return (
    <div
      className="flex flex-col items-center min-h-screen justify-center"

    >
      <ShoppingCart className="sm:w-16 sm:h-16 w-10 h-10 text-[#a88a7d] mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-1">
        Your cart is empty
      </h3>
      <p className="text-gray-500">Add some items to start shopping!</p>
    </div>
  );
}

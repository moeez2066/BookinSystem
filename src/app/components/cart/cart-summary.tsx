"use client";

import { Button } from "../ui/button";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";

interface CartSummaryProps {
  totalAmount: number;
  itemCount: number;
  onCheckout: () => void;
  isProcessing: any;
}

export function CartSummary({
  totalAmount,
  itemCount,
  onCheckout,
  isProcessing,
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#baada6]/20 Manrope p-6 sticky top-4">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="h-5 w-5 text-[#a88a7d]" />
        <h3 className="font-semibold text-gray-900">Order Summary</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium">SAR {totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>

        <div className="border-t border-dashed border-gray-200 pt-4">
          <div className="flex justify-between sm:text-lg font-semibold">
            <span>Total</span>
            <span>SAR {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button
        className={`w-full mt-6 h-12 ${
          isProcessing
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#a88a7d] hover:bg-[#97796c] text-white"
        }`}
        onClick={isProcessing ? undefined : onCheckout}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            Proceed to Checkout
            <Loader2 className="animate-spin ml-2 h-5 w-5" />
          </>
        ) : (
          <>
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-4">Secure checkout</p>
    </div>
  );
}

"use client";

import Image from "next/image";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface ProductCardProps {
  product: {
    _id: string;
    image: string;
    name: string;
    price: string;
    description: string;
    type: string;
  };
  onRemove: (id: string) => Promise<void>;
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

export function ProductCard({
  product,
  onRemove,
  onUpdateQuantity,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isRemoving, setIsRemoving] = useState(false); // Track loading state

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    onUpdateQuantity?.(product._id, newQuantity);
  };

  const handleRemoveClick = async () => {
    setIsRemoving(true); // Show loader
    try {
      await onRemove(product._id); // Call the remove function
    } catch (error) {
      console.error("Error removing product:", error);
      setIsRemoving(false); // Revert loading state on failure
    }
  };

  return (
    <div className="flex items-center sm:gap-4 gap-3 p-2 sm:p-6 bg-white rounded-xl shadow-sm border border-[#baada6]/20  duration-200">
      <div className="relative h-32 w-32 rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transform hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold Manrope text-[#473a3a] text-xs  sm:text-lg">
              {product.name}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-[#efede9] text-[#a88a7d]">
              {product.type}
            </span>
          </div>
          <span className="font-semibold text-xs  sm:text-lg text-nowrap Manrope text-[#473a3a] ">
            SAR {product.price}
          </span>
        </div>
        <p className="sm:text-sm text-xs text-[#473a3a] Helvetica">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              className="sm:h-8 sm:w-8 w-6 h-6"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-medium Manrope text-xs sm:text-base text-[#473a3a] ">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="sm:h-8 sm:w-8 w-6 h-6"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {isRemoving ? (
            <div className="flex items-center justify-center">
              <Loader2 className="sm:h-6 sm:w-6 h-4 w-4 mr-4 sm:mr-0 text-red-500 animate-spin my-2" />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleRemoveClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:block">Remove</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

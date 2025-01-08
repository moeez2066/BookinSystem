"use client";

import Link from "next/link";
import { Truck, ArrowRight, PackageCheck } from "lucide-react";
import Image from "next/image";
import { Button } from "../components/ui/button";

export default function OrderConfirmation() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-20 px-4 sm:px-6 lg:px-8 Manrope">
      <div className="max-w-3xl mx-auto">
        {/* Success Message with Animation */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <Image
              src="https://cdn.dribbble.com/users/4358240/screenshots/14825308/media/84f51703b2bfc69f7e8bb066897e26e0.gif"
              alt="Order Success"
              width={128}
              height={128}
              className="rounded-full"
            />
          </div>
          <h1 className="sm:text-3xl text-2xl font-bold text-[#473a3a] -900 mb-2">
            Thank you for your order!
          </h1>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <PackageCheck className="h-6 w-6 text-[#a88a7d]" />
            <div>
              <h2 className="font-semibold text-[#473a3a] -900">
                Order Confirmed
              </h2>
              <p className="text-sm text-[#473a3a] -600 Helvetica">
                Order will be delivered at your door step.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-[#a88a7d]" />
              <span className="text-[#473a3a]">
                Estimated delivery: 3-5 business days
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="flex-1 sm:flex-initial">
            <Button className="w-full bg-[#a88a7d] hover:bg-[#97796c] text-white">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-[#473a3a] -500 mt-8">
          Need help? Contact
          <Link href="/contact" className="text-[#a88a7d] hover:underline">
            &nbsp; shaped@shaped.com
          </Link>
        </p>
      </div>
    </div>
  );
}

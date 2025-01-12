"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Package2,
  Calendar,
  User,
  Mail,
  Phone,
  ShoppingBag,
  Loader2,
  ShoppingCart,
  ShoppingCartIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../components/ui/card";
import { Badge } from "./../components/ui/badge";
import { Separator } from "./../components/ui/separator";
import { Spin } from "antd";

const PurchasedProducts = () => {
  const [orders, setOrders] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      try {
        const role = sessionStorage.getItem("userRole");
        const userId = sessionStorage.getItem("userId");
        setUserRole(role || "");

        if (!role || !userId) {
          console.error("Role or User ID is missing from session storage.");
          return;
        }

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role, userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch purchased products.");
        }

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching purchased products:", error);
        setLoading(false);
      }
    };

    fetchPurchasedProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" className="text-[#a88a7d] hidden sm:block" />
        <Spin className="text-[#a88a7d] sm:hidden" />
      </div>
    );
  }
  if (orders.length === 0 || !orders) {
    return (
      <div className="mx-auto px-4 py-2">
        <div className="flex flex-col items-center min-h-screen justify-center">
          <ShoppingCartIcon className="sm:w-16 sm:h-16 w-10 h-10 text-[#a88a7d] mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            Your orders list is empty
          </h3>
          <p className="text-gray-500">
            Purchase some items to view your orders
          </p>
        </div>
      </div>
    );
  }
  const calculateOrderTotal = (products) => {
    return products.reduce((total, item) => {
      return total + parseFloat(item.details.price) * item.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-3 px-1.5 sm:px-6 lg:px-8 Helvetica text-[#473a3a]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center sm:gap-3 gap-1 mb-8">
          <ShoppingBag className="sm:h-7 sm:w-7 w-6 h-6 text-[#a88a7d]" />
          <h1 className="sm:text-xl text-lg font-semibold Manrope ">
            {userRole === "admin" ? "All Orders" : "My Orders"}
          </h1>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.order_id} className="overflow-hidden">
              <CardHeader className="bg-[#efede9] py-4 px-3 sm:px-6">
                <div className="flex flex-row sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="sm:text-base text-sm Manrope tracking-wide">
                      Order #{order.order_id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <CardDescription className="flex items-center sm:gap-2 gap-1 mt-1 ">
                      <Calendar className="h-4 w-4 mb-0.5" />
                      {format(
                        new Date(order.order_date),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </CardDescription>
                  </div>
                  <span className="font-medium Manrope text-sm sm:text-base">
                    Total: SAR {calculateOrderTotal(order.products).toFixed(2)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:px-6 px-3">
                {userRole === "admin" && order.client && (
                  <div className="mb-6">
                    <h3 className="font-medium Manrope mb-3">
                      {" "}
                      Customer Details
                    </h3>
                    <div className="bg-gray-50 rounded-lg Helvetica flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-[#a88a7d]" />
                        <span>{order.client.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-[#a88a7d]" />
                        <span>{order.client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-[#a88a7d]" />
                        <span>{order.client.whatsapp}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-medium Manrope">Order Items</h3>
                  {order.products.map((item, index) => (
                    <div key={item.product_id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex gap-3 sm:gap-4">
                        <div className="relative h-26 w-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.details.image}
                            alt={item.details.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium Manrope">
                            {item.details.name}
                          </h4>
                          <span className="inline-flex items-center Manrope mb-2 px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-[#efede9] text-[#a88a7d]">
                            {item.details.type}
                          </span>
                          <p className="sm:text-sm text-xs mt-1">
                            {item.details.description}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm ">
                              Quantity{" "}
                              <span className="text-green-500 Manrope">
                                X {item.quantity}
                              </span>
                            </span>
                            <span className="font-medium text-sm sm:text-base Manrope">
                              SAR {parseFloat(item.details.price)}
                              .00
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchasedProducts;

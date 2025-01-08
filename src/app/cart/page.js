"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyContext } from "../MyContext";
import { Loader2, Package, ShoppingBag, ShoppingCart } from "lucide-react";
import { ProductCard } from "../components/cart/product-card";
import { PackageCard } from "../components/cart/package-card";
import { CartSummary } from "../components/cart/cart-summary";
import { EmptyCart } from "../components/ui/empty-cart";
import { Spin } from "antd";

const Cart = () => {
  const { isSignedIn, userRole } = useMyContext();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    if (!isSignedIn || userRole !== "client") {
      router.push("/");
    } else {
      const fetchCart = async () => {
        try {
          setLoading(true);

          const response = await fetch("/api/user-cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: sessionStorage.getItem("userId") }),
          });

          if (!response.ok) {
            if (response.status === 404) {
              // Handle case where cart is not found
              setProducts([]);
              setPackages([]);
              setLoading(false);
              console.warn("Cart not found for the given user.");
              return;
            }
            throw new Error("Failed to fetch cart items");
          }

          const data = await response.json();

          // Safely update state with fetched data
          setProducts(
            (data.products || []).map((p) => ({
              ...p,
              quantity: p.quantity || 1,
            })) // Ensure quantity is set
          );
          setPackages(data.packages || []); // Ensure packages is set even if empty
        } catch (error) {
          console.error("Error fetching cart:", error);
          setProducts([]);
          setPackages([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCart();
    }
  }, [isSignedIn, userRole, router]);

  const handleRemoveProduct = async (productId) => {
    const userId = sessionStorage.getItem("userId");
    try {
      const response = await fetch("/api/remove-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, product_id: productId }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove product from the cart");
      }
      // Update client-side state after successful backend operation
      setProducts(products.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const handleRemovePackage = async (packageId) => {
    const userId = sessionStorage.getItem("userId");
    try {
      const response = await fetch("/api/remove-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, package_id: packageId }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove package from the cart");
      }
      // Update client-side state after successful backend operation
      setPackages(packages.filter((p) => p._id !== packageId));
    } catch (error) {
      console.error("Error removing package:", error);
    }
  };

  const handleUpdateQuantity = (productId, quantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p._id === productId ? { ...p, quantity } : p))
    );
  };

  const handleCheckout = async () => {
    setIsProcessing(true);

    const sessionData = {
      totalAmount,
      products: products,
      packages: packages,
    };
    console.log(sessionData);

    try {
      // Store session data
      sessionStorage.setItem("cartData", JSON.stringify(sessionData));

      // Simulate API call or delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/checkout");
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
    }
  };

  if (!isSignedIn || userRole !== "client") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <Spin size="large" className="hidden sm:block text-[#a88a7d]" />
        <Spin className=" sm:hidden text-[#a88a7d]" />
      </div>
    );
  }

  const totalAmount =
    products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    ) + packages.reduce((sum, pkg) => sum + parseFloat(pkg.price), 0);

  const itemCount =
    products.reduce((count, product) => count + product.quantity, 0) +
    packages.length;

  if (itemCount === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:py-12 py-8 pb-24">
      <h1 className="sm:text-2xl text-xl font-semibold text-[#473a3a] Manrope mb-8 flex ">
        <ShoppingCart className="sm:w-8 sm:h-8 w-7 h-7 text-[#473a3a] mb-4 mr-3" />
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {products.length > 0 && (
            <div className="space-y-4">
              <h2 className="sm:text-lg font-medium text-[#473a3a] flex Manrope ">
                <ShoppingBag className="sm:h-7 sm:w-8 h-6 w-7 text-[#a88a7d] mr-2" />{" "}
                Products
              </h2>
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onRemove={handleRemoveProduct}
                  onUpdateQuantity={handleUpdateQuantity} // Pass callback
                />
              ))}
            </div>
          )}

          {packages.length > 0 && (
            <div className="space-y-4">
              <h2 className="sm:text-lg font-medium text-[#473a3a] flex  Manrope ">
                <Package className="sm:h-8 sm:w-8 h-7 w-7 text-[#a88a7d] mr-2" />{" "}
                Training Packages
              </h2>
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg._id}
                  package={pkg}
                  onRemove={handleRemovePackage}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            totalAmount={totalAmount}
            itemCount={itemCount}
            isProcessing={isProcessing}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;

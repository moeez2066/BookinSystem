"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  CreditCard,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Calendar,
  Package,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { format } from "date-fns";
import { sendEmail, sendTrainerEmail } from "../sendEmail";
const mapContainerStyle = {
  width: "100%",
  height: "324px",
  borderRadius: "0.75rem",
};
export default function Checkout() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll effect
    });
  };

  const steps = [
    { title: "Shipping Address" },
    { title: "Payment Details" },
    { title: "Review Order" },
  ];
  const fetchLocationName = async (location) => {
    const apiKey = "AIzaSyC89Gb8SwfNkgEuBuOi0COhSBxJamM7t4o";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "OK") {
        return data.results[0]?.formatted_address || "Location not found";
      } else {
        throw new Error("Failed to fetch location name.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      return "Location not found";
    }
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      "AIzaSyC89Gb8SwfNkgEuBuOi0COhSBxJamM7t4o&callback=initMap&libraries=&v=weekly",
  });
  const [loadingOrder, setLoadingOrder] = useState(false);

  const processPackages = async (packages) => {
    if (!packages || packages.length === 0) {
      console.warn("No packages available for booking.");
      return [];
    }
    try {
      const response = await fetch("/api/save-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packages),
      });

      if (response.ok) {
        const results = await response.json(); // Assuming the backend returns an array of results for each package

        // Process each package and send separate emails
        for (let i = 0; i < packages.length; i++) {
          const packageData = packages[i];
          const result = results[i]; // Corresponding result for each package

          const schedulingDates = packageData.bookedslots
            .map((slot) =>
              Object.entries(slot)
                .map(([day, times]) => {
                  const timeRanges = times.map((t) => t.time).join(", ");
                  return `${day}: ${timeRanges}`;
                })
                .join("\n")
            )
            .join("\n");

          try {
            const emailParams = {
              recipient_email: result.clientData?.email || "",
              customer_name: result.clientData?.name || "",
              company_name: "Shaped",
              booking_reference: result.booking?._id || "",
              client_name: result.clientData?.name || "",
              client_email: result.clientData?.email?.toString() || "",
              trainer_name: result.trainerData?.name || "",
              trainer_email: result.trainerData?.email?.toString() || "",
              package_size: packageData.name?.toString() || "",
              package_price: "SAR " + packageData.price?.toString() || "",
              no_of_sessions: packageData.count?.toString() || "",
              start_period: result.booking?.valid_start_date?.toString() || "",
              scheduling_dates: schedulingDates || "",
              end_date: result.booking?.valid_end_date?.toString() || "",
              location: await fetchLocationName(result.location || ""),
              client_panel_url: "https://bookin-system.vercel.app/signin",
              policy: "None",
              support_email: "sara@shaped.com",
            };

            const emailTrainerParams = {
              recipient_email: result.trainerData?.email || "",
              customer_name: result.clientData?.name || "",
              company_name: "Shaped",
              booking_reference: result.booking?._id || "",
              client_name: result.clientData?.name || "",
              client_email: result.clientData?.email?.toString() || "",
              trainer_name: result.trainerData?.name || "",
              trainer_email: result.trainerData?.email?.toString() || "",
              package_size: packageData.name?.toString() || "",
              package_price: "SAR " + packageData.price?.toString() || "",
              no_of_sessions: packageData.count?.toString() || "",
              start_period: result.booking?.valid_start_date?.toString() || "",
              scheduling_dates: schedulingDates || "",
              end_date: result.booking?.valid_end_date?.toString() || "",
              location: await fetchLocationName(result.location || ""),
              client_panel_url: "https://bookin-system.vercel.app/signin",
              policy: "None",
              support_email: "sara@shaped.com",
            };

            // Send separate emails for each client and trainer
            await sendEmail(emailParams);
            await sendTrainerEmail(emailTrainerParams);
            console.log(
              `Confirmation email sent successfully for package ${i + 1}`
            );
          } catch (emailError) {
            console.error(
              `Failed to send confirmation email for package ${i + 1}:`,
              emailError
            );
          }
        }
        return results;
      } else {
        throw new Error("Failed to save packages.");
      }
    } catch (error) {
      console.error("Error processing packages:", error);
      return [];
    }
  };

  const processProducts = async (products) => {
    if (!products || products.length === 0) {
      console.warn("No products available for booking.");
      return [];
    }

    try {
      const response = await fetch("/api/save-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: products,
          userId: sessionStorage.getItem("userId"),
        }),
      });

      if (response.ok) {
        const results = await response.json();
        console.log("Products processed successfully:", results);
        return results;
      } else {
        throw new Error("Failed to save products.");
      }
    } catch (error) {
      console.error("Error processing products:", error);
      return [];
    }
  };

  const placeOrder = async () => {
    try {
      setLoadingOrder(true);

      const cartData = sessionStorage.getItem("cartData");
      const parsedData = JSON.parse(cartData);

      const packages = parsedData?.packages || [];
      const products = parsedData?.products || [];

      // Call both functions and wait for them to complete
      const [packageResults, productResults] = await Promise.all([
        processPackages(packages),
        processProducts(products),
      ]);

      if (packageResults.length > 0 || productResults.length > 0) {
        console.log("Order placed successfully for packages and/or products.");
      } else {
        console.warn("No orders were processed.");
      }
      router.push(`/order-confirmation`);
    } catch (error) {
      console.error("Error in placeOrder:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 sm:py-10 py-4 Manrope">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 ml-3 sm:ml-0">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`
                flex text-xs sm:text-base items-center justify-center sm:w-8 sm:h-8 p-2 py-1 sm:p-0 rounded-full
                ${
                  currentStep === index
                    ? "bg-[#a88a7d] text-white"
                    : currentStep > index
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-[#473a3a]  -600"
                }
              `}
              >
                {index + 1}
              </div>
              <div className="sm:ml-3 ml-1.5">
                <p className="sm:text-sm text-xs font-medium text-[#473a3a]  -900">
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="sm:w-[174px] w-[50%] h-1 mx-2 sm:mx-4 bg-gray-200">
                  {currentStep > index && (
                    <div className="h-full bg-green-500" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Shipping Address Form */}
        {currentStep === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-[#a88a7d]" />
              <h2 className="sm:text-xl font-semibold">Shipping Address</h2>
            </div>

            <form
              onSubmit={handleAddressSubmit}
              className="space-y-6 Helvetica"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="sm:space-y-2 space-y-1 text-xs sm:text-base">
                  <Label className="Manrope " htmlFor="fullName">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="sm:space-y-2 space-y-1">
                  <Label className="Manrope" htmlFor="phone">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="sm:space-y-2 space-y-1 md:col-span-2">
                  <Label className="Manrope" htmlFor="addressLine1">
                    Address Line 1
                  </Label>
                  <Input
                    id="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        addressLine1: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="sm:space-y-2 space-y-1 md:col-span-2">
                  <Label className="Manrope" htmlFor="addressLine2">
                    Address Line 2 (Optional)
                  </Label>
                  <Input
                    id="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        addressLine2: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="sm:space-y-2 space-y-1">
                  <Label className="Manrope" htmlFor="city">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="sm:space-y-2 space-y-1">
                  <Label className="Manrope" htmlFor="state">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="sm:space-y-2 space-y-1">
                  <Label className="Manrope" htmlFor="zipCode">
                    ZIP Code
                  </Label>
                  <Input
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        zipCode: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#a88a7d] hover:bg-[#97796c] text-white"
                >
                  Continue to Payment
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Form */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-5 w-5 text-[#a88a7d]" />
              <h2 className="sm:text-xl font-semibold">Payment Details</h2>
            </div>

            {/* Payment form will be implemented with Stripe */}
            <div className="space-y-6">
              <div className="p-4 bg-[#efede9] rounded-lg">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#a88a7d]" />
                  <p className="text-sm text-[#473a3a]  -600">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>

              <p className="text-center text-[#473a3a]  -500 Helvetica">
                Payment integration will be handled later
              </p>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(0)}>
                  Back
                </Button>
                <Button
                  className="bg-[#a88a7d] hover:bg-[#97796c] text-white Helvetica"
                  onClick={() => setCurrentStep(2)}
                >
                  Review Order
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-2 sm:p-6 flex items-center justify-center flex-col">
            <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
            {/* Order review content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Retrieve and parse cart data */}
                {(() => {
                  const cartData = sessionStorage.getItem("cartData");
                  const parsedData = cartData
                    ? JSON.parse(cartData)
                    : { products: [], packages: [], totalAmount: 0 };
                  const { products, packages } = parsedData;

                  if (products.length > 0) {
                    return (
                      <div className="space-y-4 sm:w-[812px] mx-auto">
                        <h2 className="sm:text-lg font-medium text-[#473a3a] flex Manrope">
                          <ShoppingBag className="sm:h-7 sm:w-8 w-7 h-6 text-[#a88a7d] mr-2" />
                          Products
                        </h2>
                        {products.map((product, index) => (
                          <div key={product.id}>
                            {index > 0 && <Separator className="my-4" />}
                            <div className="flex gap-3 sm:gap-4  p-2 sm:p-6 bg-white rounded-xl shadow-sm border border-[#baada6]/20  transition-shadow duration-200">
                              <div className="relative h-26 w-24 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium Manrope">
                                  {product.name}
                                </h4>
                                <span className="inline-flex items-center Manrope mb-2 px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-medium bg-[#efede9] text-[#a88a7d]">
                                  {product.type}
                                </span>
                                <p className="sm:text-sm text-xs mt-1 Helvetica">
                                  {product.description}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-sm Helvetica">
                                    Quantity{" "}
                                    <span className="text-green-500 Manrope">
                                      X {product.quantity}
                                    </span>
                                  </span>
                                  <span className="font-medium text-sm sm:text-base Manrope">
                                    SAR {parseFloat(product.price)}
                                    .00
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                })()}

                {/* Display Packages */}
                {(() => {
                  const cartData = sessionStorage.getItem("cartData");
                  const parsedData = cartData
                    ? JSON.parse(cartData)
                    : { products: [], packages: [], totalAmount: 0 };
                  const { packages } = parsedData;

                  if (packages.length > 0) {
                    return (
                      <div className="space-y-4  sm:w-[812px] text-sm sm:text-base mx-auto">
                        <h2 className="sm:text-lg font-medium text-[#473a3a] flex items-center Manrope ">
                          <Package className="sm:h-8 sm:w-8 h-7 w-7 text-[#a88a7d] mr-2" />{" "}
                          Training Packages
                        </h2>
                        {packages.map((pkg, index) => (
                          <div
                            key={index}
                            className="p-4 bg-white rounded-lg shadow-sm border border-[#baada6]/20"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold Manrope text-[#473a3a] ">
                                  Training Package
                                </h3>
                                <p className="text-sm text-[#a88a7d]">
                                  {pkg.no_of_sessions} Sessions
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold Manrope text-[#473a3a] ">
                                  SAR {pkg.price}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm text-[#473a3a]  -600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {format(
                                    new Date(pkg.valid_start_date.$date),
                                    "MMM d, yyyy"
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(pkg.valid_end_date.$date),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              </div>

                              <div className="space-y-2">
                                {pkg.bookedslots.map((slot, index) => {
                                  const [day, times] = Object.entries(slot)[0];
                                  return (
                                    <div
                                      key={index}
                                      className="bg-[#efede9] p-3 rounded-md"
                                    >
                                      <p className="font-medium Manrope text-[#473a3a]  mb-2">
                                        {day}
                                      </p>
                                      {times.map((time, timeIndex) => (
                                        <div
                                          key={timeIndex}
                                          className="flex items-start gap-2 text-sm"
                                        >
                                          <div className="flex-1">
                                            <p className="text-[#473a3a]  -700 Helvetica">
                                              {time.time}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })}
                                <div className="flex Manrope text-sm py-2 text-[#a88a7d]">
                                  <MapPin className="h-5 w-5" /> &nbsp; Location
                                  Provided
                                </div>
                                {isLoaded && !loadError ? (
                                  <div className="rounded-lg overflow-hidden shadow-sm">
                                    <GoogleMap
                                      mapContainerStyle={mapContainerStyle}
                                      center={{
                                        lat: parseFloat(
                                          pkg.bookedslots[0][
                                            Object.keys(pkg.bookedslots[0])[0]
                                          ][0].location.split(",")[0]
                                        ),
                                        lng: parseFloat(
                                          pkg.bookedslots[0][
                                            Object.keys(pkg.bookedslots[0])[0]
                                          ][0].location.split(",")[1]
                                        ),
                                      }}
                                      zoom={12}
                                    >
                                      <Marker
                                        position={{
                                          lat: parseFloat(
                                            pkg.bookedslots[0][
                                              Object.keys(pkg.bookedslots[0])[0]
                                            ][0].location.split(",")[0]
                                          ),
                                          lng: parseFloat(
                                            pkg.bookedslots[0][
                                              Object.keys(pkg.bookedslots[0])[0]
                                            ][0].location.split(",")[1]
                                          ),
                                        }}
                                      />
                                    </GoogleMap>
                                  </div>
                                ) : (
                                  <p className="text-xs sm:text-sm text-[#a88a7d]">
                                    Map could not be loaded.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                })()}

                {(() => {
                  const cartData = sessionStorage.getItem("cartData");
                  const parsedData = cartData
                    ? JSON.parse(cartData)
                    : { products: [], packages: [], totalAmount: 0 };
                  return (
                    <div className="space-y-4  sm:w-[812px] text-sm sm:text-base mx-auto">
                      <div className="Manrope py-6">
                        {/* Shipping Address Section */}
                        <div className="bg-[#efede9] p-6 rounded-lg shadow-sm mb-6">
                          <h3 className="text-lg font-semibold text-[#473a3a] mb-4">
                            Shipping Address
                          </h3>
                          <div className="space-y-2 text-sm text-[#473a3a]">
                            <p>
                              <span className="font-medium">Full Name: </span>
                              <span className="Helvetica">
                                {shippingAddress.fullName}
                              </span>
                            </p>
                            <p>
                              <span className="font-medium">Phone: </span>
                              <span className="Helvetica">
                                {shippingAddress.phone}
                              </span>
                            </p>
                            <p>
                              <span className="font-medium">
                                Address Line 1:{" "}
                              </span>
                              <span className="Helvetica">
                                {shippingAddress.addressLine1}
                              </span>
                            </p>
                            {shippingAddress.addressLine2 && (
                              <p>
                                <span className="font-medium">
                                  Address Line 2:{" "}
                                </span>
                                <span className="Helvetica">
                                  {shippingAddress.addressLine2}
                                </span>
                              </p>
                            )}
                            <p>
                              <span className="font-medium">City: </span>
                              <span className="Helvetica">
                                {shippingAddress.city}
                              </span>
                            </p>
                            <p>
                              <span className="font-medium">State: </span>
                              <span className="Helvetica">
                                {shippingAddress.state}
                              </span>
                            </p>
                            <p>
                              <span className="font-medium">ZIP Code: </span>

                              <span className="Helvetica">
                                {shippingAddress.zipCode}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Total Amount Section */}
                        <div className="flex justify-end sm:text-lg font-semibold">
                          <span className="text-[#473a3a]">TOTAL &nbsp;</span>
                          <span className="text-[#a88a7d]">
                            SAR {parsedData.totalAmount?.toFixed(2) || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className="space-y-6">
              <Button
                className={`w-full mb-5 sm:mb-0 ${
                  loadingOrder
                    ? "bg-gray-300 text-[#473a3a]  -500 cursor-not-allowed"
                    : "bg-[#a88a7d] hover:bg-[#97796c] text-white"
                }`}
                onClick={loadingOrder ? undefined : placeOrder}
                disabled={loadingOrder}
              >
                Place Order
                {loadingOrder && (
                  <Loader2 className="animate-spin ml-2 h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>{" "}
    </div>
  );
}

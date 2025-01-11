"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
  Menu,
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  MapPin,
  CalendarPlus,
  CalendarClock,
  XCircle,
  CalendarX,
  ShoppingBag,
} from "lucide-react";
import { Modal, message } from "antd";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { ScrollArea } from "../components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { cn } from "../../../lib/utils";
import Rescheduling from "../components/clientReschedule";
import { Spin, Table } from "antd";
import { useMyContext } from "../MyContext";
import ExtendValidity from "../components/ExtendValidity";
import { sendCanceledTrainerEmail, sendCancelEmail } from "../sendEmail";
import PurchasedProducts from "../components/PurchasedProducts";

const mapContainerStyle = {
  width: "100%",
  height: "324px",
  borderRadius: "0.75rem",
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("clients");
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    type: "",
    message: "",
  });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      "AIzaSyC89Gb8SwfNkgEuBuOi0COhSBxJamM7t4o&callback=initMap&libraries=&v=weekly",
  });

  const router = useRouter();
  const { isSignedIn } = useMyContext();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/");
    }
  }, []);
  // Auto-hide alert after a few seconds
  useEffect(() => {
    if (alertInfo.visible) {
      const timer = setTimeout(() => {
        setAlertInfo({ ...alertInfo, visible: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);
  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      const response = await fetch("/api/cancel-booking", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: currentBookingId }),
      });
      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || "Failed to cancel booking");

      setAlertInfo({
        visible: true,
        type: "success",
        message: "Booking canceled successfully!",
      });
      setRefetch(true);
      setIsModalVisible(false);
      try {
        const emailParams = {
          recipient_email: result.clientData.email,
          customer_name: result.clientData.name,
          company_name: "Shaped",
          booking_reference: currentBookingId,
          client_name: result.clientData.name,
          client_email: result.clientData.email.toString(),
          trainer_name: result.trainerData.name,
          trainer_email: result.trainerData.email.toString(),
          client_panel_url: "https://bookin-system.vercel.app/signin",
          policy: "None",
          support_email: "sara@shaped.com",
        };

        const emailTrainerParams = {
          recipient_email: result.trainerData.email,
          customer_name: result.clientData.name,
          company_name: "Shaped",
          booking_reference: currentBookingId,
          client_name: result.clientData.name,
          client_email: result.clientData.email.toString(),
          trainer_name: result.trainerData.name,
          trainer_email: result.trainerData.email.toString(),
          client_panel_url: "https://bookin-system.vercel.app/signin",
          policy: "None",
          support_email: "sara@shaped.com",
        };
        console.log(emailParams);
        console.log(emailTrainerParams);

        await sendCancelEmail(emailParams);
        await sendCanceledTrainerEmail(emailTrainerParams);
        console.log("Confirmation email sent successfully.");
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    } catch (err) {
      setAlertInfo({
        visible: true,
        type: "error",
        message: err.message,
      });
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin");
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch data");

        setClients(data.clients);
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      setRefetchLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/admin");
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch data");

        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setRefetchLoading(false);
      }
    };

    if (refetch) {
      fetchAdminData();
      setRefetch(false);
    }
  }, [refetch]);

  const Sidebar = ({ className }) => (
    <div className={cn(`pb-12 h-[100%] bg-[#f9f6f4]  Manrope`, className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center px-4 mb-6 mt-5">
            <LayoutDashboard className="h-6 w-6 text-[#8b7355] mr-2" />
            <h2 className="text-xl font-semibold text-[#8b7355] ">Dashboard</h2>
          </div>
          <div className="space-y-2">
            {[
              { icon: Users, label: "Clients", value: "clients" },
              { icon: Calendar, label: "Bookings", value: "bookings" },
              { icon: Clock, label: "Rescheduling", value: "rescheduling" },
              {
                icon: CalendarClock,
                label: "Rescheduled Bookings",
                value: "rescheduledBookings",
              },
              {
                icon: CalendarPlus,
                label: "Extend Validity",
                value: "extendValidity",
              },
              {
                icon: CalendarX,
                label: "Canceled Bookings",
                value: "cancelBookings",
              },
              {
                icon: ShoppingBag,
                label: "Purchased Products",
                value: "purchasedProducts",
              },
            ].map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  activeTab === item.value
                    ? "bg-[#baada6] text-white hover:bg-[#a88a7d]"
                    : "text-[#8b7355] hover:bg-[#baada6]/20"
                )}
                onClick={() => {
                  setActiveTab(item.value);
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <>
      <Card className="block p-4 sm:p-8 bg-[#f9f6f4] border-[#baada6]/20  ">
        <h2 className="text-xl mb-5 flex mx-auto sm:text-2xl w-[100%] justify-center items-center font-semibold text-[#8b7355]">
          <Users size={19} />
          &nbsp;Clients
        </h2>
        <Table
          dataSource={clients}
          className="clientTable w-[calc(100vw-60px)] sm:w-[100%]"
          columns={[
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "WhatsApp", dataIndex: "whatsapp", key: "whatsapp" },
          ]}
          rowKey={(record) => record.id}
          pagination={{
            pageSizeOptions: ["5", "10", "15"],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ x: 100 }}
        />
      </Card>
    </>
  );

  const BookingCard = ({ booking, index }) => (
    <Card className="p-4 sm:p-6 mb-4 sm:mb-0 bg-[#f9f6f4] border-[#baada6]/20 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex justify-between flex-col sm:flex-row sm:items-center">
          <h3 className="text-md flex sm:text-lg items-center justify-between font-semibold text-[#8b7355]">
            <div className="flex items-center justify-center">
              {" "}
              <Calendar size={19} />
              &nbsp;Booking {index + 1}
            </div>
            {!booking.canceled && (
              <XCircle
                className="cursor-pointer sm:hidden block w-5 h-5 ml-5 text-red-500"
                onClick={() => {
                  setCurrentBookingId(booking._id); // Store the booking ID
                  setIsModalVisible(true); // Open the modal
                }}
              />
            )}
          </h3>
          <div className="flex sm:items-center mt-3 sm:mt-0 sm:justify-center">
            <span className="text-xs sm:text-sm  text-[#a88a7d]">
              ID: {booking._id}
            </span>
            {!booking.canceled && (
              <XCircle
                className="cursor-pointer sm:block hidden w-6 h-6 ml-5 text-red-500"
                onClick={() => {
                  setCurrentBookingId(booking._id); // Store the booking ID
                  setIsModalVisible(true); // Open the modal
                }}
              />
            )}
          </div>
        </div>
        <Separator className="bg-[#baada6]/20" />
        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                Client Name
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {booking.clientName}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                Client Email
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {booking.clientEmail}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                Trainer Name
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {booking.trainerName}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                Trainer Email
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {booking.trainerEmail}
              </p>
            </div>
          </div>

          {booking.rescheduled && booking.oldSlotDate && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                  Old Slot Date
                </p>
                <p className="text-xs sm:text-sm text-[#a88a7d]">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                    .format(new Date(booking.oldSlotDate))
                    .replace(/(\s\w{3})\s/, "$1, ")}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                  Old Slot Time
                </p>
                <p className="text-xs sm:text-sm text-[#a88a7d]">
                  {booking.oldSlotTime}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                Start Date
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                  .format(new Date(booking.validStartDate))
                  .replace(/(\s\w{3})\s/, "$1, ")}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                End Date
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                  .format(new Date(booking.validEndDate))
                  .replace(/(\s\w{3})\s/, "$1, ")}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-sm font-medium text-[#8b7355] mb-2">
              Booked Slots
            </p>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
              {booking.bookedSlots.map((slot, idx) =>
                Object.entries(slot).map(([day, details]) => (
                  <div key={`${index}-${idx}`} className="mb-2">
                    <span className="font-medium text-sm sm:text-base text-[#8b7355]">
                      {day}:
                    </span>
                    <span className="ml-2 text-xs sm:text-sm text-[#a88a7d]">
                      {details.map((detail, i) => (
                        <span key={i}>
                          {detail.time}
                          {i < details.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          {booking.free_slots && (
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355] mb-2">
                Freed Slots
              </p>
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                {booking.free_slots.map((slot, idx) => (
                  <div key={`${idx}`} className="mb-2">
                    <span className="font-medium text-sm sm:text-base text-[#8b7355]">
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                        .format(new Date(slot))
                        .replace(/(\s\w{3})\s/, "$1, ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 text-[#baada6] mr-2" />
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                Location
              </p>
            </div>
            {isLoaded && !loadError ? (
              <div className="rounded-lg overflow-hidden shadow-sm">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={{
                    lat: parseFloat(
                      booking.bookedSlots[0][
                        Object.keys(booking.bookedSlots[0])[0]
                      ][0].location.split(",")[0]
                    ),
                    lng: parseFloat(
                      booking.bookedSlots[0][
                        Object.keys(booking.bookedSlots[0])[0]
                      ][0].location.split(",")[1]
                    ),
                  }}
                  zoom={12}
                >
                  <Marker
                    position={{
                      lat: parseFloat(
                        booking.bookedSlots[0][
                          Object.keys(booking.bookedSlots[0])[0]
                        ][0].location.split(",")[0]
                      ),
                      lng: parseFloat(
                        booking.bookedSlots[0][
                          Object.keys(booking.bookedSlots[0])[0]
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
    </Card>
  );
  const filteredBoookings = bookings.filter(
    (booking) => !booking.rescheduled && !booking.canceled
  );
  const filteredRescheduledBoookings = bookings.filter(
    (booking) => booking.rescheduled
  );
  const filteredCanceledBoookings = bookings.filter(
    (booking) => booking.canceled
  );
  return (
    <>
      <div className="min-h-screen bg-background">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="mt-2 bg-[#baada6] ml-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex">
          <aside className="hidden lg:block w-64 border-r border-[#baada6]/20 bg-[#f9f6f4] ">
            <Sidebar />
          </aside>

          <main className="flex-1 p-1 sm:p-8">
            <div className="max-w-4xl mx-auto">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <ScrollArea className="h-[calc(100vh-2rem)] p-2 sm:mt-0">
                {activeTab === "clients" &&
                  (loading ? (
                    <Card className="p-6 flex items-center justify-center border-0 shadow-none">
                      <Spin size="default" className="sm:hidden" />{" "}
                      <Spin size="large" className="hidden sm:block" />{" "}
                    </Card>
                  ) : (
                    renderClients()
                  ))}

                {activeTab === "bookings" &&
                  (loading || refetchLoading ? (
                    <Card className="p-6 flex items-center justify-center border-0 shadow-none">
                      <Spin size="default" className="sm:hidden" />{" "}
                      <Spin size="large" className="hidden sm:block" />{" "}
                    </Card>
                  ) : (
                    <div className="space-y-6 bg-[#baada6] p-2">
                      {filteredBoookings.length > 0 ? (
                        filteredBoookings.map((booking, index) => (
                          <BookingCard
                            key={index}
                            booking={booking}
                            index={index}
                          />
                        ))
                      ) : (
                        <Card className="p-6 bg-[#f9f6f4] border-[#baada6]/20">
                          <p className="text-center text-[#a88a7d]">
                            No bookings found.
                          </p>
                        </Card>
                      )}
                    </div>
                  ))}
                {activeTab === "rescheduledBookings" &&
                  (loading || refetchLoading ? (
                    <Card className="p-6 flex items-center justify-center border-0 shadow-none">
                      <Spin size="default" className="sm:hidden" />
                      <Spin size="large" className="hidden sm:block" />
                    </Card>
                  ) : (
                    <div className="space-y-6 bg-[#baada6] p-2">
                      {filteredRescheduledBoookings.length > 0 ? (
                        filteredRescheduledBoookings.map((booking, index) => (
                          <BookingCard
                            key={index}
                            booking={booking}
                            index={index}
                          />
                        ))
                      ) : (
                        <Card className="p-6 bg-[#f9f6f4] border-[#baada6]/20">
                          <p className="text-center text-[#a88a7d]">
                            No rescheduled bookings found.
                          </p>
                        </Card>
                      )}
                    </div>
                  ))}
                {activeTab === "cancelBookings" &&
                  (loading || refetchLoading ? (
                    <Card className="p-6 flex items-center justify-center border-0 shadow-none">
                      <Spin size="default" className="sm:hidden" />
                      <Spin size="large" className="hidden sm:block" />
                    </Card>
                  ) : (
                    <div className="space-y-6 bg-[#baada6] p-2">
                      {filteredCanceledBoookings.length > 0 ? (
                        filteredCanceledBoookings.map((booking, index) => (
                          <BookingCard
                            key={index}
                            booking={booking}
                            index={index}
                          />
                        ))
                      ) : (
                        <Card className="p-6 bg-[#f9f6f4] border-[#baada6]/20">
                          <p className="text-center text-[#a88a7d]">
                            No canceled bookings found.
                          </p>
                        </Card>
                      )}
                    </div>
                  ))}

                {activeTab === "rescheduling" && (
                  <Rescheduling setRefetch={setRefetch} />
                )}
                {activeTab === "extendValidity" && (
                  <ExtendValidity setRefetch={setRefetch} />
                )}
                {activeTab === "purchasedProducts" && <PurchasedProducts />}
              </ScrollArea>
            </div>
          </main>
        </div>
      </div>
      <Modal
        title="Cancel Booking"
        visible={isModalVisible}
        onOk={handleCancelBooking}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={cancelLoading}
        centered={true}
        className="custom-modal"
      >
        <p className="text-[#8b7355]">
          Are you sure you want to cancel this booking? This action cannot be
          undone.
        </p>
      </Modal>
      {alertInfo.visible && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          closable
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
    </>
  );
};

export default AdminPanel;

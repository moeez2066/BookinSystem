"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMyContext } from "../MyContext";
import Rescheduling from "../components/clientReschedule";
import {
  Menu,
  LayoutDashboard,
  User,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  CalendarX,
  PlusIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { ScrollArea } from "../components/ui/scroll-area";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { cn } from "../../../lib/utils";
import { Modal, Spin } from "antd";

const mapContainerStyle = {
  width: "100%",
  height: "324px",
  borderRadius: "0.75rem",
};

const TrainerPanel = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [trainerData, setTrainerData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [refetchLoading, setRefetchLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [completeSessionLoading, setCompleteSessionLoading] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
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
  const handleCompleteSession = async () => {
    setCompleteSessionLoading(true);
    try {
      const response = await fetch("/api/session-complete", {
        method: "POST",
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
        message: "Session completed successfully!",
      });
      setRefetch(true);
      setIsModalVisible(false);
    } catch (err) {
      setAlertInfo({
        visible: true,
        type: "error",
        message: err.message,
      });
    } finally {
      setCompleteSessionLoading(false);
    }
  };

  useEffect(() => {
    const fetchTrainerData = async () => {
      setLoading(true);
      setError(null);

      try {
        const trainerId = sessionStorage.getItem("userId");
        if (!trainerId) throw new Error("Trainer ID is missing");

        const response = await fetch(`/api/trainer?trainerId=${trainerId}`);
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Failed to fetch trainer data");

        setTrainerData(data.trainer);
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  useEffect(() => {
    const fetchTrainerData = async () => {
      setRefetchLoading(true);
      setError(null);

      try {
        const trainerId = sessionStorage.getItem("userId");
        if (!trainerId) throw new Error("Trainer ID is missing");

        const response = await fetch(`/api/trainer?trainerId=${trainerId}`);
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Failed to fetch trainer data");
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setRefetchLoading(false);
      }
    };
    if (refetch) {
      fetchTrainerData();
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
              { icon: User, label: "Profile", value: "profile" },
              { icon: Calendar, label: "Bookings", value: "bookings" },
              { icon: Clock, label: "Rescheduling", value: "rescheduling" },
              {
                icon: Calendar,
                label: "Rescheduled Bookings",
                value: "rescheduledBookings",
              },
              {
                icon: CalendarX,
                label: "Canceled Bookings",
                value: "cancelBookings",
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

  const ProfileContent = () => (
    <Card className="p-4 sm:p-8 bg-[#f9f6f4] border-[#baada6]/20">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4 sm:w-[250px]" />
          <Skeleton className="h-4 w-2/3 sm:w-[200px]" />
          <Skeleton className="h-4 w-3/4 sm:w-[220px]" />
        </div>
      ) : trainerData ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-center space-x-0 space-y-4 sm:space-x-6 sm:space-y-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#baada6] flex items-center justify-center shadow-lg">
              <User className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#8b7355]">
                {trainerData.name}
              </h3>
              <p className="text-[#a88a7d]">{trainerData.email}</p>
            </div>
          </div>
          <Separator className="bg-[#baada6]/20" />
          <div className="grid gap-4">
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-medium text-[#8b7355]">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#baada6]" />
                  <div>
                    <p className="text-sm font-medium text-[#8b7355]">Email</p>
                    <p className="text-sm text-[#a88a7d]">
                      {trainerData.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#baada6]" />
                  <div>
                    <p className="text-sm font-medium text-[#8b7355]">
                      WhatsApp
                    </p>
                    <p className="text-sm text-[#a88a7d]">
                      {trainerData.whatsapp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[#8b7355]">No profile data available.</p>
      )}
    </Card>
  );
console.log(bookings);

  const BookingCard = ({ booking, index }) => (
    <Card className="p-4 sm:p-6 mb-4 sm:mb-0 bg-[#f9f6f4] border-[#baada6]/20 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-md flex sm:text-lg items-center font-semibold text-[#8b7355]">
            <Calendar size={19} />
            &nbsp;Booking {index + 1}
          </h3>
          <span className="text-xs sm:text-sm text-[#a88a7d]">
            ID: {booking._id}
          </span>
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
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                Client Number
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {booking.clientNumber}
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
            {/* Start Date */}
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

            {/* End Date */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                Total no of sessions
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d]">
                {booking.no_of_sessions}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8b7355]">
                Total no of completed sessions
              </p>
              <p className="text-xs sm:text-sm text-[#a88a7d] flex items-center">
                {booking.no_of_completed_sessions ?? 0}
                <button
                  className="ml-4 text-white text-xs mt-1 flex items-center justify-center p-1 rounded-md"
                  style={{
                    backgroundColor:
                      booking.no_of_completed_sessions >= booking.no_of_sessions
                        ? "rgb(200, 200, 200)" // Gray color to indicate disabled
                        : "rgb(168, 138, 125)",
                    cursor:
                      booking.no_of_completed_sessions >= booking.no_of_sessions
                        ? "not-allowed"
                        : "pointer",
                  }}
                  disabled={
                    booking.no_of_completed_sessions >= booking.no_of_sessions // Disable button
                  }
                  onClick={() => {
                    setCurrentBookingId(booking._id);
                    setIsModalVisible(true);
                  }}
                >
                  <PlusIcon size={12} style={{ marginRight: "3px" }} /> Complete
                  session
                </button>
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
                {activeTab === "profile" &&
                  (loading ? (
                    <Card className="p-6 flex items-center justify-center border-0 shadow-none">
                      <Spin size="default" className="sm:hidden" />{" "}
                      <Spin size="large" className="hidden sm:block" />{" "}
                    </Card>
                  ) : (
                    <ProfileContent />
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
              </ScrollArea>
            </div>
          </main>
        </div>
      </div>
      <Modal
        title="Complete Session"
        visible={isModalVisible}
        onOk={handleCompleteSession}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={completeSessionLoading}
        centered={true}
        className="custom-modal"
      >
        <p className="text-[#8b7355]">
          Are you sure you want to complete the session? You will be fined if
          you choose to increment without attending the session.
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

export default TrainerPanel;

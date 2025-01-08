"use client";

import { Calendar, Loader2, MapPin, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
const mapContainerStyle = {
  width: "100%",
  height: "324px",
  borderRadius: "0.75rem",
};
interface PackageCardProps {
  package: {
    trainer_id: { $oid: string };
    client_id: { $oid: string };
    bookedslots: Array<
      Record<string, Array<{ time: string; location: string }>>
    >;
    valid_start_date: { $date: string };
    valid_end_date: { $date: string };
    no_of_sessions: string;
    price: string;
    _id: any;
  };
  onRemove: (trainerId: string) => void;
}

export function PackageCard({ package: pkg, onRemove }: PackageCardProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      "AIzaSyC89Gb8SwfNkgEuBuOi0COhSBxJamM7t4o&callback=initMap&libraries=&v=weekly",
  });
  const [isRemoving, setIsRemoving] = useState(false); // Track loading state
  const handleRemoveClick = async () => {
    setIsRemoving(true); // Show loader
    try {
      await onRemove(pkg._id); // Call the remove function
    } catch (error) {
      console.error("Error removing product:", error);
      setIsRemoving(false); // Revert loading state on failure
    }
  };
  return (
    <div className="p-4 bg-white rounded-lg text-sm sm:text-base shadow-sm border border-[#baada6]/20 Manrope">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold  Manrope text-[#473a3a] ">
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
          {isRemoving ? (
            <div className="flex items-center justify-center">
              <Loader2 className="sm:h-6 sm:w-6 w-5 h-5 ml-9 sm:ml-0 text-red-500 animate-spin my-2" />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
              onClick={handleRemoveClick}
            >
              <Trash2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:block">Remove</span>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-[#473a3a]  -600">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(pkg.valid_start_date.$date), "MMM d, yyyy")} -{" "}
            {format(new Date(pkg.valid_end_date.$date), "MMM d, yyyy")}
          </span>
        </div>

        <div className="space-y-2">
          {pkg.bookedslots.map((slot, index) => {
            const [day, times] = Object.entries(slot)[0];
            return (
              <div key={index} className="bg-[#efede9] p-3 rounded-md">
                <p className="font-medium Manrope text-[#473a3a]  mb-2">
                  {day}
                </p>
                {times.map((time, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="flex items-start gap-2 text-sm"
                  >
                    <div className="flex-1">
                      <p className="text-[#473a3a]  -700 Helvetica">{time.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          <div className="flex Manrope text-sm py-2 text-[#a88a7d]">
            <MapPin className="h-5 w-5" /> &nbsp; Location Provided
          </div>
          {isLoaded && !loadError ? (
            <div className="rounded-lg overflow-hidden shadow-sm">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{
                  lat: parseFloat(
                    (pkg as any).bookedslots[0][
                      Object.keys((pkg as any).bookedslots[0])[0]
                    ][0].location.split(",")[0]
                  ),
                  lng: parseFloat(
                    (pkg as any).bookedslots[0][
                      Object.keys((pkg as any).bookedslots[0])[0]
                    ][0].location.split(",")[1]
                  ),
                }}
                zoom={12}
              >
                <Marker
                  position={{
                    lat: parseFloat(
                      (pkg as any).bookedslots[0][
                        Object.keys((pkg as any).bookedslots[0])[0]
                      ][0].location.split(",")[0]
                    ),
                    lng: parseFloat(
                      (pkg as any).bookedslots[0][
                        Object.keys((pkg as any).bookedslots[0])[0]
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
  );
}

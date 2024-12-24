import calculateDistanceAndDuration from "../../distanceMatrix";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("BookingSys");
    const url = new URL(request.url);
    const bookingId = url.searchParams.get("bookingId");
    let booking;
    try {
      booking = await db
        .collection("Booking")
        .findOne({ _id: new ObjectId(bookingId) });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const trainerId = booking.trainer_id;
    const startDate = url.searchParams.get("date");
    const day = new Date(startDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const bookedDate = url.searchParams.get("bookedDate");
    const BookedDay = new Date(bookedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const validity = "1 day";
    const firstDay = booking.bookedslots[0];
    const firstDayKey = Object.keys(firstDay)[0];
    const placeChords = firstDay[firstDayKey][0].location;

    console.log("Received parameters:", {
      trainerId,
      day,
      validity,
      startDate,
      placeChords,
      bookedDate,
    });
    if (booking) {
      const checkDay = booking.bookedslots.find((slot) => {
        return Object.keys(slot).includes(BookedDay);
      });

      if (checkDay) {
        const time = checkDay[BookedDay][0]["time"].split("-")[0];
        const bookingDateTime = new Date(`${bookedDate} ${time}`);
        const currentDateTime = new Date();
        const timeDifference =
          (bookingDateTime - currentDateTime) / (1000 * 60 * 60);
        if (timeDifference >= 24) {
          console.log("Rescheduling allowed, 24 hours or more remaining.");
        } else if (timeDifference > 0 && timeDifference < 24) {
          return new Response(
            JSON.stringify({
              error: "Rescheduling not allowed, less than 24 hours remaining.",
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            }
          );
        } else {
          return new Response(
            JSON.stringify({
              error: "The booking time has already passed.",
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    if (booking) {
      const checkDay = booking.bookedslots.find((slot) => {
        return Object.keys(slot).includes(BookedDay);
      });
      if (!checkDay) {
        return new Response(
          JSON.stringify({ error: "You are not having booking on this day" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
    if (booking) {
      const slotFound = booking.free_slots?.some((slot) => {
        return new Date(slot).getDate() === new Date(bookedDate).getDate();
      });

      if (slotFound) {
        return new Response(
          JSON.stringify({ error: "You are not having booking on this day" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
    const trainer = await db
      .collection("Trainers")
      .findOne(
        { _id: new ObjectId(trainerId) },
        { projection: { working_hours: 1 } }
      );

    console.log("Fetched trainer data:", trainer);

    const workingHours = trainer.working_hours;
    const [startTime, endTime] = workingHours.split(" - ");

    const parseTime = (timeStr) => {
      const [hour, period] = timeStr.match(/\d+|\D+/g);
      let hours = parseInt(hour, 10);
      if (period.trim().toLowerCase() === "pm" && hours !== 12) hours += 12;
      if (period.trim().toLowerCase() === "am" && hours === 12) hours = 0;
      return hours;
    };

    const parseValidity = (validity) => {
      const now = new Date(startDate);
      let endDate;
      if (validity.includes("weeks")) {
        const weeks = parseInt(validity.split(" ")[0], 10);
        endDate = new Date(now);
        endDate.setDate(now.getDate() + weeks * 7);
      } else if (validity.includes("months")) {
        const months = parseInt(validity.split(" ")[0], 10);
        endDate = new Date(now);
        endDate.setMonth(now.getMonth() + months);
      } else if (validity.includes("day")) {
        const days = parseInt(validity.split(" ")[0], 10);
        endDate = new Date(now);
        endDate.setDate(now.getDate() + days);
      }
      return { startDate: now, endDate };
    };

    const { startDate: valid_start_date, endDate: valid_end_date } =
      parseValidity(validity);

    console.log("Parsed validity range:", { valid_start_date, valid_end_date });

    const startHour = parseTime(startTime);
    const endHour = parseTime(endTime);

    console.log("Parsed working hours:", { startHour, endHour });

    const bookings = await db
      .collection("Booking")
      .find({
        trainer_id: new ObjectId(trainerId),
        bookedslots: { $elemMatch: { [day]: { $exists: true } } },
      })
      .toArray();

    console.log("Fetched bookings:", bookings);

    const isWithinRange = (date, rangeStart, rangeEnd) => {
      return date >= rangeStart && date <= rangeEnd;
    };

    const relevantBookings = bookings.filter((booking) => {
      if (
        booking.free_slots?.some(
          (slot) => new Date(slot).getDate() === new Date(startDate).getDate()
        )
      ) {
        return false;
      }
      const bookingStart = new Date(booking.valid_start_date);
      const bookingEnd = new Date(booking.valid_end_date);

      return (
        isWithinRange(valid_start_date, bookingStart, bookingEnd) ||
        isWithinRange(valid_end_date, bookingStart, bookingEnd)
      );
    });

    console.log("Filtered relevant bookings:", relevantBookings);

    const bookedSlots = [];
    for (const booking of relevantBookings) {
      const dayBooking = booking.bookedslots.find((slot) => slot[day]);
      if (dayBooking) {
        for (const slot of dayBooking[day]) {
          const distanceAndDuration = await calculateDistanceAndDuration(
            slot.location,
            placeChords
          );
          bookedSlots.push({
            time: slot.time,
            location: slot.location,
            distance: distanceAndDuration.distance,
            duration: distanceAndDuration.duration,
          });
        }
      }
    }

    console.log("Compiled booked slots:", bookedSlots);
    if (bookedSlots.length >= 8) {
      return new Response(
        JSON.stringify({
          message: "All slots booked",
          workingHours: `${startTime} - ${endTime}`,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const generateTimeSlots = (start, end, bookedSlots) => {
      const slots = [];

      // Parse booked ranges into start and end times in fractional hours
      const bookedRanges = bookedSlots.map((slot) => {
        const [startTime, endTime] = slot.time.split(" - ");
        const parseHour = (time) => {
          const [hour, period] = time.split(" ");
          return period === "PM" && hour !== "12"
            ? parseInt(hour) + 12
            : parseInt(hour);
        };
        const parseMinute = (time) => parseInt(time.split(":")[1] || 0);

        const startHour = parseHour(startTime);
        const startMinute = parseMinute(startTime);
        const endHour = parseHour(endTime);
        const endMinute = parseMinute(endTime);

        // Adding 10 minutes (buffer time) to the duration
        const durationInMinutes = parseInt(slot.duration.split(" ")[0]);
        const bufferTime = 10; // Buffer time in minutes
        const endHourWithDuration =
          endHour + (endMinute + durationInMinutes + bufferTime) / 60;

        return {
          start: startHour + startMinute / 60,
          end: endHourWithDuration,
          exactStart: { hour: startHour, minute: startMinute }, // Exact start time for comparison
        };
      });

      let currentHour = start;
      let currentMinute = 0; // Always start at 0 if no booked slots

      while (
        currentHour < end ||
        (currentHour === end && currentMinute === 0)
      ) {
        const currentTime = currentHour + currentMinute / 60;

        // Check if the current time overlaps with any booked range
        const overlappingRange = bookedRanges.find(
          (range) => currentTime >= range.start && currentTime < range.end
        );

        if (overlappingRange) {
          // Skip this time range and adjust currentHour and currentMinute
          currentHour = Math.floor(overlappingRange.end);
          currentMinute = Math.round((overlappingRange.end % 1) * 60);
          continue;
        }

        // Format the start and end times for the time slot
        const slotStart = new Date(1970, 0, 1, currentHour, currentMinute);
        const slotEnd = new Date(1970, 0, 1, currentHour + 1, currentMinute);

        // Ensure the slot end time does not exceed the `end` hour
        if (
          slotEnd.getHours() > end ||
          (slotEnd.getHours() === end && slotEnd.getMinutes() > 0)
        ) {
          break;
        }

        // Check if the end time matches the start time of any booked slot
        const isExcluded = bookedRanges.some(
          (range) =>
            slotEnd.getHours() === range.exactStart.hour &&
            slotEnd.getMinutes() === range.exactStart.minute
        );

        if (!isExcluded) {
          slots.push(
            `${slotStart.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })} - ${slotEnd.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}`
          );
        }

        // Increment the time by 1 hour
        currentHour++;
      }

      return slots;
    };

    const allSlots = generateTimeSlots(startHour, endHour, bookedSlots);
    console.log("Generated time slots:", allSlots);
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.some((bookedSlot) => bookedSlot.time === slot)
    );

    console.log("Available slots:", availableSlots);

    return new Response(
      JSON.stringify({
        availableSlots,
        bookedSlots,
        workingHours: `${startTime} - ${endTime}`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

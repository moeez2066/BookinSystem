import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    const day = searchParams.get("day");

    // Validate input
    if (!bookingId || !day) {
      console.error("Missing booking ID or day in the request.");
      return new Response(
        JSON.stringify({ error: "Booking ID and day are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Fetch the booking details
    console.log(`Fetching booking details for ID: ${bookingId}`);
    const booking = await db.collection("Booking").findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      console.error("Booking not found with ID:", bookingId);
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Booking details fetched:", booking);

    // Fetch the trainer details
    const trainerId = booking.trainer_id;
    console.log(`Fetching trainer details for ID: ${trainerId}`);
    const trainer = await db.collection("Trainers").findOne({
      _id: new ObjectId(trainerId),
    });

    if (!trainer) {
      console.error("Trainer not found with ID:", trainerId);
      return new Response(
        JSON.stringify({ error: "Trainer not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Trainer details fetched:", trainer);

    // Compute the working hours
    const workingHours = trainer.working_hours.split(" - ");
    const startHour = parseInt(workingHours[0].split(" ")[0]) + (workingHours[0].includes("PM") && parseInt(workingHours[0].split(" ")[0]) !== 12 ? 12 : 0);
    const endHour = parseInt(workingHours[1].split(" ")[0]) + (workingHours[1].includes("PM") && parseInt(workingHours[1].split(" ")[0]) !== 12 ? 12 : 0);

    const allSlots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      allSlots.push(`${hour}:00 - ${hour + 1}:00`);
    }

    const formattedAllSlots = allSlots.map(slot => {
      let [start, end] = slot.split(' - ');
      start = convertTo12HourFormat(start);
      end = convertTo12HourFormat(end);
      return `${start} - ${end}`;
    });

    console.log("All working slots computed:", formattedAllSlots);

    // Fetch overlapping bookings and determine unavailable slots
    console.log("Fetching overlapping bookings for trainer:", trainerId);
    const overlappingBookings = await db
      .collection("Booking")
      .find({
        trainer_id: trainerId,
        valid_start_date: { $lte: booking.valid_end_date },
        valid_end_date: { $gte: booking.valid_start_date },
      })
      .toArray();

    console.log("Overlapping bookings fetched:", overlappingBookings);

    const unavailableSlots = overlappingBookings
      .flatMap(b => b.bookedslots)
      .flatMap(slots => slots[day] || [])
      .map(slot => slot.time);

    console.log("Unavailable slots for", day, ":", unavailableSlots);

    // Filter available slots
    const availableSlots = formattedAllSlots.filter(slot => !unavailableSlots.includes(slot));

    console.log("Available slots after filtering:", availableSlots);

    return new Response(
      JSON.stringify({
        availableSlots: availableSlots,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Helper function to convert 24-hour format to 12-hour format with AM/PM
function convertTo12HourFormat(time) {
  let hour = parseInt(time.split(':')[0]);
  const minute = time.split(':')[1];
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = (hour % 12) || 12; // Convert hour to 12-hour format
  return `${hour}:${minute} ${suffix}`;
}

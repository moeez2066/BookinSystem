import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const trainerId = url.searchParams.get("trainerId");
    const day = url.searchParams.get("day");
    const client = await clientPromise;
    const db = client.db("BookingSys");
    const trainer = await db
      .collection("Trainers")
      .findOne(
        { _id: new ObjectId(trainerId) },
        { projection: { working_hours: 1 } }
      );
    const workingHours = trainer.working_hours || "6 AM - 8 PM";
    const [startTime, endTime] = workingHours.split(" - ");
    const parseTime = (timeStr) => {
      const [hour, period] = timeStr.match(/\d+|\D+/g);
      let hours = parseInt(hour, 10);
      if (period.trim().toLowerCase() === "pm" && hours !== 12) hours += 12;
      if (period.trim().toLowerCase() === "am" && hours === 12) hours = 0;
      return hours;
    };
    const startHour = parseTime(startTime);
    const endHour = parseTime(endTime);
    const generateTimeSlots = (start, end) => {
      const slots = [];
      for (let hour = start; hour < end; hour++) {
        const slotTime = new Date(1970, 0, 1, hour).toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            hour12: true,
          }
        );
        const nextHourTime = new Date(1970, 0, 1, hour + 1).toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            hour12: true,
          }
        );
        slots.push(`${slotTime} - ${nextHourTime}`);
      }
      return slots;
    };

    const allSlots = generateTimeSlots(startHour, endHour);

    const bookings = await db
      .collection("Booking")
      .find(
        {
          trainer_id: new ObjectId(trainerId),
          bookedslots: { $elemMatch: { [day]: { $exists: true } } },
        },
        { projection: { bookedslots: 1 } }
      )
      .toArray();

    const bookedSlots = bookings.flatMap((booking) => {
      const dayBooking = booking.bookedslots.find((slot) => slot[day]);
      return dayBooking ? dayBooking[day] : [];
    });

    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

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

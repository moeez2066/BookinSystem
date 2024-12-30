import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db("BookingSys");

  // Extract bookingId from the query parameters
  const url = new URL(request.url);
  const bookingId = url.searchParams.get("bookingId");

  // If bookingId is not provided, return a bad request response
  if (!bookingId) {
    return new Response(JSON.stringify({ error: "Booking ID is required" }), {
      status: 400,
    });
  }

  try {
    // Fetch the booking document from the database using bookingId
    const booking = await db.collection("Booking").findOne({
      _id: new ObjectId(bookingId),
    });

    // If no booking is found, return a not found response
    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
      });
    }

    let validStartDate = booking.valid_start_date || null;
    let validEndDate = booking.valid_end_date || null;
    let childStartDate = null;

    if (booking.rescheduled && booking.parent_booking_id) {
      const parentBooking = await db.collection("Booking").findOne({
        _id: new ObjectId(booking.parent_booking_id),
      });

      if (parentBooking) {
        validStartDate = parentBooking.valid_start_date || validStartDate;
        validEndDate = parentBooking.valid_end_date || validEndDate;
        childStartDate = booking.valid_start_date || null; // Set child start date
      }
    }

    const { client_id, trainer_id, bookedslots, _id } = booking;

    return new Response(
      JSON.stringify({
        valid_start_date: validStartDate || null, // Parent booking start date
        valid_end_date: validEndDate || null, // Parent booking end date
        child_start_date: childStartDate, // Child booking start date (null if not a child booking)
        client_id: client_id,
        trainer_id: trainer_id,
        location: bookedslots[0][Object.keys(bookedslots[0])[0]][0]["location"],
        _id: _id,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    // Handle any errors that occur during the process
    return new Response(
      JSON.stringify({
        error: "An error occurred while fetching the booking data",
      }),
      {
        status: 500,
      }
    );
  }
}

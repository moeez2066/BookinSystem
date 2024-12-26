import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request) {
  try {
    // Parse the request body to get bookingId
    const { bookingId } = await request.json();

    if (!bookingId) {
      return new Response(JSON.stringify({ error: "Booking ID is required" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Check if the booking exists
    const booking = await db.collection("Booking").findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
      });
    }

    // Mark the booking as canceled
    const result = await db.collection("Booking").updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { canceled: true } }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to cancel the booking" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Booking canceled successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: "An error occurred while canceling the booking" }),
      { status: 500 }
    );
  }
}

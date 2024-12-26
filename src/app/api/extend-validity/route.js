import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db("BookingSys");

  try {
    // Parse the request body
    const body = await request.json();
    const { bookingId, newEndDate } = body;

    // Validate the inputs
    if (!bookingId || !newEndDate) {
      return new Response(
        JSON.stringify({ error: "Booking ID and new end date are required" }),
        { status: 400 }
      );
    }

    // Find the booking document
    const booking = await db.collection("Booking").findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        { status: 404 }
      );
    }

    // Update the valid_end_date
    const result = await db.collection("Booking").updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { valid_end_date: new Date(newEndDate) } }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to update the booking" }),
        { status: 500 }
      );
    }

    // Respond with success
    return new Response(
      JSON.stringify({ message: "Booking validity extended successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error extending booking validity:", error);

    // Handle any errors that occur
    return new Response(
      JSON.stringify({ error: "An error occurred while extending the booking validity" }),
      { status: 500 }
    );
  }
}

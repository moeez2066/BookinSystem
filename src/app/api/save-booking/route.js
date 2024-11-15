import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse JSON body from the request

    const {
      trainer_id,
      bookedslots,
      valid_start_date,
      valid_end_date,
      date_of_creation,
    } = body;

    // Validation
    if (
      !trainer_id?.$oid ||
      !bookedslots ||
      !valid_start_date?.$date ||
      !valid_end_date?.$date ||
      !date_of_creation?.$date
    ) {
      return new Response(
        JSON.stringify({ message: "Invalid or missing data." }),
        { status: 400 }
      );
    }

    // Database connection
    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Construct the booking document
    const bookingDocument = {
      trainer_id: new ObjectId(trainer_id.$oid),
      bookedslots,
      valid_start_date: new Date(valid_start_date.$date),
      valid_end_date: new Date(valid_end_date.$date),
      date_of_creation: new Date(date_of_creation.$date),
    };

    // Insert the booking into the database
    const result = await db.collection("Booking").insertOne(bookingDocument);

    return new Response(
      JSON.stringify({
        message: "Booking saved successfully.",
        bookingId: result.insertedId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving booking:", error);
    return new Response(
      JSON.stringify({ message: "Failed to save booking." }),
      { status: 500 }
    );
  }
}

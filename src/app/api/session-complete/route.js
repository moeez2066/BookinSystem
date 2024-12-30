import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { bookingId } = await request.json();
    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Check if the document has the `no_of_completed_sessions` field
    const existingDocument = await db.collection("Booking").findOne(
      { _id: new ObjectId(bookingId) },
      { projection: { no_of_completed_sessions: 1 } }
    );

    if (existingDocument && existingDocument.no_of_completed_sessions !== undefined) {
      // Increment the field if it exists
      await db.collection("Booking").updateOne(
        { _id: new ObjectId(bookingId) },
        { $inc: { no_of_completed_sessions: 1 } }
      );
    } else {
      // Create the field and set it to 1 if it doesn't exist
      await db.collection("Booking").updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { no_of_completed_sessions: 1 } }
      );
    }

    const responsePayload = {
      success: true,
      message: "Session completed successfully",
    };

    return new Response(JSON.stringify(responsePayload), { status: 200 });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "An error occurred",
      }),
      { status: 500 }
    );
  }
}

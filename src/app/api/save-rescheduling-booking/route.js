import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse JSON body
    console.log("Request body:", body);

    const {
      trainer_id,
      client_id,
      bookedslots,
      valid_start_date,
      valid_end_date,
      date_of_creation,
      parentBooking,
      freeSlot,
    } = body;
    // Database connection
    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Construct the booking document
    const bookingDocument = {
      trainer_id: new ObjectId(trainer_id),
      client_id: new ObjectId(client_id),
      bookedslots,
      valid_start_date: new Date(valid_start_date.$date),
      valid_end_date: new Date(valid_end_date.$date),
      date_of_creation: new Date(date_of_creation.$date),
      rescheduled: true,
      parent_booking_id: new ObjectId(parentBooking),
    };

    // Insert the booking into the database
    const result = await db.collection("Booking").insertOne(bookingDocument);
    const insertedBooking = await db.collection("Booking").findOne({
      _id: result.insertedId,
    });

    const clientData = await db
      .collection("users")
      .findOne({ _id: new ObjectId(client_id) });
    const trainerData = await db
      .collection("Trainers")
      .findOne({ _id: new ObjectId(trainer_id) });

    const location =
      bookedslots?.[0]?.[Object.keys(bookedslots[0] || {})?.[0]]?.[0]
        ?.location || null;
    const updateParent = await db
      .collection("Booking")
      .updateOne(
        { _id: new ObjectId(parentBooking) },
        { $push: { free_slots: new Date(freeSlot.$date) } }
      );
    return new Response(
      JSON.stringify({
        message: "Booking saved successfully.",
        bookingId: result.insertedId,
        clientData,
        booking: insertedBooking,
        trainerData,
        location,
        updateParent,
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

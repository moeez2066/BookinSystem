import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      console.log("Client ID is missing");
      return new Response(JSON.stringify({ error: "Client ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("BookingSys");

    console.log("Fetching client data");
    const clientData = await db
      .collection("users")
      .findOne({ _id: new ObjectId(clientId) });

    if (!clientData) {
      console.log("Client not found");
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Fetching bookings for client");
    const bookings = await db
      .collection("Booking")
      .find({ client_id: new ObjectId(clientId) })
      .toArray();

    if (!bookings.length) {
      console.log("No bookings found");
      return new Response(
        JSON.stringify({
          client: clientData,
          bookings: [],
          message: "No bookings found for this client."
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Fetching trainers for bookings");
    const trainerIds = bookings.map((booking) => booking.trainer_id);

    const trainers = await db
      .collection("Trainers")
      .find({ _id: { $in: trainerIds.map((id) => new ObjectId(id)) } })
      .toArray();

    console.log("Enriching bookings with trainer data");
    const enrichedBookings = bookings.map((booking) => {
      const trainer = trainers.find(
        (trainer) => trainer._id.toString() === booking.trainer_id.toString()
      );
      return {
        ...booking,
        trainer: trainer ? { name: trainer.name, email: trainer.email } : null,
      };
    });
    console.log(enrichedBookings);

    console.log("Returning combined data");
    return new Response(
      JSON.stringify({
        client: {
          ...clientData
        },
        bookings: enrichedBookings.map((booking) => ({
          trainerName: booking.trainer?.name || "N/A",
          trainerEmail: booking.trainer?.email || "N/A",
          validStartDate: booking.valid_start_date,
          validEndDate: booking.valid_end_date,
          bookedSlots: booking.bookedslots,
        }))
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching client data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

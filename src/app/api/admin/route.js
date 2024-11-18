import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("BookingSys");

    console.log("Fetching all client data");
    const clients = await db
      .collection("users")
      .find({ role: "client" })
      .toArray();

    if (!clients.length) {
      console.log("No clients found");
      return new Response(JSON.stringify({ message: "No clients found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Fetching bookings for all clients");
    const bookings = await db.collection("Booking").find({}).toArray();

    console.log("Fetching all trainers");
    const trainers = await db.collection("Trainers").find({}).toArray();

    console.log("Enriching bookings with client and trainer data");
    const enrichedBookings = bookings.map((booking) => {
      const client = clients.find(
        (client) => client._id.toString() === booking.client_id.toString()
      );
      const trainer = trainers.find(
        (trainer) => trainer._id.toString() === booking.trainer_id.toString()
      );
      return {
        ...booking,
        _id: booking._id,
        clientName: client ? client.name : "N/A",
        clientEmail: client ? client.email : "N/A",
        trainerName: trainer ? trainer.name : "N/A",
        trainerEmail: trainer ? trainer.email : "N/A",
        validStartDate: booking.valid_start_date,
        validEndDate: booking.valid_end_date,
        bookedSlots: booking.bookedslots,
      };
    });

    console.log("Returning data");
    return new Response(
      JSON.stringify({
        clients: clients.map((client) => ({
          id: client._id.toString(),
          name: client.name,
          email: client.email,
          whatsapp: client.whatsapp,
        })),
        bookings: enrichedBookings,
        trainers: trainers.map((trainer) => ({
          id: trainer._id.toString(),
          name: trainer.name,
          email: trainer.email,
        })),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

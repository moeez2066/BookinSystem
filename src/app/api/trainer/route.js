import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get("trainerId");

    if (!trainerId) {
      console.log("Trainer ID is missing");
      return new Response(JSON.stringify({ error: "Trainer ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("BookingSys");

    console.log("Fetching trainer data");
    const trainerData = await db
      .collection("users")
      .findOne({ _id: new ObjectId(trainerId), role: "trainer" });

    if (!trainerData) {
      console.log("Trainer not found");
      return new Response(JSON.stringify({ error: "Trainer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Fetching bookings for trainer");
    const bookings = await db
      .collection("Booking")
      .find({ trainer_id: new ObjectId(trainerData.trainer_id) })
      .toArray();

    if (!bookings.length) {
      console.log("No bookings found");
      return new Response(
        JSON.stringify({
          trainer: trainerData,
          bookings: [],
          message: "No bookings found for this trainer."
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Fetching clients for bookings");
    const clientIds = bookings.map((booking) => booking.client_id);

    const clients = await db
      .collection("users")
      .find({ _id: { $in: clientIds.map((id) => new ObjectId(id)) }, role: "client" })
      .toArray();

    console.log("Enriching bookings with client data");
    const enrichedBookings = bookings.map((booking) => {
      const client = clients.find(
        (client) => client._id.toString() === booking.client_id.toString()
      );
      return {
        ...booking,
        client: client ? { name: client.name, email: client.email } : null,
      };
    });

    console.log("Returning combined data");
    return new Response(
      JSON.stringify({
        trainer: {
          name: trainerData.name,
          email: trainerData.email,
          whatsapp: trainerData.whatsapp,
        },
        bookings: enrichedBookings.map((booking) => ({
          clientName: booking.client?.name || "N/A",
          clientEmail: booking.client?.email || "N/A",
          validStartDate: booking.valid_start_date,
          validEndDate: booking.valid_end_date,
          bookedSlots: booking.bookedslots,
        })),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching trainer data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

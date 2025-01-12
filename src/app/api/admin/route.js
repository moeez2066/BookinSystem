import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("BookingSys");
    const clients = await db
      .collection("users")
      .find({ role: "client" })
      .toArray();
    if (!clients.length) {
      return new Response(JSON.stringify({ message: "No clients found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const bookings = await db.collection("Booking").find({}).toArray();
    const trainers = await db.collection("users").find({role:'trainer'}).toArray();
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
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

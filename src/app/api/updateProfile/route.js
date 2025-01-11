import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { userId, name, whatsapp } = body;
    console.log(body);

    // Database connection
    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Update the user in the database
    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { name: name, whatsapp: whatsapp } }, // Corrected update parameter
        { returnDocument: 'after' } // Optional: to return the updated document
      );

    return new Response(
      JSON.stringify({
        message: "Profile updated successfully.",
        user: result.value,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
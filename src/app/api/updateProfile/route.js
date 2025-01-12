import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { userId, values: { name, whatsapp } } = body;

    console.log("Parsed body:", body);

    // Validate userId
    if (!ObjectId.isValid(userId)) {
      console.error("Invalid userId:", userId);
      throw new Error("Invalid userId");
    }

    // Database connection
    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!existingUser) {
      console.error("User not found in database with ID:", userId);
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log("Existing user found:", existingUser);

    // Skip update if no changes are required
    if (existingUser.name === name && existingUser.whatsapp === whatsapp) {
      console.log("No update required; values are identical.");
      return new Response(
        JSON.stringify({
          message: "Profile already up to date.",
          user: existingUser,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the user in the database
    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { name, whatsapp } },
        { returnDocument: "after" } // Use returnOriginal: false for older drivers
      );

    if (!result.value) {
      console.error("Update operation did not modify the document.");
      return new Response(
        JSON.stringify({ message: "No changes were made to the profile." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

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

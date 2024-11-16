import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, password } = body;

    if (!name || !email || !whatsapp || !password) {
      return new Response(
        JSON.stringify({ message: "Invalid or missing data." }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Check if the email already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          error: "email_already_registered",
          message: "This email is already registered.",
        }),
        { status: 409 }
      );
    }

    // Create the user document
    const userDocument = {
      name,
      email,
      whatsapp,
      password,
      role: "client", // Default role
    };

    // Insert the user document into the collection
    const result = await db.collection("users").insertOne(userDocument);

    // Respond with the inserted user details
    return new Response(
      JSON.stringify({
        message: "User registered successfully.",
        userId: result.insertedId, // MongoDB's generated ObjectId
        name: userDocument.name, // Use the original userDocument
        role: userDocument.role, // Use the original userDocument
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error); // Log error for debugging
    return new Response(
      JSON.stringify({ message: "Failed to register user." }),
      { status: 500 }
    );
  }
}

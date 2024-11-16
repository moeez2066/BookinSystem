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

    const userDocument = {
      name,
      email,
      whatsapp,
      password,
      role: "client",
    };

    const result = await db.collection("users").insertOne(userDocument);

    return new Response(
      JSON.stringify({
        message: "User registered successfully.",
        userId: result.insertedId,
        name: result.name,
        role: result.role,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to register user." }),
      { status: 500 }
    );
  }
}

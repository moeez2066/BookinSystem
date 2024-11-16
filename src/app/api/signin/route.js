import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required." }),
        { status: 400 }
      );
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Find the user by email
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({
          error: "user_not_found",
          message: "User not found. Please check your email or sign up.",
        }),
        { status: 404 }
      );
    }

    // Check if the password matches
    if (user.password !== password) {
      return new Response(
        JSON.stringify({
          error: "incorrect_credentials",
          message:
            "Incorrect credentials. Please check your email or password.",
        }),
        { status: 401 }
      );
    }

    // If login is successful, return the user ID
    return new Response(
      JSON.stringify({
        message: "Login successful!",
        userId: user._id.toString(), // Return user ID (convert ObjectId to string)
        name: user.name.toString(),
        role: user.role.toString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to sign in. Please try again." }),
      { status: 500 }
    );
  }
}

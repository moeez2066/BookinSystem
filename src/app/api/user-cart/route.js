import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    // Parse the request body to extract the user ID
    const body = await req.json();
    const { userId } = body;

    const client = await clientPromise;
    const db = client.db("BookingSys");

    // Fetch the cart document for the given user ID
    const cart = await db
      .collection("cart")
      .findOne({ user_id: new ObjectId(userId) });

    // Handle the case where the cart is not found
    if (!cart) {
      return new Response(
        JSON.stringify({
          message: "Cart not found for the given user.",
          products: [],
          packages: [],
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Extract product IDs from the cart document
    const productIds = cart.product_ids?.map((id) => new ObjectId(id)) || [];

    // Fetch product details from the products collection
    const products = productIds.length
      ? await db
          .collection("products")
          .find({ _id: { $in: productIds } })
          .toArray()
      : [];

    // Return the product details and packages as a JSON response
    return new Response(
      JSON.stringify({ products: products, packages: cart.packages || [] }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching cart details:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

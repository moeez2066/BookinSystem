import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    // Database connection
    const client = await clientPromise;
    const db = client.db("BookingSys");
    console.log(body);

    // Construct the order document
    const orderDocument = {
      client_id: new ObjectId(body.userId), // Associate with the user's ID
      products: body.products.map((product) => ({
        product_id: new ObjectId(product._id),
        quantity: product.quantity,
        price: product.price,
      })),
      order_date: new Date(),
    };

    // Insert the order into the database
    const result = await db.collection("orders").insertOne(orderDocument);

    // Clear the cart for the user
    await db
      .collection("cart")
      .deleteOne({ user_id: new ObjectId(body.userId) });

    return new Response(
      JSON.stringify({
        message: "Products saved successfully and cart cleared.",
        orderId: result.insertedId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving products or clearing cart:", error);
    return new Response(
      JSON.stringify({ message: "Failed to save products or clear cart." }),
      { status: 500 }
    );
  }
}

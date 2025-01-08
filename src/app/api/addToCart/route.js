import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { productId, userId } = body;

    const client = await clientPromise;
    const db = client.db("BookingSys");

    const cartCollection = db.collection("cart");

    // Convert userId and productId to ObjectId
    const userObjectId = new ObjectId(userId);
    const productObjectId = new ObjectId(productId);

    // Find the document with the matching user_id
    const existingCart = await cartCollection.findOne({ user_id: userObjectId });

    if (existingCart) {
      // If a document exists, update it by adding the productObjectId to the product_ids array
      await cartCollection.updateOne(
        { user_id: userObjectId },
        { $addToSet: { product_ids: productObjectId } } // $addToSet ensures no duplicates
      );
    } else {
      // If no document exists, create a new one
      await cartCollection.insertOne({
        user_id: userObjectId,
        product_ids: [productObjectId]
      });
    }

    return new Response(
      JSON.stringify({ message: "Product added to cart" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return new Response(
      JSON.stringify({ message: "Failed to add product to cart" }),
      { status: 500 }
    );
  }
}

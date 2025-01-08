import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);

    const client = await clientPromise;
    const db = client.db("BookingSys");
    const cartCollection = db.collection("cart");
    const existingCart = await cartCollection.findOne({
      user_id: new ObjectId(body.client_id.$oid),
    });
    if (existingCart) {
      await cartCollection.updateOne(
        { user_id: new ObjectId(body.client_id.$oid) },
        { $addToSet: { packages: { ...body, _id: new ObjectId() } } }
      );
    } else {
      await cartCollection.insertOne({
        user_id: new ObjectId(body.client_id.$oid),
        packages: [{ ...body, _id: new ObjectId() }],
      });
    }
    return new Response(JSON.stringify({ message: "Product added to cart" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return new Response(
      JSON.stringify({ message: "Failed to add product to cart" }),
      { status: 500 }
    );
  }
}

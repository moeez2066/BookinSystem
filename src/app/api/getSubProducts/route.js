import { MongoClient } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { type } = body;

    const client = await clientPromise;
    const db = client.db("BookingSys");

    const products = await db
      .collection("products")
      .find({ type: type })
      .toArray();

    console.log(products);

    return new Response(JSON.stringify({ subProducts: products }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching subproducts:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch subproducts." }),
      { status: 500 }
    );
  }
}

import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, product_id, package_id } = body;

    if (!user_id || (!product_id && !package_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid request data" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("BookingSys");
    const cartCollection = db.collection("cart");

    // Convert user_id and product_id/package_id to ObjectId
    const userIdObj = new ObjectId(user_id);
    const productIdObj = product_id ? new ObjectId(product_id) : null;
    const packageIdObj = package_id ? new ObjectId(package_id) : null;

    // Find user's cart
    const existingCart = await cartCollection.findOne({
      user_id: userIdObj,
    });

    if (!existingCart) {
      return new Response(
        JSON.stringify({ message: "Cart not found" }),
        { status: 404 }
      );
    }

    if (productIdObj) {
      // Remove the product from product_ids
      await cartCollection.updateOne(
        { user_id: userIdObj },
        { $pull: { product_ids: productIdObj } } // Use ObjectId directly
      );
    }

    if (packageIdObj) {
      // Remove the package from the packages array
      await cartCollection.updateOne(
        { user_id: userIdObj },
        { $pull: { packages: { _id: packageIdObj } } } // Use ObjectId directly
      );
    }

    return new Response(
      JSON.stringify({ message: "Cart updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cart:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update cart" }),
      { status: 500 }
    );
  }
}

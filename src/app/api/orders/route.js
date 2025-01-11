import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { role, userId } = body;

    const client = await clientPromise;
    const db = client.db("BookingSys");

    let orders;

    if (role === "admin") {
      // Fetch all orders
      orders = await db.collection("orders").find({}).toArray();

      // Fetch client details for each order
      const clientDetails = await db
        .collection("users")
        .find({
          _id: { $in: orders.map((order) => order.client_id) },
        })
        .toArray();

      // Map client details into the orders
      const clientMap = clientDetails.reduce((map, client) => {
        map[client._id.toString()] = client;
        return map;
      }, {});

      // Fetch product details
      const productDetails = await db
        .collection("products")
        .find({
          _id: {
            $in: orders.flatMap((order) =>
              order.products.map((product) => product.product_id)
            ),
          },
        })
        .toArray();

      // Map product details into the orders
      const productMap = productDetails.reduce((map, product) => {
        map[product._id.toString()] = product;
        return map;
      }, {});

      const result = orders.map((order) => ({
        order_id: order._id,
        client: clientMap[order.client_id.toString()],
        products: order.products.map((product) => ({
          ...product,
          details: { ...productMap[product.product_id.toString()], price: product.price } || { price: product.price }, // Use price from the order collection
        })),
        order_date: order.order_date,
      }));

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Fetch orders for the specific client
      orders = await db
        .collection("orders")
        .find({ client_id: new ObjectId(userId) })
        .toArray();

      // Fetch product details
      const productDetails = await db
        .collection("products")
        .find({
          _id: {
            $in: orders.flatMap((order) =>
              order.products.map((product) => product.product_id)
            ),
          },
        })
        .toArray();

      // Map product details into the orders
      const productMap = productDetails.reduce((map, product) => {
        map[product._id.toString()] = product;
        return map;
      }, {});

      const result = orders.map((order) => ({
        order_id: order._id,
        products: order.products.map((product) => ({
          ...product,
          details: { ...productMap[product.product_id.toString()], price: product.price } || { price: product.price }, // Use price from the order collection
        })),
        order_date: order.order_date,
      }));

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error processing orders:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

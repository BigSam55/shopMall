import discountModel from "@/models/discount";
import orderModel from "@/models/orders";
import productModel from "@/models/products";
import connectDb from "@/utils/db";
const stripe = require("stripe")(process.env.STRIPE_SECRET);
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const {
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      zip,
      country,
      cartProducts,
      sumtotal,
    } = await req.json();

    // Validate ObjectIds
    const productIds = cartProducts;

    await connectDb();
    const uniqueIds = [...new Set(productIds)];
    const productInfos =await productModel.find({ _id: uniqueIds })
    const discounInfos = await discountModel.find({ _id: uniqueIds })

    const allProducts = [...productInfos, ...discounInfos]

    let line_items = [];
    for (const productId of uniqueIds) {
      const productInfo = allProducts.find(
        (p) => p._id.toString() === productId
      );

      const quantity = productIds.filter((id) => id === productId).length;

      if (quantity > 0 && productInfo) {
        line_items.push({
          quantity,
          price_data: {
            currency: "USD",
            unit_amount: productInfo.price * 100,
            product_data: {
              name: productInfo.productName,
            },
          },
        });
      }
    }

    const orderDoc = await orderModel.create({
      line_items,
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      zip,
      country,
      paid: false,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      customer_email: email,
      success_url: `${process.env.PUBLIC_URL}/checkout?success=1`,
      cancel_url: `${process.env.PUBLIC_URL}/checkout?canceled=1`,
      metadata: { orderId: orderDoc._id.toString() },
    });

    return new NextResponse(JSON.stringify({ url: session.url }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    return new NextResponse(
      JSON.stringify({ message: error.message || "Server Error" }),
      {
        status: 500,
      }
    );
  }
};

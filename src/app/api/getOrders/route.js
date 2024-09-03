import orderModel from "@/models/orders";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDb();
    const orders = await orderModel.find().sort({ createdAt: -1 });
    

    if (orders.length > 0) {
      return new NextResponse(JSON.stringify(orders), { status: 200 });
    }
   else {
      return new NextResponse(JSON.stringify({ message: "No oders found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return new NextResponse(JSON.stringify({ message: "Server Error" }), {
      status: 500,
    });
  }
};

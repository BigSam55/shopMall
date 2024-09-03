import productModel from "@/models/products";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    await connectDb();
    const id = params.id;
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return new NextResponse(JSON.stringify({ msg: "Product not found" }), { status: 404 });
    }
    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(JSON.stringify({ msg: "Server error" }), { status: 500 });
  }
};
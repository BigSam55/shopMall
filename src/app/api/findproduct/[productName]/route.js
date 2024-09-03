import discountModel from "@/models/discount";
import productModel from "@/models/products";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    await connectDb();
    const productName = params.productName;
    const product = await productModel.findOne({ productName: productName });
    const discount = await discountModel.findOne({ productName: productName });
    if (product) {
      return new NextResponse(JSON.stringify(product), { status: 200 });
    }
    if (discount) {
      return new NextResponse(JSON.stringify(discount), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ msg: "Product not found" }), {
        status: 404,
      });
    }
  } catch (err) {
    console.log(err.message);
    return new NextResponse(JSON.stringify({ msg: "Server error" }), {
      status: 500,
    });
  }
};

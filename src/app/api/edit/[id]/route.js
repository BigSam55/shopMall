import productModel from "@/models/products";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    await connectDb();
    const id = params.id;
    const product = await productModel.findById(id);
    if (!product) {
      return new NextResponse(JSON.stringify({ msg: "Product not found" }), { status: 404 });
    }
    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(JSON.stringify({ msg: "Server error" }), { status: 500 });
  }
};

export const PUT = async (request, { params }) => {
  try {
    await connectDb();
    const id = params.id;
    const { productName,
      price,
      quantity,
      description,
      selectedCategory,
      imageUrls, } = await request.json();
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { productName,
        price,
        quantity,
        description,
        category:selectedCategory,
        imageUrls,},
      { new: true }
    );
    if (!updatedProduct) {
      return new NextResponse(JSON.stringify({ msg: "Product not found" }), { status: 404 });
    }
    return new NextResponse(JSON.stringify(updatedProduct), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(JSON.stringify({ msg: "Server error" }), { status: 500 });
  }
};

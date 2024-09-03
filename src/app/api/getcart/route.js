import discountModel from "@/models/discount";
import productModel from "@/models/products";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    await connectDb();

    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid input: 'ids' must be an array" }),
        { status: 400 }
      );
    }

    const products = await productModel.find({ _id: ids } );
    const discounts = await discountModel.find({ _id:ids });
    

    if (products.length === 0 && discounts.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No products or discounts found with the given IDs" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ products, discounts }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching products and discounts:', error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch products and discounts" }),
      { status: 500 }
    );
  }
};

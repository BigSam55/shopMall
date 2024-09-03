import discountModel from "@/models/discount";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";

// Handler for creating a new product
export const POST = async (request) => {
  const {  productName,
    price,
    quantity,
    description,
    selectedCategory,
    imageUrls,
   discountPercent } = await request.json();

  try {
    await connectDb();
    const products = new discountModel({
        productName,
        price,
        quantity,
        description,
        image: imageUrls,
      category: selectedCategory,
       discountPercent,
    });

    await products.save();
    console.log(products);

    if (products) {
      return new NextResponse(JSON.stringify({ message: "Product added" }), { status: 200 });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return new NextResponse(JSON.stringify({ message: "Server Error" }), { status: 500 });
  }
};

// Handler for fetching all products

export const GET = async () => {
  try {
    await connectDb();
    const products = await discountModel.find();
   
    if (products.length > 0) {
      return new NextResponse(JSON.stringify(products), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ message: "No products found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return new NextResponse(JSON.stringify({ message: "Server Error" }), { status: 500 });
  }
};


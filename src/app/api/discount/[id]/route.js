
import categoryModel from "@/models/categories";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";
import mongoose  from "mongoose";
import discountModel from "@/models/discount";

export const DELETE = async ( req, {params} ) => {
    const  {id}  = params;
  try {
    await connectDb();
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return new NextResponse(JSON.stringify({ msg: "Invalid ID format" }), { status: 400 });
      }
    const category = await discountModel.findByIdAndDelete(id);
    if (!category) {
      return new NextResponse(JSON.stringify({ msg: "category not found" }), { status: 404 });
    }
    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(JSON.stringify({ msg: "Server error" }), { status: 500 });
  }
};

import connectDb from "@/utils/db";
import { NextResponse } from "next/server";
import mongoose  from "mongoose";
import featuredModel from "@/models/featured";

export const DELETE = async ( req, {params} ) => {
    const  {id}  = params;
  try {
    await connectDb();
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return new NextResponse(JSON.stringify({ msg: "Invalid ID format" }), { status: 400 });
      }
    const heropage = await featuredModel.findByIdAndDelete(id);
    if (!heropage) {
      return new NextResponse(JSON.stringify({ msg: "ID not found" }), { status: 404 });
    }
    return new NextResponse(JSON.stringify(heropage), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(JSON.stringify({ msg: "Server error" }), { status: 500 });
  }
};
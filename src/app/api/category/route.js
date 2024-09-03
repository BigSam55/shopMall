import categoryModel from "@/models/categories";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    const {category} = await req.json();
    try {
        await connectDb();
        const categories = new categoryModel({
            productCategory:category,
        })
        await categories.save();
        console.log(categories);
        if(categories){
            return new NextResponse(JSON.stringify({ message: "Catergory Added" }), { status: 200 });
        }
        
    } catch (error) {
        console.error("Server Error:", error);
    return new NextResponse(JSON.stringify({ message: "Server Error" }), { status: 500 });
        
    }
};

export const GET = async () => {
    try {
      await connectDb();
      const catergory = await categoryModel.find();
     
      if (catergory.length > 0) {
        return new NextResponse(JSON.stringify(catergory), { status: 200 });
      } else {
        return new NextResponse(JSON.stringify({ message: "No category found" }), { status: 404 });
      }
    } catch (error) {
      console.error("Server Error:", error);
      return new NextResponse(JSON.stringify({ message: "Server Error" }), { status: 500 });
    }
  };

  
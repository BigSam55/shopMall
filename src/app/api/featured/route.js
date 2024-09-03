
import featuredModel from "@/models/featured";
import connectDb from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    const {title,
        imageUrls,
        description} = await req.json();
    try {
        await connectDb();
        const heropage = new featuredModel({
            title:title,
          image:imageUrls,
          description:description
        })
        await heropage.save();
        console.log(heropage);
        if(heropage){
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
      const heropage = await featuredModel.find();
     
      if (heropage.length > 0) {
        return new NextResponse(JSON.stringify(heropage), { status: 200 });
      } else {
        return new NextResponse(JSON.stringify({ message: "No category found" }), { status: 404 });
      }
    } catch (error) {
      console.error("Server Error:", error);
      return new NextResponse(JSON.stringify({ message: "Server Error" }), { status: 500 });
    }
  };

  
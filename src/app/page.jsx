"use client";
import React from "react";
import { useSession } from "next-auth/react";
import DiscountDisplay from "@/Components/discount/page";
import ProductDisplay from "@/Components/products/page";
import HeroPage from "@/Components/heropage/page";
import Navbar from "@/Components/Navbar/navBar";
import Footer from "@/Components/footer/page";

export default function Home() {
  const session = useSession();
  const { status } = session;

  if (status === "loading") {
    return <div className="loader"></div>;
  }

  return (
    <div className="bg-white text-black">
      <Navbar/>
         <HeroPage/>
        <ProductDisplay/>
        <DiscountDisplay/>
        <Footer/>
        
     
    
    </div>
  );
}

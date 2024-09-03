"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DiscountDisplay from "@/Components/discount/page";
import ProductDisplay from "@/Components/products/page";
import HeroPage from "@/Components/heropage/page";


const Profile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.push("/login");
      } else if (session.user.role === "admin") {
        router.replace("/dashboard");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="loader"></div>;
  }

  if (!session || session.user.role === "admin") {
    // While the router is redirecting, return null to avoid rendering anything else.
    return null;
  }

  return (
    <div>
      <p className="bg-inherit text-center text-[7px]  md:text-sm text-gray-800 font-mono -mb-3 mt-1 md:-mb-7 animate-pulse ">Welcome, <span className="font-semibold">{session.user.name} </span>Shop your favorite items from ShopMall..</p>
       <HeroPage/>
        <ProductDisplay/>
        <DiscountDisplay/>
    </div>
  );
};

export default Profile;

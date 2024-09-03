"use client";
import { useSession } from "next-auth/react";
import AdminLayout from "@/Components/AdminLayout/layout";
import React, { useState } from "react";
import DiscountForm from "@/Components/discountForm";
import DiscountPage from "@/Components/discountPage";

export default function DiscountProduct() {
  const { status } = useSession();
  const [button, setButton] = useState(false);

  const handleClick = () => {
    setButton(!button);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 lg:p-12">
        <div className=" flex justify-between content-center mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Discount
          </h1>
          <button onClick={handleClick} className="text-white border h-10 rounded-md px-2 py-1 bg-blue-800 hover:bg-blue-900 hover:text-white md:px-4 md:py-1">
            {button ? "View discount" : "Upload"}
          </button>
        </div>

        <div>{button ? <DiscountForm /> : <DiscountPage />}</div>
      </div>
    </AdminLayout>
  );
}

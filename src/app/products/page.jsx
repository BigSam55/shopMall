"use client";
import AdminLayout from "@/Components/AdminLayout/layout";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useSession } from "next-auth/react";
import {useRouter} from "next/navigation";
import LogRedirect from "@/Components/modals/logRedirect";

export default function Product() {
  const { status, data:session } = useSession();
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  
  

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/product");
      setProducts(res.data);
    } catch (error) {
      setErr("Failed to fetch products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProducts();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="loader"></div>;
  }
  if (status === "unauthenticated") {
    return <div><LogRedirect/></div>;
  }
  return (
    <AdminLayout>
      <div className="container mx-auto p-1 box-border">
        <div className="bg-white shadow-md rounded p-6 justify-evenly" data-aos="zoom-out">
          {err && (
            <p className="text-red-500 mb-4" data-aos="zoom-out">
              {err}
            </p>
          )}
          <div className="flex justify-between item-center md:p-3 ">
            <h1 className="text-xl md:2xl font-bold mb-4">Product List</h1>
            <div className="font-medium flex justify-center content-center gap-[0.15rem] md:gap-3">
              <Link
                href={"/products/new"}
                className=" hidden h-10 md:block text-[1rem] px-[6px] py-[3px] md:px-2 md:py-2 text-white rounded-md gap-0 md:gap-1 shadow-md bg-blue-700 hover:bg-blue-900 font-normal"
              >
              Add new products
              </Link>
              <Link
                href={"/products/discount"}
                className=" hidden h-10 md:block text-[1rem] px-[6px] py-[3px] md:px-2 md:py-2 text-white rounded-md gap-0 md:gap-1 shadow-md bg-blue-700 hover:bg-blue-900 font-normal"
              >
              Add Discount
              </Link>
             
            </div>
            
          </div>

          <div className=" flex gap-1 md:hidden items-center -mt-3 mb-2 ">
              <Link
                href={"/products/new"}
                className="md:hidden  h-5 text-[10px] px-[4px] py-[4px]  text-white rounded-sm bg-blue-700 hover:bg-blue-900 "
              >
              Add Product
              </Link>
              <Link
                href={"/products/discount"}
                className="md:hidden  h-5 text-[10px] px-[4px] py-[4px]  text-white rounded-sm bg-blue-700 hover:bg-blue-900 "
              >
              Add Discount
              </Link>

              </div>
          <div className="overflow-x-hidden">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-1 px-1 sm:px-4 border-b-2 border-gray-300 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="py-1 px-1 sm:px-4 border-b-2 border-gray-300 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="py-1 px-1 sm:px-4 border-b-2 border-gray-300 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="py-1 px-1 sm:px-4 border-b-2 border-gray-300 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="py-1 px-1 sm:px-4 border-b-2 border-gray-300 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="py-1 px-1 sm:px-4 border-b border-gray-300 text-xs sm:text-sm text-wrap">
                      {product.productName}
                    </td>
                    <td className="py-1 px-1 sm:px-4 border-b border-gray-300 text-xs sm:text-sm text-wrap">
                      ${product.price}
                    </td>
                    <td className="py-1 px-1 sm:px-4 border-b border-gray-300 text-xs sm:text-sm text-wrap">
                      {product.quantity}
                    </td>
                    <td className="py-1 px-1 sm:px-4 border-b border-gray-300 text-xs sm:text-sm text-wrap">
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {product.image.map((url, index) => (
                          <Image
                            key={index}
                            src={url}
                            alt={`product image ${index}`}
                            width={20}
                            height={20}
                            className="rounded"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-1 px-1 sm:px-4 border-b border-gray-300 text-xs sm:text-sm">
                      <div className="flex gap-[0.18rem] md:gap-2">
                        <Link href={`/products/edit/${product._id}`} className="font-[1rem]">
                          <button className="text-[10px] px-[4px] py-[2px] md:px-2 md:py-1 text-white rounded-sm flex md:gap-1 font-normal shadow-md bg-blue-700 hover:bg-blue-900">
                            Edit
                            <CiEdit className=" hidden md:flex text-[1rem] md:text-[1.4rem]" />
                          </button>
                        </Link>
                        <Link href={`/products/delete/${product._id}`}>
                        <button className="text-[10px] px-[6px] py-[2px] md:px-2 md:py-1 text-white rounded-sm flex md:gap-1 font-normal shadow-md bg-red-700 hover:bg-blue-900 justify-center content-center">
                          Delete
                            <CiTrash className="hidden md:flex  p-[1px] md:text-[1.5rem]" />

                            </button>
                           
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

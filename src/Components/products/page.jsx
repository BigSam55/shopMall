"use client";
import Link from "next/link";
import React, { useState, useEffect} from "react";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaSpinner, FaCartPlus } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";


const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/product");
        setProducts(res.data);
      } catch (error) {
        setError("Failed to fetch products");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  return { products, error, loading };
};




export default function ProductDisplay() {
  const { status } = useSession();
  const { products, error, loading } = useProducts();
  const [likedProducts, setLikedProducts] = useState({});

  const toggleLike = (productId) => {
    setLikedProducts((prevLikedProducts) => ({
      ...prevLikedProducts,
      [productId]: !prevLikedProducts[productId],
    }));
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-600 h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="bg-white relative py-6 ">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-4 sm:py-24 md:max-w-3xl md:p-6 lg:max-w-7xl lg:px-8  ">
        <h2 className=" text-sm md:text-2xl lg:text-3xl mb-8 font-bold pb-2">Products</h2>

        <div className="grid grid-cols-4 gap-x-[2rem] gap-y-10 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8 ">
          {products.map((product) => (
            <div key={product.id}>
              <Link href={`/${product.productName}`} className="block">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md md:rounded-lg bg-gray-50 xl:aspect-h-8 xl:aspect-w-7 transition-all hover:-translate-y-1 ">
                  <Image
                    src={product.image[0]}
                    width={200}
                    height={200}
                    alt={`${product.productName} image`}
                    className=" h-20 w-full md:h-60 md:w-full object-fill object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-1 text-[0.5rem] text-gray-700 md:text-sm font-semibold">{product.productName}</h3>
                <p className=" text-[0.6rem] text-gray-700 md:text-sm font-extrabold">${product.price}</p>
              </Link>

              <div className="hidden absolute md:flex justify-center top-[8rem] ml-1 ">

                  <button 
                    onClick={() => toggleLike(product._id)}
                    className='bg-white w-5 h-5  md:w-8 md:h-8 flex justify-center items-center md:p-2 rounded-full'
                  >
                    {likedProducts[product._id] ? (
                      <FaHeart className="text-red-600 text-xl md:text-xl" />
                    ) : (
                      <FaHeart className="text-gray-300 text-xl md:text-xl" />
                    )}
                  </button>
                </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

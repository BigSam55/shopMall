"use client";
import React, { useState, useEffect } from "react";
import style from "./page.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Scrollbar } from "swiper/modules";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

export default function DiscountDisplay() {
  const [discountProducts, setDiscountProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/discount");
        setDiscountProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching discount products");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleLike = (productId) => {
    setLikedProducts((prevLikedProducts) => ({
      ...prevLikedProducts,
      [productId]: !prevLikedProducts[productId],
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center">
    <FaSpinner className="animate-spin text-white h-6 w-8 text-4xl" />
      </div>
  }

  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  return (
    <>

      <div className={style.swipContainer}>
      
        <h1>Discount Sales</h1>
        <Swiper
          
          scrollbar={true}
          draggable={true}
          modules={[Scrollbar]}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {discountProducts.map((discount) => (
            <SwiperSlide key={discount._id}>
              <div className={style.mContent}>
                <div className={style.mImage}>
                  <Link href={`/${discount.productName}`}>
                    <Image
                      src={discount.image[0]}
                      width={200}
                      height={300}
                      alt={discount.productName}
                    />
                  </Link>
                </div>
                <div className={style.mtext}>
                  <h6>{discount.productName}</h6>
                </div>
                <div className={style.mPrice}>
                  <p className={style.discountedPrice}>${discount.price}</p>
                  
                </div>
                <div className="absolute  sm:flex md:gap-[9.3rem] lg:gap-[11rem] md:justify-between content-between items-center px-0">
                <p className={style.originalPrice}>-{discount.discountPercent}%</p>
                  <button 
                    onClick={() => toggleLike(discount._id)}
                    className=' hidden md:flex bg-white w-5 h-5  md:w-8 md:h-8 justify-center items-center md:p-2 rounded-full'
                  >
                    {likedProducts[discount._id] ? (
                      <FaHeart className="text-red-600 text-xl md:text-xl" />
                    ) : (
                      <FaHeart className="text-gray-300 text-xl md:text-xl" />
                    )}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

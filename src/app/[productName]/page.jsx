'use client'
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon } from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';
import Image from 'next/image';
import axios from 'axios';
import { CartContext } from '@/Components/CartContext/cart';
import { FaSpinner } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

const reviews = { href: '#', average: 4, totalCount: 117 };
const productx = {
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [
    { name: 'XXS', inStock: false },
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: true },
    { name: '2XL', inStock: true },
    { name: '3XL', inStock: true },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Overview({ params }) {
  const { addTocart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const { productName } = params;
  const [activeImage, setActiveImage] = useState('');
  const [btnloader, setBtnloader] = useState(false);
  const router = useRouter();
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/findproduct/${productName}`);
        setProduct(res.data);
        if (res.data.image.length > 0) {
          setActiveImage(res.data.image[0]);
        }
      } catch (error) {
        console.error('Failed to fetch product', error);
      }
    };

    if (productName) {
      fetchProduct();
    }
  }, [productName]);

  if (!product) return <div className="loader"></div>;
  const click = ()=>{
    setBtnloader(true);
    setTimeout(()=>{
      setBtnloader(false);
    }, 1000);
    addTocart(product._id)
  }
  const back=()=>{
    router.back();
  }

  return (
    <div className="bg-white px-4 ">
      <div className="pt-4">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2  sm:px-6 lg:max-w-7xl lg:px-8 font-semibold"
          >
            {product.category} / <li className="text-sm px-1 font-semibold ">
              <a href={product.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.productName}
              </a>
            </li>
          </ol>
        </nav>
        <div className='py-2'>
          <button onClick={()=>back()}>

          <p className='flex text-sm p-4'><IoIosArrowBack className='text-blue-950 font-bold text-xl'/>back</p>
          </button>
          
        </div>

        {/* Image gallery */}
        <div className="mx-auto  mt-6 max-w-2xl py-4 px-4 shadow-md sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7 ">
            <div className=" flex aspect-w-2 aspect-h-2 overflow-hidden rounded-lg  justify-center">
              <Image
                src={activeImage}
                alt={`${product.productName} main image`}
                width={400}
                height={200}
                className="product-image overflow-hidden rounded-md"
              />
            </div>
            <div className="flex mt-1 justify-center overflow-hidden">
              {product.image.map((productImage, index) => (
                <button key={index} onClick={() => setActiveImage(productImage)} className="mr-2">
                  <Image
                    src={productImage}
                    alt={`${product.productName} thumbnail ${index + 1}`}
                    width={60}
                    height={60}
                    className={`thumbnail-image ${activeImage === productImage ? 'border border-blue-400 rounded-md' : ''}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-5 px-4 justify-evenly sm:px-6 lg:px-0">
            <div className="lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight p-4 px-0 text-gray-900 sm:text-3xl text-wrap">
                {product.productName}
              </h1>
              <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>
              <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          reviews.average > rating ? 'text-amber-600' : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0',
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{reviews.average} out of 5 stars</p>
                  <a href={reviews.href} className="ml-3 text-sm font-medium text-gray-900 hover:text-sky-500">
                    {reviews.totalCount} reviews
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6">
              
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <fieldset aria-label="Choose a color" className="mt-4">
                    <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex items-center space-x-3">
                      {productx.colors.map((color) => (
                        <Radio
                          key={color.name}
                          value={color}
                          aria-label={color.name}
                          className={({ focus, checked }) =>
                            classNames(
                              color.selectedClass,
                              focus && checked ? 'ring ring-offset-1' : '',
                              !focus && checked ? 'ring-2' : '',
                              'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none',
                            )
                          }
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              color.class,
                              'h-8 w-8 rounded-full border border-black border-opacity-10',
                            )}
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div>

                {/* Sizes */}
                {/* <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Size guide
                    </a>
                  </div> */}
                  {/* <fieldset aria-label="Choose a size" className="mt-4">
                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                    > */}
                      {/* {productx.sizes.map((size) => (
                        <Radio
                          key={size.name}
                          value={size}
                          disabled={!size.inStock}
                          className={({ focus }) =>
                            classNames(
                              size.inStock
                                ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                : 'cursor-not-allowed bg-gray-50 text-gray-200',
                              focus ? 'ring-2 ring-blue-500' : '',
                              'group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                            )
                          }
                        >
                          {({ checked, focus }) => (
                            <>
                              <span>{size.name}</span>
                              {size.inStock ? (
                                <span
                                  className={classNames(
                                    checked ? 'border-blue-500' : 'border-transparent',
                                    focus ? 'border' : 'border-2',
                                    'pointer-events-none absolute -inset-px rounded-md',
                                  )}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                >
                                  <svg
                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    stroke="currentColor"
                                  >
                                    <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                  </svg>
                                </span>
                              )}
                            </>
                          )}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>
                </div> */}

                <button
                  onClick={() => click()}
                  type="button"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-900 px-8 py-3 text-base font-medium text-white hover:bg-blue-800"
                >
                {btnloader ? (<div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-white h-6 w-8 text-4xl" />
                </div>): "Add to Cart"}

                </button>
              
            </div>
          </div>

          <div className="lg:col-span-12 mt-10 lg:mt-16">
            <div className="lg:col-span-7">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900 p-2">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

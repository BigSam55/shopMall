"use client";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { CartContext } from "@/Components/CartContext/cart";
import { FaSpinner } from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BsTrash3 } from "react-icons/bs";
import { GiShoppingCart } from "react-icons/gi";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { status } = useSession();
  const { cartProducts, removeFromCart, addTocart, clearCart, deleteFromCart } =
    useContext(CartContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (cartProducts.length > 0) {
      setLoading(true);
      axios
        .post("/api/getcart", { ids: cartProducts })
        .then((response) => {
          const allItems = [...response.data.products, ...response.data.discounts];
          setItems(allItems);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [cartProducts]);

  let total = 0;
  for (const productId of cartProducts) {
    const item = items.find((i) => i._id === productId);
    if (item) {
      const price = item.price || item.discountAmount || 0;
      total += price;
    }
  }

  if (status === "loading") {
    return <div className="loader"> </div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-600 h-6 w-6" />
      </div>
    );
  }

  const handleCheckout = () => {
    setBtnLoader(true);
    // Simulate checkout process
    setTimeout(() => {
      router.push("/checkout");
      setBtnLoader(false);
    }, 5000);
  };

  return (
    <div className="relative mx-auto w-full max-w-xl transform overflow-hidden bg-white shadow-xl rounded-lg mt-8 p-2">
      <div className="flex h-full flex-col">
        <div className="flex-1 px-4 py-6 sm:px-6">
          <div className="block">
            {cartProducts.length > 0 && (
              <div className="flex justify-between content-between p-2">
                <h2 className="text-xl font-semibold md:text-lg text-gray-900">
                  Shopping Cart
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 "
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
          {cartProducts.length === 0 && (
            <div className="p-1 flex justify-center content-center">
              <div className="space-x-4 content-start">
                <GiShoppingCart size={150} className="text-blue-700 " />
                <p className="text-normal font-sm text-center text-gray-900">
                  Your cart is empty!..
                </p>
              </div>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-blue-600 h-10 w-10 text-4xl" />
            </div>
          ) : (
            items.length > 0 && (
              <div className="mt-6 p-2">
                <ul role="list" className="-my-4 divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item._id} className="flex py-2">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={item.image[0]}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col justify-center content-center">
                        <h3 className="text-sm text-wrap p-1 flex flex-shrink-0 mb-2">
                          <a href={item.href}>{item.productName}</a>
                        </h3>
                        <div className="flex justify-between text-base font-medium text-gray-900 text-wrap">
                          <div className="flex items-center gap-1 text-sm">
                            <button
                              type="button"
                              onClick={() => addTocart(item._id)}
                              className="rounded-sm border bg-white px-[0.1rem] py-[0.1rem] shadow-sm hover:bg-blue-800 hover:text-white text-sm"
                            >
                              <FaPlus className="text-blue-600 hover:text-white text-sm" />
                            </button>
                            <p className="text-black text-sm">
                              {
                                cartProducts.filter((id) => id === item._id)
                                  .length
                              }
                            </p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item._id)}
                              className="rounded-sm border bg-white px-[0.1rem] py-[0.1rem] shadow-sm hover:bg-blue-800 hover:text-white text-sm"
                            >
                              <FaMinus className="text-blue-600 hover:text-white text-sm" />
                            </button>
                          </div>
                          <div className="flex items-center text-sm">
                            <p>${item.price || item.discountAmount}</p>
                            <button
                              onClick={() => deleteFromCart(item._id)}
                              className="ml-2 py-1 px-2"
                            >
                              <BsTrash3 className="text-sm text-blue-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
        {cartProducts.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p className="font-bold">${total.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCheckout}
                className="flex items-center justify-center w-full rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-800"
              >
                {btnLoader ? (
                  <div className="flex justify-center items-center">
                    <FaSpinner className="animate-spin text-white h-6 w-6" />
                  </div>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                or{" "}
                <Link href="/">
                  <button className="font-medium text-blue-600 hover:text-blue-500">
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

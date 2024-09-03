'use client'
import { useRouter, usePathname } from "next/navigation";
import { CartContext } from "@/Components/CartContext/cart";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { useState, useEffect, useContext } from "react";
import PaySucess from "@/Components/modals/sucess";
import LogRedirect from "@/Components/modals/logRedirect";
import PayCancel from "@/Components/modals/cancel";


export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const { cartProducts, deleteFromCart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (status !== "authenticated") {
      setShowModal(true);
      return;
    }
    if (cartProducts.length > 0) {
      setLoading(true);
      axios
        .post("/api/getcart", { ids: cartProducts })
        .then((response) => {
          const allItems =[...response.data.products, ...response.data.discounts];
          setProducts(allItems);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts, status]);

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }
 

  const goToPay = async () => {
    
    setLoading(true);

    try {
      if (!firstName ||!lastName ||!email ||!address ||!city ||!state ||!zip ||!country) {
        setErr("All fields are required.");
      }
      const res = await axios.post("/api/checkout", {
        firstName,
        lastName,
        email,
        address,
        city,
        state,
        zip,
        country,
        cartProducts,
      });

      if (res.status !== 200) {
        throw new Error("Payment failed");
      } else {
        router.push(res.data.url);
        clearCart();
       
      }
     
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  };
 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <LogRedirect/>
    );
  }

  if(window.location.href.includes('success')){
    return <div><PaySucess/></div>
    
  }
  if(window.location.href.includes('canceled')){
    return <div><PayCancel/></div>
    
  }

  return (
    <>
      {status === "authenticated" && cartProducts.length > 0 && (
        <div className="relative mx-auto w-full max-w-7xl transform overflow-hidden rounded-lg mt-8 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Section */}
            <div className="relative flex-1 bg-gray-50 shadow-md rounded-lg p-4">
              <h1 className="text-lg font-medium text-gray-900 pt-4 pb-4">Order Summary</h1>
              <div className="mt-4">
                <div className="flow-root">
                  <ul role="list" className="divide-y divide-gray-200 justify-center bg-white rounded-md px-2 shadow-sm overflow-hidden">
                    {products.map((product) => (
                      <li key={product._id} className="flex py-2">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
                          {product.image.map((url, index) => (
                            <Image
                              key={index}
                              src={url}
                              alt={product.productName}
                              width={100}
                              height={100}
                              className="h-full w-full object-cover object-center"
                            />
                          ))}
                        </div>
                        <div className="ml-2 flex flex-1 flex-col justify-center content-center">
                        <h3 className="text-sm text-wrap p-1 flex flex-shrink-0 mb-2">
                          <a href={product.href}>{product.productName}</a>
                        </h3>
                          <div className="flex justify-between text-base font-medium text-gray-900 px-2 -mt-3">
                          <div className="block items-center text-sm font-semibold">
                            <p>${product.price}</p>
                            <button
                              onClick={() => deleteFromCart(product._id)}
                              className=" py-1 px-2"
                            >
                              <BsTrash3 className="text-sm text-blue-600 -mt-1" />
                            </button>
                          </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* Checkout Section */}
            <div className="flex-1 bg-gray-50 shadow-md rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 pt-4 pb-4">Contact Information</h2>
              <p className=" text-red-600 font-sm  p-1">{err}</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-1 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-1 py-2 border"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-1 py-2 border"
                    required
                  />
                </div>
                <h2 className="text-lg font-medium text-gray-900 pt-4">Shipping Information</h2>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-1 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-1 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-1 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                    ZIP / Postal
                  </label>
                  <input
                    type="text"
                    name="zip"
                    id="zip"
                    onChange={(e) => setZip(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-1 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-1 py-2 border"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base text-black">
                  <p>Total</p>
                  <p className="font-bold">${total}</p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={goToPay}
                    className="w-full flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-800"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
import AdminLayout from "@/Components/AdminLayout/layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Orders() {
  const { status } = useSession();
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/getOrders");
      if (res.data.length === 0) {
        setErr("No orders found");
      } else {
        setOrders(res.data);
      }
    } catch (error) {
      setErr("Error fetching orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  const calculateTotalAmount = (lineItems) => {
    return lineItems.reduce((total, product) => {
      return total + (product.price_data.unit_amount / 100) * product.quantity;
    }, 0).toFixed(2);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-1 box-border overflow-hidden">
        <div className="bg-white shadow-md rounded p-4 sm:p-6" data-aos="zoom-out">
          {err && (
            <p className="text-red-500 mb-4" data-aos="zoom-out">
              {err}
            </p>
          )}
          <div className="flex flex-col sm:flex-row justify-between ">
            <h1 className="text-xl mt-3 sm:text-2xl font-bold">Recent Purchase</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm ">
              <thead>
                <tr>
                  <th className="py-1 px-1 sm:px-4 border-b-2 border-gray-300 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="py-1 px-1 sm:px-4 border-b-2 border-gray-300 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="py-1 px-1 sm:px-4 border-b-2 border-gray-300 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="py-1 px-1 sm:px-4 border-b-2 border-gray-300 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-2 px-3 sm:px-2 border-b border-gray-300">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString() + ' ' + new Date(order.createdAt).toLocaleTimeString()
                          : "N/A"}
                      </td>
                      <td className="py-1 px-2 sm:px-4 border-b border-gray-300">
                        <h1 className={order.paid ? "text-green-700" : "text-red-600"}>
                          {order.paid ? "Yes" : "No"}
                        </h1>
                      </td>
                      <td className="py-1 px-2 sm:px-4 border-b border-gray-300 text-xs sm:text-sm">
                        <p className="font-semibold">
                          Name: <span className="font-normal">{order.firstName} {order.lastName}</span>
                        </p>
                        <p className="font-semibold">
                          Email<span className="font-normal">{order.email}</span>
                        </p>
                        <p className="font-semibold">
                          Address: <span className="font-normal">{order.address}, {order.city}, {order.state}, {order.country}</span>
                        </p>
                        <p className="font-semibold">
                          Zip code: <span className="font-normal">{order.zip}</span>
                        </p>
                        <p className="font-semibold">
                          Amount: <span className="font-normal">${calculateTotalAmount(order.line_items)}</span>
                        </p>
                      </td>
                      <td className="py-1 px-2 sm:px-4 border-b border-gray-300">
                        {order.line_items.map((product) => (
                          <div key={product._id}>
                            <p className="font-normal">
                              {product.price_data.product_data.name} x {product.quantity}
                            </p>

                          </div>
                        ))}
                      </td>
                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 px-3 sm:px-4 text-center text-gray-900">
                      <h1>No orders yet!..</h1>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

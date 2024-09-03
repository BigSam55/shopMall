'use client'
import AdminLayout from '@/Components/AdminLayout/layout';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CiTrash } from "react-icons/ci";
import { useSession } from 'next-auth/react';

// Modify deleteBtn to accept id as a parameter
const deleteBtn = async (id) => {
  try {
    const response = await axios.get(`/api/delete/${id}`); 
    return response.data;
  } catch (error) {
    console.error('Failed to delete product', error);
    return null;
  }
};

export default function DeletePage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { status } = useSession();

  // Function to handle deletion
  const handleDelete = async () => {
    const response = await deleteBtn(id); // Call deleteBtn with the id
    if (response) {
      console.log('Item deleted successfully');
      router.back(); 
    } else {
      console.log('Failed to delete item'); 
    }
  };

  // Function to handle cancellation
  const handleCancel = () => {
    router.back();
  };

  // Display loader while session is loading
  if (status === 'loading') {
    return <div className="loader">Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="w-[90%] max-w-md h-auto p-4 bg-gray-100 rounded-lg shadow-md mx-auto mt-24 flex flex-col items-center">
        <CiTrash className="text-6xl text-red-700 mb-4" />
        <h3 className="text-xl font-semibold mb-6 text-center">Are you sure you want to delete this product?</h3>
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="px-6 py-2 text-white bg-red-700 rounded-md shadow-md hover:bg-red-900 transition"
          >
            YES
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 transition"
          >
            NO
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

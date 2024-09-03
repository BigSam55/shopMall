'use client'
import { useSession } from 'next-auth/react';
import AdminLayout from '@/Components/AdminLayout/layout';
import ProductForm from '@/Components/productForm/page';
import React from 'react';

export default function Newproducts() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 lg:p-12">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Add New Product</h1>
        <ProductForm />
      </div>
    </AdminLayout>
  );
}

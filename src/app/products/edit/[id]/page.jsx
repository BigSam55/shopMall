"use client"
import AdminLayout from '@/Components/AdminLayout/layout';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from '@/Components/productForm/page';

const fetchProduct = async (id) => {
  try {
    const response = await axios.get(`/api/edit/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product', error);
    return null;
  }
};

const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`/api/edit/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Failed to update product', error);
    return null;
  }
};

export default function EditPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      const fetchedProduct = await fetchProduct(id);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        setError('Failed to load product');
      }
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  const handleFormSubmit = async (productData) => {
    const updatedProduct = await updateProduct(id, productData);
    if (updatedProduct) {
      setProduct(updatedProduct);
      alert('Product updated successfully');
    } else {
      alert('Failed to update product');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Update Product</h1>
        <ProductForm product={product} onSubmit={handleFormSubmit} />
      </div>
    </AdminLayout>
  );
}

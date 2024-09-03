'use client';
import React, { useState, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { storage } from "@/app/firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProductForm({ product, onSubmit }) {
  const [productName, setProductName] = useState(product ? product.productName : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [quantity, setQuantity] = useState(product ? product.quantity : '');
  const [categories, setCategories] = useState([]); // State for storing categories
  const [selectedCategory, setSelectedCategory] = useState(product ? product.category : '');
  const [err, setErr] = useState('');
  const [loader, setLoader] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(product && product.imageUrls ? product.imageUrls : []);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [err]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErr('');
    setLoader(true);

    if (!price || !description || !productName || !quantity || !selectedCategory) {
      setErr('Please provide all required fields');
      setLoader(false);
      return;
    }

    try {
      let imageUrls = product ? product.imageUrls : [];

      if (images.length > 0) {
        // Upload new images to Firebase Storage and get download URLs
        imageUrls = await Promise.all(images.map(async (image) => {
          const fileRef = ref(storage, `newfiles/images/${image.name}`);
          await uploadBytes(fileRef, image);
          return await getDownloadURL(fileRef);
        }));
      }

      // const productData = {
      //   productName,
      //   price,
      //   quantity,
      //   description,
      //   selectedCategory,
      //   imageUrls,
      // };

      // Determine whether to create or update the product
      const res = product
        ? await axios.put(`/api/edit/${product._id}`, { productName,
          price,
          quantity,
          description,
          selectedCategory,
          imageUrls,})
        : await axios.post('/api/product', { productName,
          price,
          quantity,
          description,
          selectedCategory,
          imageUrls,});

      if (res.status === 200) {
        setErr(product ? 'Product updated successfully' : 'Product created successfully');
        router.push('/products');
      } else {
        setErr('Failed to save product');
      }
    } catch (error) {
      setErr('Failed to upload images or save product');
      console.error(error);
    }

    setLoader(false);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded p-6" data-aos="zoom-out">
        {err && (<p className="text-red-500 mb-4" data-aos="zoom-out">{err}</p>)}
        <div className="input">
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="productName" className="block text-gray-700 font-bold mb-2">Product Name:</label>
              <input type="text" placeholder="Product Name" 
                className="w-full p-2 border border-gray-300 rounded" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow">
                <label className="block text-gray-700 font-bold mb-2">Price:</label>
                <input type="number" placeholder="Price" 
                  className="w-full p-2 border border-gray-300 rounded" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="flex-grow">
                <label className="block text-gray-700 font-bold mb-2">Quantity:</label>
                <input type="number" placeholder="Quantity" 
                  className="w-full p-2 border border-gray-300 rounded" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Category:</label>
              <select className="w-full p-2 border border-gray-300 rounded" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="" disabled>Select Category</option>
                {categories.length > 0 ? categories.map((cat, index) => (
                  <option key={index} value={cat.productCategory}>{cat.productCategory}</option>
                )) : <option value="" disabled>Loading categories...</option>}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Description:</label>
              <textarea name="description" id=""
                placeholder="Description" className="w-full p-2 border border-gray-300 rounded" value={description}
                onChange={(e) => setDescription(e.target.value)}>
              </textarea>
            </div>
            <div className="border rounded-md p-2 border-gray-400 bg-gray-100 max-w-full mb-4">
              <label className="text-gray-600 flex items-center justify-center cursor-pointer">
                <IoCloudUploadOutline className='text-gray-900 text-2xl' />
                <input type="file" id="file" name="file" className="hidden"
                  multiple onChange={handleImageChange} />
                Upload images
              </label>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className='p-2 rounded-xl'>
                  <Image src={preview} height={100} width={100} alt={`image preview ${index}`} className="rounded" />
                </div>
              ))}
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200" disabled={loader}>
              {loader ? 'Saving...' : 'Save'}
            </button>
          </form>
          {loader && <div className="loader"></div>}
        </div>
      </div>
    </div>
  );
}

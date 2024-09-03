'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(null);

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

  const handleDelete = async (id) => {
    setLoadingDelete(id);
    try {
      await axios.delete(`/api/category/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      setMessage('Category deleted successfully');
    } catch (error) {
      setMessage('Error deleting category');
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleEdit = (id) => {
    setLoadingEdit(id);
    // Implement edit functionality
    setTimeout(() => {
      setLoadingEdit(null); // Simulating edit completion after a delay
    }, 1000); // Adjust the delay as needed for actual edit functionality
  };

  return (
    <div className="container mx-auto p-4">
      {message && (
        <p className={`mb-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <div className="bg-white shadow-md rounded p-6 items-center">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Category Name</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="py-2 px-4 border-b">{category.productCategory}</td>
                <td className="py-2 px-4 border-b flex space-x-2">
                  <button
                    onClick={() => handleEdit(category._id)}
                    className="bg-yellow-500 text-white font-bold py-1 px-2 rounded hover:bg-yellow-700 transition duration-200 flex items-center justify-center"
                    disabled={loadingEdit === category._id}
                  >
                    {loadingEdit === category._id ? <FaSpinner className="animate-spin" /> : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-red-500 text-white font-bold py-1 px-2 rounded hover:bg-red-700 transition duration-200 flex items-center justify-center"
                    disabled={loadingDelete === category._id}
                  >
                    {loadingDelete === category._id ? <FaSpinner className="animate-spin" /> : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;

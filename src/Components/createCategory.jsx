'use client'
import { useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const CategoryForm = () => {
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      setMessage('Please enter a category name');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('/api/category', { category });
      setMessage(`Category added successfully!`);
      setCategory('');
      router.refresh();
    } catch (error) {
      setMessage('Error adding category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Add Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category Name"
              className="w-full p-2 border border-gray-300 rounded"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Add Category'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryForm;

import AdminLayout from '@/Components/AdminLayout/layout'
import CategoryForm from '@/Components/createCategory'
import CategoryList from '@/Components/getCategory'
import React from 'react'

export default function categoryPage() {
  return (
    <AdminLayout>
       <div>

      <CategoryForm/>
       </div>
       <div>

      <CategoryList/>
       </div>
      

    </AdminLayout>
  )
}

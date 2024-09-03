'use client'
import AdminLayout from '@/Components/AdminLayout/layout'
import React from 'react'
import { useSession } from 'next-auth/react'

export default function Admindashboard() {
  const {data:session} = useSession();
  return (
    <>
    <AdminLayout>
        <div className=' text-gray-800 px-4 py-1 text-[1.2rem] font-mono font-semibold  '>
          <h1>
            Welcome, {session?.user?.name}
          </h1>
        </div>
    </AdminLayout>
    </>
  )
}

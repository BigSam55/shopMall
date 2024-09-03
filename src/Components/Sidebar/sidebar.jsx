'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";
import { GoListOrdered } from "react-icons/go";
import { usePathname } from 'next/navigation'
import { IoArrowRedo } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { SiPowerpages } from "react-icons/si";

export default function Sidebar() {
    const inactiveLink = 'flex items-center gap-2 text-lg mb-4 md:text-xl md:mb-6 hover:bg-gray-400 p-2 rounded-l-md'
    const activeLink = 'flex items-center gap-2 text-lg mb-4 md:text-xl md:mb-6 bg-white text-gray-900  p-2 rounded-l-md font-semibold'
    const pathname = usePathname();
    
    // State to manage sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar is open by default on larger screens

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            {/* Sidebar Toggle Button for mobile */}
            <button
                className="fixed top-18 left-6 z-50 md:hidden p-1 bg-transparent text-gray-800 rounded-md"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? <IoMdClose className='text-[1.7rem] bg-transparent text-gray-100 mt-3 -ml-2'/> :  < IoArrowRedo className='text-2xl'/>}
            </button>
            
            <aside className={`pt-1 pr-0 fixed top-15 left-0 z-40 text-gray-800 bg-slate-50 w-60 rounded-md md:pt-4 md:w-60 h-full md:relative transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <nav className='flex flex-col gap-0 mt-12 font-thin mb-0 pl-4'>
                    <Link href='/dashboard' className={pathname === '/dashboard' ? activeLink : inactiveLink}>
                        <IoHomeOutline className='text-2xl' /> Dashboard
                    </Link>
                    <Link href='/products' className={pathname === '/products' ? activeLink : inactiveLink}>
                        <AiOutlineProduct className='text-2xl' /> Products
                    </Link>
                    <Link href='/category' className={pathname === '/category' ? activeLink : inactiveLink}>
                        <TbCategoryPlus className='text-2xl' /> Category
                    </Link>
                    <Link href='/order' className={pathname === '/order' ? activeLink : inactiveLink}>
                        <GoListOrdered className='text-2xl' /> Orders
                    </Link>
                    <Link href='/featured' className={pathname === '/featured' ? activeLink : inactiveLink}>
                        <SiPowerpages className='text-2xl' /> Heropage
                    </Link>
                    <Link href='/setting' className={pathname === '/setting' ? activeLink : inactiveLink}>
                        <IoSettingsOutline className='text-2xl' /> Settings
                    </Link>
                </nav>
            </aside>
        </div>
    )
}

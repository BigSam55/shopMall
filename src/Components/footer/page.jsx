"use client";
import React from "react";
import { FaFacebookF, FaTwitter } from "react-icons/fa6";
import { IoLogoInstagram, IoLogoYoutube } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { LiaOpencart } from "react-icons/lia";
import { useSession } from "next-auth/react";

export default function Footer() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  } else {
    return (
      <div className=" w-full bg-[rgb(245,249,252)] text-gray-900 mt-10">
        <div className="px-4 py-10 flex flex-col lg:flex-row justify-around content-center">
          <div className="mb-8 lg:mb-0">
            <div className="ml-3 flex lg:ml-0 items-center">
              <span className="text-blue-700 font-extrabold text-xl">
                <LiaOpencart className="font-extrabold text-[2rem] border-0 md:text-[2.8rem]" />
              </span>
            </div>
            <h2 className="font-bold">ShopMall</h2>
            <p className="mt-4">Join our newsletter</p>
            <div className="flex gap-1 mt-1">
              <input
                type="email"
                placeholder="Email address"
                className="px-2 py-1 rounded-l-md border"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                Subscribe
              </button>
            </div>
          </div>

          <div className="mb-8 lg:mb-0">
            <p className="text-normal font-bold">Company</p>
            <div className="flex flex-col mt-2 mb-1">
              <Link href="/">About us</Link>
              <Link href="/">Contact</Link>
              <Link href="/">News</Link>
            </div>
          </div>

          <div className="mb-8 lg:mb-0">
            <p className="text-normal font-bold">Newsletters</p>
            <div className="flex flex-col mt-2">
              <Link href="/" className="">
                Blog
              </Link>
              <Link href="/">Events</Link>
              <Link href="/">Help Center</Link>
              <Link href="/">Support</Link>
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src="/bicycle-animation (1).gif"
              width={200}
              height={250}
              alt="foot-svg"
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-around items-center py-6 border-t-2 border-t-gray-300">
          <div className="text-sm mb-4 lg:mb-0">&copy;2024 ShopMall. All rights reserved.</div>
          <div className="inline-flex gap-4">
            <FaFacebookF className="text-xl" />
            <IoLogoInstagram className="text-xl" />
            <IoLogoYoutube className="text-xl" />
            <FaTwitter className="text-xl" />
          </div>
        </div>
      </div>
    );
  }
}

"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/Components/Sidebar/sidebar";

export default function AdminLayout({ children }) {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session.user.role !== 'admin')) {
      router.replace("/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="loader"></div>;
  }
 

  if (status === "authenticated" && session.user.role === 'admin') {
    return (
      <div className="flex">
        <Sidebar />
        <div className="bg-slate-50 flex-grow text-gray-900 ">
          {children}
          {/* Uncomment the following lines if you want to display user information */}
          {/* {session.user.image ? (
            <Image src={session.user.image} width={30} height={20} alt='User Image' />
          ) : (
            ''
          )}
          <div>
            Name: <span>{session.user.name}</span>
          </div>
          <div>
            Email: <span>{session.user.email}</span>
          </div>
          <div>
            Role: <span>{session.user.role}</span>
          </div> */}
        </div>
      </div>
    );
  }

  // Return null while the router is redirecting to avoid rendering anything else.
  return null;
}

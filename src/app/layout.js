
import { Inter } from "next/font/google";
import "./globals.css";
import Aos from "@/Components/Aos.jsx";
import { NextAuthProvider } from "./helper/providers";
import { CartProvider } from "@/Components/CartContext/cart";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShopMall",
  description: "Ecommerce site using MERN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
     

        <NextAuthProvider>
          <CartProvider>
          <Aos />
          
          {children}
          </CartProvider>
         
        </NextAuthProvider>
      
      </body>
    </html>
  );
}

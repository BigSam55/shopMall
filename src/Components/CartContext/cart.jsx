'use client'
import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext({});

// Create a provider component
export const CartProvider = ({ children }) => {
  const ls = typeof window !== 'undefined' ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() =>{
    if (cartProducts?.length>0){
      ls?.setItem('cart', JSON.stringify(cartProducts));
    }
  },[cartProducts, ls])
  useEffect(() => {
    if(ls && ls.getItem('cart')){
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, [ls])

  function addTocart(productId){
     setCartProducts(prev =>[...prev, productId]);
  
    }

  function removeFromCart(productId){
    setCartProducts(prev =>{
      const pos = prev.indexOf(productId);
      if(pos !== -1){
       return prev.filter((value, index)=> index !== pos);
      };
      return prev;
  }) ;
  };

  const clearCart = () => {
    
    setCartProducts([]);
    ls?.removeItem('cart');
  };

  const deleteFromCart = (productId) => {
    setCartProducts(cartProducts.filter(id => id !== productId));
    ls?.removeItem('cart');
  };


  return (
    <CartContext.Provider value={{ cartProducts, setCartProducts, addTocart, removeFromCart, clearCart, deleteFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

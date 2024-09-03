"use client";
import React, { useState, useEffect } from "react";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import style from "./page.module.css";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [loader, setLoader] = useState(false);
  const [googleloader, setGoogleloader] = useState(false);

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr('');
      }, 5000);

      return () => clearTimeout(timer); 
    }
  }, [err]);

  // useEffect(() => {
  //   if (status === 'error') {
  //     setErr('Failed to retrieve session information. Please try again.');
  //   } else if (status === 'authenticated') {
  //     router.replace('/home');
  //   }
  // }, [status]);
  

  const submitHandler = async (e) => {
    e.preventDefault();
    setErr('');
    setLoader(true);

    if (!email) {
      setErr('Please enter your email.');
      setLoader(false);
      return;
    }

    if (!password) {
      setErr('Please enter your password.');
      setLoader(false);
      return;
    }

    if (password.length < 6) {
      setErr('Password must be at least 6 characters long.');
      setLoader(false);
      return;
    }

    try {
      const res = await signIn('credentials', { 
        email, 
        password, 
        redirect: false 
      });

      if (res && res.ok) {
        setTimeout(() => {
          if (session && session.user) {
            if (session.user.role === 'admin') {
              router.replace('/dashboard');
            } else if (session.user.role === 'user') {
              router.replace('/home');
            } else {
              setErr('Invalid user role.');
            }
          }
        }, 5000);
      } else {
        setErr('Invalid credentials.');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      setErr('An unexpected error occurred during sign in. Please try again later.');
    } finally {
      setLoader(false);
    }
  };

  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  if (status === 'loading') {
    return <div className="loader"></div>;
  }

  return (
    <div className={style._container}>
      <div className={style._modal_content} data-aos="zoom-out">
        {err && (<p className='err' data-aos="zoom-out">{err}</p>)}
        <div className={style.google}>
          <button onClick={() => {setGoogleloader(true); signIn("google") }}className={style.googlebtn} disabled={googleloader}>
            <Image src={"/google-logo-clipart-transparent-removebg-preview.png"} alt={"google"} width={100} height={100} className={style.google_logo} />
            <span>{googleloader ? (<div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-blue-600 h-8 w-8 text-4xl" />
            </div>): "Sign in with Google"}</span>
          </button>
        </div>
        <p className={style.ccf}>OR</p>
        <div className={style.input}>
          <form onSubmit={submitHandler}>
            <div className={style.formGroup}>
              <label htmlFor="email" className={style.label}>Email:</label>
              <input 
                type="email" 
                id="email"
                placeholder="Email"
                className={style.formControl} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="password" className={style.label}>Password:</label>
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className={style.formControl} 
              />
              <button type="button" className={style.pbtn} onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            <Link href="/forgot_password">Forgot Password?..</Link>
            <button type="submit" className={style.btn} disabled={loader}>
              {loader ? "Loading..." : 'Sign in'}
            </button>
          </form>
          <p className={style.tag}>Do not have an account?.. <Link href="/registration">Sign Up</Link></p>
          {loader && <div className="loader"></div>}
        </div>
      </div>
    </div>
  );
}

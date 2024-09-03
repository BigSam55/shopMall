"use client";
import React, { useState, useEffect } from "react";
import style from "./page.module.css";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [loader, setLoader] = useState(false);
  const session = useSession();
  const [googleloader, setGoogleloader] = useState(false);
  
  

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr('');
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [err]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccess('');
    setLoader(true); // Show loader when form is submitted

    if (!fullname || !email || !password || !confirmpassword) {
      setErr('Please provide all required fields');
      setLoader(false); // Hide loader if there's an error
      return;
    }

    if (password !== confirmpassword) {
      setErr('Passwords do not match');
      setLoader(false); // Hide loader if there's an error
      return;
    }

    if (password.length < 6) {
      setErr('Password must be at least 6 characters');
      setLoader(false); // Hide loader if there's an error
      return;
    }

    try {
      const res = await axios.post('/api/user', {
        fullname,
        email,
        password
      });
      console.log(res.data);

      if (res.status === 200) {
        setSuccess('Registration successful! Redirecting to login...');
        router.push('/login');
      } else {
        setErr('Unexpected status code: ' + res.status);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErr(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        setErr('No response from server');
      } else {
        setErr('Error: ' + error.message);
      }
    } finally {
      setLoader(false); // Hide loader when done
    }
  };
  const { status } = session;

  if (status === 'loading') {
    return <div className="loader"></div>;
  }

  if (status === 'authenticated') {
    router.push('/home');
    return null;
  };

  return (
    <>
      <div className={style._container}>
        <div className={style._modal_content} data-aos="zoom-out">
          {err && (<p className="err" data-aos="zoom-out">{err}</p>)}
          {success && (<p className="success" data-aos="zoom-out">{success}</p>)}

          <div className={style.google}>
          <button onClick={() => {setGoogleloader(true); signIn("google") }}className={style.googlebtn} disabled={googleloader}>
            <Image src={"/google-logo-clipart-transparent-removebg-preview.png"} width={100} height={100} alt={google}/>
           
            <span>{googleloader ? (<div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-blue-600 h-8 w-8 text-4xl" />
            </div>): "Sign in with Google"}</span>
          </button>
        </div>
          <p className={style.ccf}>Or sign up with email address</p>
          <div className={style.input}>
            <form onSubmit={submitHandler}>
              <div className={style.formGroup}>
                <label htmlFor="fullname" className={style.label}>Fullname:</label>
                <input type="text" placeholder="Fullname" id="fullname"
                  className={style.formControl} onChange={(e) => setFullname(e.target.value)} />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="email" className={style.label}>Email:</label>
                <input type="email" placeholder="Email" id="email"
                  className={style.formControl} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="password" className={style.label}>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" id="password" className={style.formControl} />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="confirmpassword" className={style.label}>Confirm Password:</label>
                <input type="password" onChange={(e) => setConfirmpassword(e.target.value)}
                  placeholder="Re-enter Password" id="confirmpassword" className={style.formControl} />
              </div>
              <button type="submit" className={style.btn} disabled={loader}>
                {loader ? 'Loading...' : 'Create Account'}
              </button>
            </form>
            <p className={style.tag}>Already have an account? <Link href="/login">Sign In</Link></p>
            {loader && <div className="loader"></div>}
          </div>
        </div>
      </div>
    </>
  );
}

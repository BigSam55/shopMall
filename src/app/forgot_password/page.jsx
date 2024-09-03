"use client";
import React, { useState, useEffect } from "react";
import style from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function ForgotPassword() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [err, setErr] = useState('');
  const [loader, setLoader] = useState(false); // Loader state
  const router = useRouter();

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr('');
      }, 5000); // Clears the error message after 2 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when error changes
    }
  }, [err]);

 

  const submitHandler = async (e) => {
    e.preventDefault();
    setErr(''); // Clear previous error
    setLoader(true); // Show loader when form is submitted

    if (!password || !confirmpassword || !email) {
      setErr('Please provide required fields');
      setLoader(false); // Hide loader if there's an error
      return;
    } else if (password.length < 6) {
      setErr('Password must be at least 6 characters');
      setLoader(false); // Hide loader if there's an error
      return;
    } else if (password !== confirmpassword) {
      setErr('Passwords do not match');
      setLoader(false); // Hide loader if there's an error
      return;
    }

    // Here you would make the API request to reset the password
    // For example:
    try {
      const res = await axios.post('/api/resetpassword', { email, password });
      if (res.status === 200) {
        setErr('Password reset successful');
        router.push('/login');
        console.log(res)
      } else {
        setErr('Unexpected status code: ' + res.status);
      }
    } catch (error) {
      console.error(error);
      setErr('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoader(false); // Hide loader when done
    }
  };

  const session = useSession();
  const { status } = session;

  if (status === 'loading') {
    return <div className="loader"></div>;
  }

  return (
    <>
      <div className={style._container}>
        <div className={style._modal_content} data-aos="zoom-out">
          {err && (<p className="err" data-aos="zoom-out">{err}</p>)}

          <h1 className={style.ccf}>Reset Password</h1>

          <div className={style.input}>
            <form onSubmit={submitHandler}>
              <div className={style.formGroup}>
                <label htmlFor="" className={style.label}>Email:</label>
                <input
                  type="text"
                  placeholder="Enter registered email"
                  className={style.formControl}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="" className={style.label}>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className={style.formControl}
                />
              </div>

              <div className={style.formGroup}>
                <label htmlFor="" className={style.label}>Confirm Password:</label>
                <input
                  type="password"
                  onChange={(e) => setConfirmpassword(e.target.value)}
                  placeholder="Re-enter Password"
                  className={style.formControl}
                />
              </div>

              <button type="submit" className={style.btn} disabled={loader}>
                {loader ? 'Loading...' : 'Submit'}
              </button>
            </form>
            <p className={style.tag}>Recalled password?.. <Link href="/login">Sign In</Link></p>
            {loader && <div className="loader"></div>}
          </div>
        </div>
      </div>
    </>
  );
}

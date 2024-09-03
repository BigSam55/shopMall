"use client";
import React, { useState, useEffect } from "react";
import style from "./page.module.css";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Adminreg() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [err, setErr] = useState('');
  const [loader, setLoader] = useState(false); // Loader state
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => {
        setErr('');
      }, 2000); // Clears the error message after 2 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when error changes
    }
  }, [err]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErr(''); // Clear previous error
    setLoader(true); // Show loader when form is submitted

    if (!password || !confirmpassword || !email || !fullname) {
      setErr('Please provide required fields');
      setLoader(false); // Hide loader if there's an error
      return;
    } else if (password !== confirmpassword) {
      setErr('Sorry Admin, your passwords do not match');
      setLoader(false); // Hide loader if there's an error
      return;
    } else if (password.length < 6) {
      setErr('Password must be at least 6 characters');
      setLoader(false); // Hide loader if there's an error
      return;
    }

    try {
      const res = await axios.post('/api/admin', {
        fullname,
        email,
        password
      });
      console.log(res.data);

      if (res.status === 200) {
        setErr(res.data.message);
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

  return (
    <>
      <div className={style._container}>
        <div className={style._modal_content} data-aos="zoom-out">
          {err && (<p className="err" data-aos="zoom-out">{err}</p>)}
          <h1 className={style.ccf}>Sign up Admin</h1>
          <div className={style.input}>
            <form onSubmit={submitHandler}>
              <div className={style.formGroup}>
                <label htmlFor="" className={style.label}>Fullname:</label>
                <input type="text" placeholder="Fullname"
                  className={style.formControl} onChange={(e) => setFullname(e.target.value)} />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="" className={style.label}>Email:</label>
                <input type="email" placeholder="Email"
                  className={style.formControl} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="" className={style.label}>Password:</label>
                <input type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password(6+ characters)" className={style.formControl} />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="" className={style.label}>Confirm Password:</label>
                <input type="password"
                  onChange={(e) => setConfirmpassword(e.target.value)}
                  placeholder="Re-enter Password" className={style.formControl} />
              </div>
              <button type="submit" className={style.btn} disabled={loader}>
                {loader ? 'Loading...' : 'Create Account'}
              </button>
            </form>
            <p className={style.tag}>Already have an account?.. <Link href="/login">Sign In</Link></p>
            {loader && <div className="loader"></div>}
          </div>
        </div>
      </div>
    </>
  );
}

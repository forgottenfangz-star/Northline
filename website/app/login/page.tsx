"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  async function submit(e:FormEvent){e.preventDefault();setError("");setLoading(true);const supabase=createClient();const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error){setError(error.message);setLoading(false);return;}router.replace("/dashboard");router.refresh();}
  return <main className="auth"><Link className="brand" href="/">NORTHLINE<span>™</span></Link><form className="authBox" onSubmit={submit}>
    <div className="eyebrow">WELCOME BACK</div><h1>Sign in.</h1><p>Access your marketplace account.</p>
    <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email" required/></label>
    <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" autoComplete="current-password" required/></label>
    {error&&<div className="checkoutError">{error}</div>}
    <button className="button" disabled={loading}>{loading?"Signing in…":"Sign in"}</button>
    <div className="authFoot">New to NORTHLINE? <Link href="/signup">Create an account</Link></div>
  </form></main>
}
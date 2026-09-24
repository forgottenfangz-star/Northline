"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Signup() {
  const router = useRouter();
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");

  async function submit(e:FormEvent){
    e.preventDefault(); setError(""); setNotice("");
    if(username.trim().length<3) return setError("Username must be at least 3 characters.");
    if(password.length<8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    const supabase=createClient();
    const {data,error}=await supabase.auth.signUp({
      email:email.trim(),
      password,
      options:{data:{username:username.trim(),display_name:username.trim()},emailRedirectTo:window.location.origin+"/auth/callback"}
    });
    if(error){setError(error.message);setLoading(false);return;}
    if(data.session){router.replace("/dashboard");router.refresh();return;}
    setNotice("Account created. Check your email to confirm your account, then sign in.");
    setLoading(false);
  }

  return <main className="auth"><Link className="brand" href="/">NORTHLINE<span>™</span></Link><form className="authBox" onSubmit={submit}>
    <div className="eyebrow">JOIN NORTHLINE</div><h1>Create account.</h1><p>Buy services, sell your work and manage protected orders.</p>
    <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} placeholder="yourname" autoComplete="username"/></label>
    <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email" required/></label>
    <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="8+ characters" autoComplete="new-password" required/></label>
    {error&&<div className="checkoutError">{error}</div>}{notice&&<div className="authNotice">{notice}</div>}
    <button className="button" disabled={loading}>{loading?"Creating…":"Create account"}</button>
    <div className="authFoot">Already have an account? <Link href="/login">Sign in</Link></div>
  </form></main>
}
"use client";
import Link from "next/link";
import { use, useState } from "react";

const services: Record<string, {title:string;seller:string;price:number;tag:string;time:string;description:string}> = {
  "landing-page": {title:"Modern Landing Page",seller:"arcticdev",price:75,tag:"WEBSITES",time:"3 days",description:"Professional design and development with a clean, responsive experience."},
  "discord-setup": {title:"Premium Discord Server Setup",seller:"northline.studio",price:35,tag:"DISCORD",time:"2 days",description:"A polished Discord server setup with structure, permissions and presentation."},
  "brand-graphics": {title:"Custom Brand Graphics",seller:"polar.design",price:45,tag:"GRAPHICS",time:"2 days",description:"Custom digital graphics designed around your brand."},
  "roblox-ui": {title:"Roblox UI Development",seller:"icebyte",price:60,tag:"ROBLOX",time:"4 days",description:"Responsive custom UI development for Roblox experiences."}
};

export default function Service({params}:{params:Promise<{id:string}>}) {
  const {id} = use(params);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const s = services[id] ?? services["landing-page"];

  async function checkout() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceId:id})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  return <main>
    <nav className="nav"><Link className="brand" href="/">NORTHLINE<span>™</span></Link><div className="navlinks"><Link href="/marketplace">Marketplace</Link><Link href="/trade-guard">Trade Guard</Link></div><div className="navactions"><Link href="/login">Sign in</Link><Link className="button small" href="/signup">Create account</Link></div></nav>
    <div className="detail"><Link className="back" href="/marketplace">← Marketplace</Link><div className="detailGrid"><div><div className="detailImage"><span>{s.tag}</span></div><div className="detailText"><div className="eyebrow">{s.tag}</div><h1>{s.title}</h1><p>{s.description} Your order is protected by NORTHLINE Trade Guard.</p><h2>What is included</h2><ul><li>Responsive delivery</li><li>Clear requirements and milestones</li><li>Source files on delivery</li><li>Revision support</li></ul></div></div>
      <aside className="orderBox"><div className="seller">● {s.seller} · Verified</div><h2>{s.title}</h2><div className="rating">★ 5.0 · Verified reviews</div><div className="orderPrice">$ {s.price}<small>starting price · USD</small></div><div className="orderRow"><span>Delivery</span><strong>{s.time}</strong></div><div className="orderRow"><span>Payment</span><strong>Stripe Checkout</strong></div><div className="orderRow"><span>Protection</span><strong>Trade Guard</strong></div><button onClick={checkout} disabled={loading} className="button orderButton">{loading ? "Opening secure checkout…" : "Order securely →"}</button>{error && <p className="checkoutError">{error}</p>}<p className="tiny">Secure payment is handled by Stripe. Live mode requires NORTHLINE live Stripe credentials.</p></aside>
    </div></div>
  </main>;
}
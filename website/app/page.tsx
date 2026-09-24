"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const categories = ["Websites","Discord","Graphics","Development","Roblox","Video & Media","Other"];
const services = [
  {id:"discord-setup",title:"Premium Discord Server Setup",seller:"northline.studio",price:"$35",tag:"Discord",time:"2 days"},
  {id:"landing-page",title:"Modern Landing Page",seller:"arcticdev",price:"$75",tag:"Websites",time:"3 days"},
  {id:"brand-graphics",title:"Custom Brand Graphics",seller:"polar.design",price:"$45",tag:"Graphics",time:"2 days"},
  {id:"roblox-ui",title:"Roblox UI Development",seller:"icebyte",price:"$60",tag:"Roblox",time:"4 days"}
];

export default function Home(){
  const hero = useRef<HTMLElement>(null);
  useEffect(()=>{
    const move=(e:MouseEvent)=>{
      if(!hero.current) return;
      const x=(e.clientX/window.innerWidth-.5)*18;
      const y=(e.clientY/window.innerHeight-.5)*10;
      hero.current.style.setProperty("--mx",x+"px");
      hero.current.style.setProperty("--my",y+"px");
    };
    window.addEventListener("mousemove",move);
    return()=>window.removeEventListener("mousemove",move);
  },[]);
  return <main>
    <nav className="nav"><Link className="brand" href="/">NORTHLINE<span>™</span></Link><div className="navlinks"><Link href="/marketplace">Marketplace</Link><Link href="/trade-guard">Trade Guard</Link><Link href="/seller">Become a Seller</Link></div><div className="navactions"><Link href="/login">Sign in</Link><Link className="button small" href="/signup">Create account</Link></div></nav>
    <section ref={hero} className="hero mountainHero">
      <div className="sky"/>
      <div className="stars"/>
      <div className="aurora auroraOne"/><div className="aurora auroraTwo"/>
      <div className="mountain mountainBack"/><div className="mountain mountainFront"/>
      <div className="snowfall">{Array.from({length:38},(_,i)=><i key={i} style={{"--i":i} as React.CSSProperties}/>)}</div>
      <div className="heroShade"/>
      <div className="heroContent">
        <div className="eyebrow">THE DIGITAL MARKETPLACE · BUILT FOR CREATORS</div>
        <h1>Build. Buy.<br/><em>Belong.</em></h1>
        <p>Find digital services from independent creators, place a real order, and keep the transaction protected from payment to delivery.</p>
        <div className="search"><span>⌕</span><input aria-label="Search services" placeholder="Search services, sellers, or categories"/><Link href="/marketplace" className="searchBtn">Explore</Link></div>
        <div className="quick">{categories.slice(0,5).map(c=><Link key={c} href={"/marketplace?category="+encodeURIComponent(c)}>{c}</Link>)}</div>
      </div>
      <div className="heroStatus"><span className="pulse"/>NORTHLINE ONLINE <b>·</b> REAL ORDERS</div>
    </section>

    <section className="section"><div className="sectionHead"><div><div className="eyebrow">EXPLORE</div><h2>Find what you need.</h2></div><Link href="/marketplace">View marketplace →</Link></div><div className="categories">{categories.map((c,i)=><Link href={"/marketplace?category="+encodeURIComponent(c)} className="category" key={c}><span>0{i+1}</span><strong>{c}</strong><small>Browse services</small><b>↗</b></Link>)}</div></section>

    <section className="section muted"><div className="sectionHead"><div><div className="eyebrow">FEATURED SERVICES</div><h2>People are buying.</h2></div><Link href="/marketplace">See all →</Link></div><div className="cards">{services.map(s=><Link href={"/service/"+s.id} className="card" key={s.id}><div className="cardImage"><span>{s.tag}</span><div className="cardVisual">{s.tag.slice(0,1)}</div></div><div className="cardBody"><div className="seller">● {s.seller}</div><h3>{s.title}</h3><div className="meta"><span>★ 5.0</span><span>{s.time}</span></div><div className="price"><small>from</small><strong>{s.price}</strong></div></div></Link>)}</div></section>

    <section id="trade" className="trade section"><div className="tradeGlow"/><div><div className="eyebrow">NORTHLINE PROTECTION</div><h2>Trade Guard.</h2><p>Orders move through payment, delivery and dispute checks with an auditable transaction trail.</p><Link className="button" href="/trade-guard">Explore Trade Guard →</Link></div><div className="guard"><div className="guardTop"><span>TRADE GUARD</span><b>● MONITORING</b></div><div className="guardLine"><span>Payment</span><strong>STRIPE</strong></div><div className="guardLine"><span>Order state</span><strong>TRACKED</strong></div><div className="guardLine"><span>Disputes</span><strong>REVIEWABLE</strong></div></div></section>

    <section id="sell" className="sell section"><div><div className="eyebrow">FOR CREATORS</div><h2>Turn your skills into something bigger.</h2><p>Open a storefront, list services, build reputation and receive marketplace payouts through the payment system.</p></div><Link className="button" href="/seller">Become a seller →</Link></section>
    <footer><div className="brand">NORTHLINE<span>™</span></div><div>© 2026 NORTHLINE · Marketplace infrastructure</div></footer>
  </main>
}
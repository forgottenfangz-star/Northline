import Link from "next/link";

const categories = ["Websites","Discord","Graphics","Development","Roblox","Video & Media","Other"];
const services = [
  {title:"Premium Discord Server Setup", seller:"northline.studio", price:"$35", tag:"Discord", time:"2 days"},
  {title:"Modern Landing Page", seller:"arcticdev", price:"$75", tag:"Websites", time:"3 days"},
  {title:"Custom Brand Graphics", seller:"polar.design", price:"$45", tag:"Graphics", time:"2 days"},
  {title:"Roblox UI Development", seller:"icebyte", price:"$60", tag:"Roblox", time:"4 days"}
];

export default function Home(){
 return <main>
  <nav className="nav"><Link className="brand" href="/">NORTHLINE<span>™</span></Link><div className="navlinks"><Link href="/marketplace">Marketplace</Link><a href="#trade">Trade Guard</a><a href="#sell">Become a Seller</a></div><div className="navactions"><Link href="/login">Sign in</Link><Link className="button small" href="/signup">Create account</Link></div></nav>
  <section className="hero"><div className="aurora"/><div className="heroContent"><div className="eyebrow">THE DIGITAL MARKETPLACE</div><h1>Build. Buy. <em>Belong.</em></h1><p>Discover trusted digital services from creators and developers. Protected by NORTHLINE Trade Guard.</p><div className="search"><span>⌕</span><input placeholder="Search services, sellers, or categories"/><Link href="/marketplace" className="searchBtn">Browse</Link></div><div className="quick">{categories.slice(0,5).map(c=><Link key={c} href={"/marketplace?category="+encodeURIComponent(c)}>{c}</Link>)}</div></div></section>
  <section className="section"><div className="sectionHead"><div><div className="eyebrow">EXPLORE</div><h2>Find what you need.</h2></div><Link href="/marketplace">View marketplace →</Link></div><div className="categories">{categories.map((c,i)=><Link href={"/marketplace?category="+encodeURIComponent(c)} className="category" key={c}><span>0{i+1}</span><strong>{c}</strong><small>Browse services</small><b>↗</b></Link>)}</div></section>
  <section className="section muted"><div className="sectionHead"><div><div className="eyebrow">FEATURED</div><h2>Services worth seeing.</h2></div><Link href="/marketplace">See all →</Link></div><div className="cards">{services.map(s=><article className="card" key={s.title}><div className="cardImage"><span>{s.tag}</span></div><div className="cardBody"><div className="seller">● {s.seller}</div><h3>{s.title}</h3><div className="meta"><span>★ 5.0</span><span>{s.time}</span></div><div className="price"><small>from</small><strong>{s.price}</strong></div></div></article>)}</div></section>
  <section id="trade" className="trade section"><div className="tradeGlow"/><div><div className="eyebrow">NORTHLINE PROTECTION</div><h2>Trade Guard.</h2><p>Our transaction protection layer is designed to keep orders clear, traceable, and fair. Automated checks monitor the order from payment through delivery.</p><Link className="button" href="/trade-guard">Explore Trade Guard →</Link></div><div className="guard"><div className="guardTop"><span>TRADE GUARD</span><b>● ACTIVE</b></div><div className="guardLine"><span>Buyer payment</span><strong>SECURED</strong></div><div className="guardLine"><span>Order review</span><strong>MONITORED</strong></div><div className="guardLine"><span>Seller delivery</span><strong>PROTECTED</strong></div></div></section>
  <section id="sell" className="sell section"><div><div className="eyebrow">FOR CREATORS</div><h2>Turn your skills into something bigger.</h2><p>Build your storefront, list services, earn reputation, and grow with NORTHLINE.</p></div><Link className="button" href="/seller">Become a seller →</Link></section>
  <footer><div className="brand">NORTHLINE<span>™</span></div><div>© 2026 NORTHLINE. Digital marketplace.</div></footer>
 </main>
}
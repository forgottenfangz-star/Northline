import Link from "next/link";
const services=[
["Premium Discord Server Setup","northline.studio","$35","Discord","2 days"],
["Modern Landing Page","arcticdev","$75","Websites","3 days"],
["Custom Brand Graphics","polar.design","$45","Graphics","2 days"],
["Roblox UI Development","icebyte","$60","Roblox","4 days"],
["Full Stack Web App","northcode","$180","Development","7 days"],
["Short-form Video Edit","northmedia","$30","Video & Media","2 days"]
];
const cats=["All","Websites","Discord","Graphics","Development","Roblox","Video & Media","Other"];
export default function Marketplace(){
 return <main><nav className="nav"><Link className="brand" href="/">NORTHLINE<span>™</span></Link><div className="navlinks"><Link href="/marketplace">Marketplace</Link><Link href="/trade-guard">Trade Guard</Link><Link href="/seller">Become a Seller</Link></div><div className="navactions"><Link href="/login">Sign in</Link><Link className="button small" href="/signup">Create account</Link></div></nav>
 <div className="market"><div className="marketHead"><div><div className="eyebrow">MARKETPLACE</div><h1>Find digital services.</h1><p>Explore services from creators, developers, designers, and builders.</p></div><div className="search marketSearch"><span>⌕</span><input placeholder="Search the marketplace"/><button className="searchBtn">Search</button></div></div>
 <div className="filters">{cats.map(c=><button key={c}>{c}</button>)}</div>
 <div className="marketGrid">{services.map((s,i)=><Link href={"/service/"+(i+1)} className="card" key={s[0]}><div className="cardImage"><span>{s[3]}</span></div><div className="cardBody"><div className="seller">● {s[1]}</div><h3>{s[0]}</h3><div className="meta"><span>★ 5.0</span><span>{s[4]}</span></div><div className="price"><small>from</small><strong>{s[2]}</strong></div></div></Link>)}</div></div></main>
}
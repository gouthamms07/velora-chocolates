import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ShoppingBag, Heart, Menu, Search, Sparkles, X } from 'lucide-react';

const api = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const collections = [
  { key: 'classic', title: 'Classic collection', copy: 'Timeless flavours, crafted for every moment.', tone: 'cream' },
  { key: 'signature', title: 'Signature collection', copy: 'Rich, bold and beautifully indulgent.', tone: 'dark' },
  { key: 'seasonal', title: 'Seasonal collection', copy: 'For moments that matter most.', tone: 'rose' }
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => { fetch(`${api}/products`).then(r => r.json()).then(setProducts).catch(() => setNotice('The API is unavailable. Start the server to browse the collection.')); }, []);
  const featured = useMemo(() => products.slice(0, 4), [products]);
  function addToCart(product) { setCart(old => { const found = old.find(i => i.id === product.id); return found ? old.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) : [...old, { ...product, quantity: 1 }]; }); setNotice(`${product.name} added to your bag.`); }
  function submitNewsletter(e) { e.preventDefault(); const email = new FormData(e.currentTarget).get('email'); fetch(`${api}/newsletter`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email}) }).then(r => r.json()).then(() => { setNotice('You are on the Velora list.'); e.currentTarget.reset(); }).catch(() => setNotice('Please try again once the API is running.')); }

  return <main>
    <section className="hero" id="home">
      <nav><a className="brand" href="#home"><span className="brand-mark">V</span><span>Velora<small>ARTISAN CHOCOLATES</small></span></a><div className={menuOpen ? 'links open' : 'links'}><a href="#home">Home</a><a href="#story">Our story</a><a href="#collections">Collections</a><a href="#gifts">Gifts</a><a href="#contact">Contact</a></div><div className="nav-actions"><Search size={20}/><Heart size={20}/><button className="bag" onClick={() => setNotice(cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''} waiting in your bag.` : 'Your bag is empty.')}><ShoppingBag size={20}/><b>{cartCount}</b></button><button className="menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div></nav>
      <div className="hero-copy"><p className="eyebrow">EST. 2018 · HANDCRAFTED IN SMALL BATCHES</p><h1>Crafted beyond<br/>indulgence.</h1><p>Slow-made chocolates with remarkable ingredients, generous texture, and a little ceremony in every bite.</p><a className="button" href="#collections">Shop the collection <ArrowRight size={16}/></a></div>
      <div className="hero-art" aria-label="Assorted artisan chocolates"><div className="ribbon"></div><div className="truffle one"></div><div className="truffle two"></div><div className="truffle three"></div><div className="truffle four"></div><div className="truffle five"></div><div className="truffle six"></div><div className="seal">V<small>VELORA</small></div></div>
    </section>
    <section className="values" id="story"><div><Sparkles/><span><b>Exceptional cacao</b><small>Only the best for unforgettable taste</small></span></div><div><Heart/><span><b>Made with care</b><small>Patiently crafted, piece by piece</small></span></div><div><span className="cacao">◈</span><span><b>Artisan quality</b><small>Small batches, abundant flavour</small></span></div><div><span className="gift">⌑</span><span><b>Made for gifting</b><small>Beautifully packed for every occasion</small></span></div></section>
    <section className="collections wrap" id="collections"><header><p className="eyebrow">THE VELORA EDIT</p><h2>Our signature collections</h2><p>Thoughtfully crafted. Beautifully presented.<br/>Perfectly yours.</p><a className="text-link" href="#shop">View all collections <ArrowRight size={16}/></a></header><div className="collection-grid">{collections.map((c, i) => <article className={`collection-card ${c.tone}`} key={c.key}><div className="collection-orb">{i === 1 ? 'V' : '✦'}</div><span>THE {c.key.toUpperCase()} EDIT</span><h3>{c.title}</h3><p>{c.copy}</p><button onClick={() => document.getElementById('shop').scrollIntoView({behavior:'smooth'})}>Explore <ArrowRight size={16}/></button></article>)}</div></section>
    <section className="shop wrap" id="shop"><div className="section-title"><div><p className="eyebrow">FIND YOUR FAVOURITE</p><h2>Chosen with intention</h2></div><p>Every box is an invitation to pause,<br/>share, and savour.</p></div><div className="product-grid">{featured.map(p => <article className="product" key={p.id}><img src={p.image_url} alt={p.name}/><div><span>{p.collection}</span><h3>{p.name}</h3><p>${Number(p.price).toFixed(2)}</p><button aria-label={`Add ${p.name} to bag`} onClick={() => addToCart(p)}>Add to bag <ArrowRight size={15}/></button></div></article>)}</div></section>
    <section className="newsletter" id="contact"><div><p className="eyebrow">A LITTLE SOMETHING SWEET</p><h2>Join the inner circle.</h2><p>New collections, considered gifts, and notes from our chocolate room.</p></div><form onSubmit={submitNewsletter}><input required type="email" name="email" placeholder="Your email address" aria-label="Email address"/><button>Subscribe <ArrowRight size={16}/></button></form></section>
    <footer><a className="brand" href="#home"><span className="brand-mark">V</span><span>Velora<small>ARTISAN CHOCOLATES</small></span></a><p>© 2026 Velora Chocolates. Made slowly, enjoyed fully.</p></footer>
    {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
  </main>;
}

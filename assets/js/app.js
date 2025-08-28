const CURRENCY = new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'});
const EMAIL_DEST = 'Jeanlouamou12@gmail.com'; // adresse de commande

// Produits de démonstration
const PRODUCTS = [
  { id:'p1', name:'Smartphone X', price:299.99, image:'assets/img/smartphone.jpg', desc:'64 Go, double SIM' },
  { id:'p2', name:'Écouteurs Bluetooth', price:39.90, image:'assets/img/earbuds.jpg', desc:'Autonomie 24h' },
  { id:'p3', name:'Chargeur rapide 30W', price:19.90, image:'assets/img/charger.jpg', desc:'USB-C' },
  { id:'p4', name:'Coque de protection', price:12.00, image:'assets/img/case.jpg', desc:'Antichoc' },
];

const $ = s => document.querySelector(s);
const grid = $('#grid'), cartEl = $('#cart'), overlay = $('#overlay');
const cartCount = $('#cartCount'), cartItems = $('#cartItems'), cartTotal = $('#cartTotal');

function format(v){ return CURRENCY.format(v); }
function renderProducts(){
  grid.innerHTML=''; PRODUCTS.forEach(p=>{
    const el=document.createElement('article'); el.className='card';
    el.innerHTML=`<div class="thumb">${p.image?`<img src="${p.image}" alt="${p.name}">`:''}</div>
    <div class="body"><h3>${p.name}</h3><p class="muted">${p.desc||''}</p>
    <div class="price">${format(p.price)}</div>
    <button data-id="${p.id}">Ajouter au panier</button></div>`;
    el.querySelector('button').onclick=()=>addToCart(p.id); grid.appendChild(el);
  });
}
let cart = JSON.parse(localStorage.getItem('cart')||'[]');
function save(){ localStorage.setItem('cart',JSON.stringify(cart)); updateUI(); }
function addToCart(id){ const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
  const r=cart.find(x=>x.id===id); r? r.qty++ : cart.push({id:p.id,name:p.name,price:p.price,image:p.image,qty:1}); save(); openCart(); }
function removeFromCart(id){ cart=cart.filter(x=>x.id!==id); save(); }
function changeQty(id,d){ const r=cart.find(x=>x.id===id); if(!r) return; r.qty+=d; if(r.qty<=0) removeFromCart(id); else save(); }
function total(){ return cart.reduce((s,x)=>s+x.price*x.qty,0); }
function updateUI(){
  cartCount.textContent = cart.reduce((s,x)=>s+x.qty,0);
  cartItems.innerHTML=''; cart.forEach(r=>{
    const row=document.createElement('div'); row.className='item';
    row.innerHTML=`${r.image?`<img src="${r.image}" alt="${r.name}">`:`<div style="width:56px;height:56px;background:#f3f4f6;border-radius:10px"></div>`}
    <div><strong>${r.name}</strong><div class="muted">${format(r.price)}</div></div>
    <div class="qty"><button data-a="-" aria-label="moins">−</button><span>${r.qty}</span>
    <button data-a="+" aria-label="plus">+</button><button data-a="x" style="margin-left:8px">🗑️</button></div>`;
    row.onclick=e=>{ if(e.target.tagName!=='BUTTON')return;
      if(e.target.dataset.a==='-') changeQty(r.id,-1);
      if(e.target.dataset.a==='+') changeQty(r.id,+1);
      if(e.target.dataset.a==='x') removeFromCart(r.id);
    };
    cartItems.appendChild(row);
  });
  cartTotal.textContent=format(total());
}
function openCart(){ cartEl.classList.add('open'); cartEl.setAttribute('aria-hidden','false'); overlay.hidden=false; }
function closeCart(){ cartEl.classList.remove('open'); cartEl.setAttribute('aria-hidden','true'); overlay.hidden=true; }
document.getElementById('openCart').onclick=openCart;
document.getElementById('closeCart').onclick=closeCart;
overlay && (overlay.onclick=closeCart);
document.getElementById('checkoutEmail').onclick=()=>{
  if(!cart.length) return alert('Votre panier est vide.');
  const lignes=cart.map(x=>`${x.qty} × ${x.name} — ${format(x.price*x.qty)}`).join('%0A');
  const body=`Bonjour,%0A%0AVoici ma commande :%0A${lignes}%0A%0ATotal : ${format(total())}%0A%0ANom :%0AAdresse :%0ATéléphone :%0A%0AMerci.`;
  location.href=`mailto:${encodeURIComponent(EMAIL_DEST)}?subject=${encodeURIComponent('Commande — Vente électronique')}&body=${body}`;
};
document.getElementById('clearCart').onclick=()=>{ if(confirm('Vider le panier ?')){ cart=[]; save(); } };
renderProducts(); updateUI();

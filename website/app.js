const filters=[...document.querySelectorAll(".filter")];
const cards=[...document.querySelectorAll(".product-card")];
function applyFilter(value){cards.forEach(card=>{card.style.display=value==="All"||card.dataset.category===value?"":"none"});filters.forEach(btn=>btn.classList.toggle("active",btn.dataset.filter===value));}
filters.forEach(btn=>btn.addEventListener("click",()=>applyFilter(btn.dataset.filter)));
document.querySelectorAll(".category-card").forEach(card=>card.addEventListener("click",()=>applyFilter(card.dataset.filter)));
document.querySelector("#searchToggle")?.addEventListener("click",()=>{const query=window.prompt("Search Northline");if(!query)return;const q=query.toLowerCase();cards.forEach(card=>card.style.display=card.innerText.toLowerCase().includes(q)?"":"none");document.querySelector("#products")?.scrollIntoView({behavior:"smooth"});});
document.querySelectorAll(".buy-btn").forEach(btn=>btn.addEventListener("click",()=>alert("Product pages are being connected next. The marketplace UI is ready.")));
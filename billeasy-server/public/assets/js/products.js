class ProductCard {
  constructor(product) {
    this.product = product;
  }
  render() {
    const p = this.product;
    const el = document.createElement('article');
    el.className = 'card product-card';
    el.innerHTML = `
      <img src="${p.imageUrl || 'https://picsum.photos/400/240'}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="product-meta">
        <span>${p.category}</span>
        <span>⭐ ${p.rating || 0}</span>
      </div>
      <div class="product-meta">
        <span>Price</span>
        <span>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p.price)}</span>
      </div>
    `;
    return el;
  }
}

async function fetchProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/products?${qs}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed');
  return json.data;
}

function renderProducts(data) {
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('product-empty');
  grid.innerHTML = '';
  if (!data.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  data.forEach((p) => grid.appendChild(new ProductCard(p).render()));
}

document.addEventListener('DOMContentLoaded', async () => {
  const search = document.getElementById('product-search');
  const category = document.getElementById('category-filter');
  const sort = document.getElementById('sort-filter');

  async function load() {
    const data = await fetchProducts({
      q: search.value,
      category: category.value,
      sort: sort.value
    });
    renderProducts(data);
  }

  search.addEventListener('input', load);
  category.addEventListener('change', load);
  sort.addEventListener('change', load);

  load();
});
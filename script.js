// БАЗА ДАНИХ ТОВАРІВ
const products = [
    { id: 1, sku: 'DM-101', name: 'Куртка зимова Alaska', category: 'Куртки', price: 129.99, rating: 5, reviews: 42, img: '🧥', discount: true, new: false, country: 'США' },
    { id: 2, sku: 'DM-102', name: 'Худі Oversize Orange', category: 'Худі', price: 45.00, rating: 4, reviews: 18, img: '👕', discount: true, new: true, country: 'Україна' },
    { id: 3, sku: 'DM-103', name: 'Джинси Slim Fit Blue', category: 'Джинси', price: 59.99, rating: 5, reviews: 31, img: '👖', discount: false, new: true, country: 'Італія' },
    { id: 4, sku: 'DM-104', name: 'Кросівки Sport Black', category: 'Кросівки', price: 89.99, rating: 5, reviews: 55, img: '👟', discount: true, new: false, country: 'Німеччина' },
    { id: 5, sku: 'DM-105', name: 'Пальто елегантне шерсть', category: 'Пальта', price: 180.00, rating: 4, reviews: 12, img: '🧥', discount: false, new: true, country: 'Франція' },
    { id: 6, sku: 'DM-106', name: 'Пуховик Light Warm', category: 'Пуховики', price: 140.00, rating: 5, reviews: 27, img: '🧥', discount: true, new: false, country: 'Китай' },
    { id: 7, sku: 'DM-107', name: 'Футболка Basic White', category: 'Футболки', price: 19.99, rating: 4, reviews: 64, img: '👕', discount: false, new: false, country: 'Україна' },
    { id: 8, sku: 'DM-108', name: 'Черевики шкіряні', category: 'Черевики', price: 110.00, rating: 5, reviews: 22, img: '🥾', discount: true, new: true, country: 'Італія' },
    { id: 9, sku: 'DM-109', name: 'Сумка міська Urban', category: 'Сумки', price: 49.99, rating: 4, reviews: 15, img: '🎒', discount: false, new: true, country: 'США' },
    { id: 10, sku: 'DM-110', name: 'Куртка вітровка', category: 'Куртки', price: 75.00, rating: 4, reviews: 9, img: '🧥', discount: true, new: false, country: 'Німеччина' }
];

let cart = [];
let selectedSubCats = [];
let selectedCountries = [];
let maxPrice = 500;

// ІНІЦІАЛІЗАЦІЯ СТОРІНОК
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    if (document.getElementById('discountSlider')) renderHomeSliders();
});

// КОРЗИНА (ЗБЕРЕЖЕННЯ В LOCALSTORAGE)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    saveCart();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    document.getElementById('cartCount').innerText = totalCount;
    document.getElementById('cartTotalSum').innerText = `$${totalPrice.toFixed(2)}`;

    // Ліва колонка (з графікою)
    const visualList = document.getElementById('cartVisualList');
    if (visualList) {
        if (cart.length === 0) {
            visualList.innerHTML = '<p style="text-align:center; padding: 20px;">Кошик порожній</p>';
        } else {
            visualList.innerHTML = cart.map(item => `
                <div style="display:flex; gap:10px; margin-bottom:10px; align-items:center; border-bottom:1px solid #eee; padding-bottom:8px;">
                    <div style="font-size:30px;">${item.img}</div>
                    <div style="flex:1;">
                        <div style="font-weight:bold; font-size:13px;">${item.name}</div>
                        <div style="font-size:11px; color:#ff6600;">Арт: ${item.sku}</div>
                    </div>
                    <div>
                        <button onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Права колонка (Текстова специфікація)
    const textList = document.getElementById('cartTextList');
    if (textList) {
        if (cart.length === 0) {
            textList.innerHTML = '<p style="color:#888; font-size:12px;">Немає товарів</p>';
        } else {
            textList.innerHTML = cart.map(item => `
                <div class="cart-text-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small style="color:#ff6600;">${item.sku}</small>
                    </div>
                    <div>x${item.qty}</div>
                    <div><strong>$${(item.price * item.qty).toFixed(2)}</strong></div>
                </div>
            `).join('');
        }
    }
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        updateCartUI();
        saveCart();
    }
}

function saveCart() { localStorage.setItem('dima_cart', JSON.stringify(cart)); }
function loadCart() { 
    const saved = localStorage.getItem('dima_cart');
    if (saved) { cart = JSON.parse(saved); updateCartUI(); }
}

function openCart() { document.getElementById('cartModal').classList.add('active'); }
function closeCart() { document.getElementById('cartModal').classList.remove('active'); }

// ГОЛОВНА СТОРІНКА (СЛАЙДЕРИ)
function renderHomeSliders() {
    const discountContainer = document.getElementById('discountSlider');
    const newContainer = document.getElementById('newSlider');

    const discountProducts = products.filter(p => p.discount);
    const newProducts = products.filter(p => p.new);

    discountContainer.innerHTML = discountProducts.map(createCardHTML).join('');
    newContainer.innerHTML = newProducts.map(createCardHTML).join('');
}

function createCardHTML(product) {
    return `
        <div class="card">
            <div class="card-img" style="display:flex; justify-content:center; align-items:center; font-size:50px;">${product.img}</div>
            <div class="card-title">${product.name}</div>
            <div class="card-rating">★ ${product.rating}.0 (${product.reviews})</div>
            <div class="card-price">$${product.price.toFixed(2)}</div>
            <button class="add-btn" onclick="addToCart(${product.id})">В кошик</button>
        </div>
    `;
}

function scrollSlider(id, amount) {
    document.getElementById(id).scrollBy({ left: amount, behavior: 'smooth' });
}

// ДРУГА СТОРІНКА (КАТАЛОГ ТА ФІЛЬТРИ)
function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;

    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const sortValue = document.getElementById('sortSelect')?.value || 'relevance';

    let filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery);
        const matchesSubCat = selectedSubCats.length === 0 || selectedSubCats.includes(p.category);
        const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(p.country);
        const matchesPrice = p.price <= maxPrice;
        return matchesSearch && matchesSubCat && matchesCountry && matchesPrice;
    });

    if (sortValue === 'cheap') filtered.sort((a,b) => a.price - b.price);
    if (sortValue === 'expensive') filtered.sort((a,b) => b.price - a.price);

    grid.innerHTML = filtered.map(createCardHTML).join('');
    updateFilterChips();
}

function toggleSubCat(cat) {
    if (selectedSubCats.includes(cat)) {
        selectedSubCats = selectedSubCats.filter(c => c !== cat);
    } else {
        selectedSubCats.push(cat);
    }
    renderCatalog();
}

function toggleCountry(country) {
    if (selectedCountries.includes(country)) {
        selectedCountries = selectedCountries.filter(c => c !== country);
    } else {
        selectedCountries.push(country);
    }
    renderCatalog();
}

function updatePriceFilter(val) {
    maxPrice = parseFloat(val);
    document.getElementById('priceValue').innerText = `До $${maxPrice}`;
    renderCatalog();
}

function updateFilterChips() {
    const container = document.getElementById('filterChips');
    if (!container) return;

    const all = [...selectedSubCats, ...selectedCountries];
    if (maxPrice < 500) all.push(`До $${maxPrice}`);

    if (all.length === 0) {
        container.innerHTML = '<span class="no-filters-text">Фільтри не вибрано</span>';
        return;
    }

    container.innerHTML = all.map(f => `
        <span class="chip">${f} <span class="chip-remove" onclick="removeFilter('${f}')">✕</span></span>
    `).join('');
}

function checkout() {
    if(cart.length === 0) { alert('Ваш кошик порожній!'); return; }
    alert('Дякуємо за замовлення! Менеджер зв’яжеться з вами.');
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
}
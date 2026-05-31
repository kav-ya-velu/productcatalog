const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");

let allProducts = [];
let showFavoritesOnly = false;

// Load favorites from localStorage
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Save favorites
function saveFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
}

// Toggle Favorite
function toggleFavorite(id) {
    let favs = getFavorites();

    if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
    } else {
        favs.push(id);
    }

    saveFavorites(favs);
    renderProducts(allProducts);
}

// Check favorite
function isFavorite(id) {
    return getFavorites().includes(id);
}

// Toggle favorites view
function toggleFavoritesView() {
    showFavoritesOnly = !showFavoritesOnly;
    renderProducts(allProducts);
}

async function loadProducts() {
    const res = await fetch("https://fakestoreapi.com/products");
    allProducts = await res.json();

    loadCategories(allProducts);
    renderProducts(allProducts);
}

function loadCategories(products) {
    const categories = [...new Set(products.map(p => p.category))];

    categories.forEach(cat => {
        categoryFilter.innerHTML += `
            <option value="${cat}">${cat}</option>
        `;
    });
}

function renderProducts(products) {
    productsDiv.innerHTML = "";

    let filtered = products;

    // favorites filter
    if (showFavoritesOnly) {
        const favs = getFavorites();
        filtered = products.filter(p => favs.includes(p.id));
    }

    filtered.forEach(product => {
        productsDiv.innerHTML += `
            <div class="card">

                <img src="${product.image}" loading="lazy">

                <h3>${product.title}</h3>

                <p class="price">$${product.price}</p>

                <button onclick="viewProduct(${product.id})">
                    Details
                </button>

                <button class="favorite-btn"
                    onclick="toggleFavorite(${product.id})">

                    ${isFavorite(product.id) ? "★ Remove" : "❤ Add"}

                </button>

            </div>
        `;
    });
}

// SEARCH
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    const filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(keyword)
    );

    renderProducts(filtered);
});

// CATEGORY FILTER
categoryFilter.addEventListener("change", () => {
    const value = categoryFilter.value;

    if (value === "all") {
        renderProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(p =>
        p.category === value
    );

    renderProducts(filtered);
});

// NAV TO DETAILS PAGE
function viewProduct(id) {
    localStorage.setItem("selectedProduct", id);
    window.location.href = "product.html";
}

loadProducts();
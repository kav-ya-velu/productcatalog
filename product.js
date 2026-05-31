const productId = localStorage.getItem("selectedProduct");

async function loadProduct() {
    const res = await fetch(
        `https://fakestoreapi.com/products/${productId}`
    );

    const product = await res.json();

    document.getElementById("productDetail").innerHTML = `
        <div class="card">

            <img src="${product.image}">

            <h2>${product.title}</h2>

            <p>${product.description}</p>

            <h3>$${product.price}</h3>

        </div>
    `;
}

loadProduct();

let products = [];
let newProducts = [];

fetch('store.json')
  .then(response => response.json())
  .then(data => {
    products = data.products;
    newProducts = data.newProducts;

    products.push(...newProducts);

    renderProducts(); 
    updateCartAmount(); 
    updateUserUI(); 
  })
  .catch(error => console.error('Error loading products:', error));


function createProductHTML(product, index) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const isWishlisted = wishlist.some(item => item.title === product.title);
  const heartClass = isWishlisted ? 'active' : '';

  return `
    <div class="product-box">
      <img src="${product.image}" alt="${product.title}" class="product-img" />
      <h2 class="product-title">${product.title}</h2>
      <span class="price">US $${product.price}</span>
      <i class="bi bi-heart-fill heart-icon ${heartClass}" title="Add to Wishlist" data-index="${index}"></i>
      <button class="buy-btn" data-index="${index}">Put to Cart</button>
    </div>
  `;
}


function renderProducts() {
  const shopContent = document.querySelector('.shop-content');
  shopContent.innerHTML = products.map((p, i) => createProductHTML(p, i)).join('');

 
  document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      addToCart(products[index]);
    });
  });

  document.querySelectorAll('.heart-icon').forEach(heart => {
    heart.addEventListener('click', () => {
      const index = heart.dataset.index;
      toggleWishlist(products[index], heart);
    });
  });
}


function addToCart(product) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.name) {
    alert("You need to log in first!");
    window.location.href = "/Apk/frontend/login-form/login.html";
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingIndex = cart.findIndex(item => item.title === product.title);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartAmount();
  alert(`The product "${product.title}" is put in Cart.`);
}


function toggleWishlist(product, heartElement) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const existingIndex = wishlist.findIndex(item => item.title === product.title);

  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1);
    heartElement.classList.remove('active');
  } else {
    wishlist.push(product);
    heartElement.classList.add('active');
  }

  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}


function updateCartAmount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const amount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartAmountElement = document.querySelector('.cart-amount');
  if (cartAmountElement) cartAmountElement.textContent = amount;
}


function updateUserUI() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user && user.name && userName && logoutBtn) {
    userName.textContent = `Hi, ${user.name}`;
    logoutBtn.style.display = "inline-block";

    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("user");
      window.location.href = "/Apk/frontend/login-form/login.html";
    });
  }
}


const cartIcon = document.getElementById("cartIcon");
const cartText = document.getElementById("cartText");

if (cartIcon && cartText) {
  cartIcon.addEventListener("mouseenter", () => {
    cartText.style.display = "inline";
  });
  cartIcon.addEventListener("mouseleave", () => {
    cartText.style.display = "none";
  });
}


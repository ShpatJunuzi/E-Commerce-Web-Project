const cartItemsContainer = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const buyButton = document.getElementById('buy-button');

function loadCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
    totalPriceEl.textContent = '';
    buyButton.disabled = true;
    return;
  }

  cartItemsContainer.innerHTML = '';
  buyButton.disabled = false;
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item');
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-details">
        <h3>${item.title}</h3>
        <div class="price">US $${item.price.toFixed(2)}</div>
        <div class="quantity-controls">
          <button class="quantity-btn" data-action="decrease" data-index="${index}">−</button>
          <input type="text" value="${item.quantity}" readonly class="quantity-input" />
          <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(itemEl);
  });

  totalPriceEl.textContent = `Total: US $${total.toFixed(2)}`;

  
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      const action = btn.dataset.action;
      updateQuantity(index, action);
    });
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      removeItem(index);
    });
  });
}

function updateQuantity(index, action) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (action === 'increase') {
    cart[index].quantity += 1;
  } else if (action === 'decrease') {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}


buyButton.addEventListener('click', () => {
  if (confirm("Are you sure you want to buy the product?")) {
    localStorage.removeItem('cart');
    loadCart();
    alert("Thank you for your purchase!");
  } else {
    alert("Purchase cancelled.");
  }
});

document.addEventListener('DOMContentLoaded', loadCart);

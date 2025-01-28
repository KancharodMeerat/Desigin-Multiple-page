// Handle Hamburger Menu
const hamburger = document.querySelector('.menu-icon');
const hamburgermenu = document.querySelector('.hamburger-menu');

hamburger.addEventListener('click', () => {
    hamburgermenu.classList.toggle('show');
});

// Add to Cart
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = document.querySelector('.product-name').innerText;
        const productPrice = parseFloat(document.querySelector('.price-discounted').innerText.replace('$', ''));
        const productImage = document.querySelector('.bg-product').src;
        const selectedSize = document.querySelector('#size-select').value;

        if (selectedSize === "Select Size") {
            alert("Please select a size before adding to cart.");
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.name === productName && item.size === selectedSize);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                size: selectedSize,
                image: productImage,
                quantity: 1,
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        alert(`${productName} has been added to the cart.`);
    });
});

// Update-Cart
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.quantity').innerText = totalQuantity;
}
updateCartBadge();

// Load-Cart
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<tr><td colspan='6'>Your cart is empty</td></tr>";
        return;
    }

    cart.forEach((item, index) => {
        const total = (item.price * item.quantity).toFixed(2);
        const row = `
            <tr>
                <td><button class="remove-btn" data-index="${index}"><img src="images/cart/close-icon.png" /></button></td>
                <td><img src="${item.image}" alt="${item.name}" class="product-img" /></td>
                <td><span class="product-name">${item.name}</span></td>
                <td>${item.price.toFixed(2)}</td>
                <td><input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input" /></td>
                <td>$${total}</td>
            </tr>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', row);
    });

    addCartEventListeners();
    updateCartTotals();
}

// Update 
function updateCartTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    document.querySelector('.cart-totals .totals-row.left').nextElementSibling.innerText = `$${subtotal}`;
    document.querySelector('.cart-totals .result .totals-row.right').innerText = `$${subtotal}`;
}

// Add-Event 
function addCartEventListeners() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('button').dataset.index;
            removeCartItem(index);
        });
    });

    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value);
            updateCartItem(index, newQuantity);
        });
    });
}

// Remove-Cart
function removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartBadge();
}

// Update Quantity
function updateCartItem(index, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (newQuantity < 1) {
        removeCartItem(index);
        return;
    }
    cart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

if (document.getElementById('cart-items')) {
    loadCart();
}

// check-out page
localStorage.setItem("cartItems", JSON.stringify([

]));

function loadOrderTotals() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderTotalsSection = document.querySelector('.order-totals');

  if (!orderTotalsSection) {
      console.error("Element with class 'order-totals' not found.");
      return;
  }

  if (cart.length === 0) {
      orderTotalsSection.innerHTML = "<p>Your cart is empty.</p>";
      return;
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const orderTableBody = cart
      .map(
          (item) => `
          <tr>
              <td><span class="product-list">${item.name}</span></td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join("");

  const orderTableSubtotal = `
      <tr>
          <td>Subtotal</td>
          <td>${totalPrice}</td>
      </tr>
  `;

  const orderTableTotal = `
      <tr>
          <td class="order-product border-total"></td>
          <td class="order-product border-total"><b>${totalPrice}</b></td>
      </tr>
  `;

  orderTotalsSection.innerHTML = `
      <h1>Your Order</h1>
      <table class="order-product">
          <thead>
              <tr>
                  <th>Product</th>
                  <th>Total</th>
              </tr>
          </thead>
          <tbody>
              ${orderTableBody}
              ${orderTableSubtotal}
              ${orderTableTotal}
          </tbody>
      </table>

      <div class="order-total-mix">
        <div class="order-total-result">
          <p>Cash on delivery.  Please contact us if you require assistance or wish to make alternate arrangements.</p>
        </div>
        <div class="place-order-btn">
          <button>place order</button>                    
        </div>
      </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadOrderTotals();
});

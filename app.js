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
              <td class="order-body-font">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join("");

  const orderTableSubtotal = `
      <tr>
          <td class="order-product subtotal-font">Subtotal</td>
          <td class="order-product subtotal-font">$${totalPrice}</td>
      </tr>
  `;

  const orderTableTotal = `
      <tr>
          <td class="order-product border-total"></td>
          <td class="order-product border-total"><b>$${totalPrice}</b></td>
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

//Payment successful!
document.addEventListener('click', (event) => {
    if (event.target.matches('.place-order-btn button')) {
        alert("Payment successful!");

        localStorage.removeItem('cart');

        document.getElementById('cart-items').innerHTML = "<tr><td>Your cart is empty</td></tr>";
        document.querySelector('.quantity').innerText = "0";
        
        loadOrderTotals();
    }
});

//product-img

document.addEventListener('DOMContentLoaded', function () { 
    const productImages = document.querySelectorAll('.image-container');
    
    productImages.forEach(image => {
        image.addEventListener('click', function() {
            const productId = image.getAttribute('data-product');
            console.log("Product ID:", productId); 
            
            if (productId) {
                updateProductPage(productId);
            } else {
                console.warn("ไม่พบค่า productId");
            }
        });
    });

    function updateProductPage(productId) {
        let productDetails = {
            1: { name: 'Plain White Shirt', price: '$29.00', bgImage: 'images/home/new-plain-white-shirt-1.png', tags: 'Women', page: 'product-women.html' },
            2: { name: 'Denim Jacket', price: '$69.00', bgImage: 'images/home/new-denim-jacket-2.png', tags: 'Women', page: 'product-women.html' },
            3: { name: 'Black Polo Shirt', price: '$49.00', bgImage: 'images/home/new-black-polo-shirt-3.png', tags: 'Women', page: 'product-women.html' },
            4: { name: 'Blue Sweatshirt', price: '$79.00', bgImage: 'images/home/new-blue-sweatshirt-4.png', tags: 'Women', page: 'product-women.html' },
            5: { name: 'Blue Plain Shirt', price: '$49.00', bgImage: 'images/home/new-blue-plain-shirt-5.png', tags: 'Men', page: 'product-men.html' },
            6: { name: 'Dark Blue Shirt', price: '$89.00', bgImage: 'images/home/new-dark-blue-shirt-6.png', tags: 'Men', page: 'product-men.html' },
            7: { name: 'Outcast T Shirt', price: '$19.00', bgImage: 'images/home/new-outcast-shirt-7.png', tags: 'Men', page: 'product-men.html' },
            8: { name: 'Polo Plain Shirt', price: '$29.00', bgImage: 'images/home/new-polo-shirt-8.png', tags: 'Men', page: 'product-men.html' },
            9: { name: 'Gray Polo Shirt', price: '$49.00', bgImage: 'images/home/top-gray-polo-shirt-1.png', tags: 'Men', page: 'product-men.html' },
            10: { name: 'Red Shirt', price: '$69.00', bgImage: 'images/home/top-red-shirt-2.png', tags: 'Women', page: 'product-women.html' },
            11: { name: 'Polo White Shirt', price: '$29.00', bgImage: 'images/home/top-olo-white-3.png', tags: 'Women', page: 'product-women.html' },
            12: { name: 'Pink Casual Shirt', price: '$39.00', bgImage: 'images/home/top-pink-casual-4.png', tags: 'Women', page: 'product-women.html' }
        };

        const product = productDetails[productId];

        if (product) {
            console.log("Updating product:", product);

            const bgProduct = document.querySelector('#bg-product');
            const productName = document.querySelector('#product-name');
            const productPrice = document.querySelector('#product-price');
            const productTags = document.querySelector('#product-tags');
            const productPage = document.querySelector('#product-page');

            // console.log(bgProduct, productName)
            // อัปเดตข้อมูลบนหน้า product
            bgProduct.src = product.bgImage;
            productName.textContent = product.name;
            productPrice.textContent = product.price;
            productTags.textContent = product.tags;
            productPage.href = product.page;
        } else {
            console.warn('ไม่พบข้อมูลสินค้าสำหรับ ID:', productId);
        }
    }
});


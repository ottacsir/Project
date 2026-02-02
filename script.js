let cart = JSON.parse(localStorage.getItem('cart')) || [];

function showModal(title, message) {
  const modal = document.getElementById('customModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  
  modalTitle.textContent = title;
  modalContent.innerHTML = `<div class="modal-message">${message.split('\n').join('<br>')}</div>`;
  modal.style.display = 'flex';
  
  document.getElementById('modalClose').onclick = function() {
    modal.style.display = 'none';
  };
  
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
}

function calculateTotal() {
  let total = 0;
  cart.forEach(item => {
    const priceString = item.price.replace('ETB ', '').replace(',', '');
    const price = parseFloat(priceString);
    total += price;
  });
  return total.toLocaleString('en-ET');
}

function updateCartDisplay() {
  const cartContainer = document.getElementById('cartItems');
  const emptyMsg = document.getElementById('emptyCartMessage');
  const totalPriceEl = document.getElementById('totalPrice');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    cartContainer.innerHTML = '';
    if (totalPriceEl) totalPriceEl.textContent = '0.00';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  
  if (emptyMsg) emptyMsg.style.display = 'none';
  cartContainer.innerHTML = '';
  
  let itemsCount = 0;
  let priceTotal = 0;
  
  cart.forEach((item, index) => {
    itemsCount += 1;
    const itemPrice = item.price.replace('ETB ', '').replace(',', '');
    priceTotal += itemPrice;
    
    const itemImage = item.image || 'images/placeholder.jpg';
    
    const cartItemHTML = 
      `<div class="cart-item">
        <img src="${itemImage}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-price">${item.price}</p>
          <p class="cart-item-meta">Added: ${item.date}</p>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn minus" data-index="${index}">-</button>
          <span class="quantity-display">1</span>
          <button class="quantity-btn plus" data-index="${index}">+</button>
        </div>
        <button class="remove-btn" data-index="${index}">Remove</button>
        <div class="cart-item-total">${item.price}</div>
      </div>
    `;
    
    cartContainer.innerHTML += cartItemHTML;
  });
  
  if (totalPriceEl) totalPriceEl.textContent = priceTotal.toFixed(2);
  if (checkoutBtn) checkoutBtn.disabled = false;
  
  attachCartItemListeners();
}

function attachCartItemListeners() {
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.onclick = function() {
      const index = parseInt(this.getAttribute('data-index'));
      const itemName = cart[index].name;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
      showModal('Cart Updated', `Removed ${itemName} from cart.`);
    };
  });
  
  document.querySelectorAll('.quantity-btn.plus').forEach(button => {
    button.onclick = function() {
        const index = parseInt(this.getAttribute('data-index'));
      const item = cart[index];
      cart.push({
        name: item.name,
        price: item.price,
        image: item.image,
        date: new Date().toLocaleString()
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
    };
  });
  
  document.querySelectorAll('.quantity-btn.minus').forEach(button => {
    button.onclick = function() {
      const index = parseInt(this.getAttribute('data-index'));
      const itemName = cart[index].name;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
      showModal('Cart Updated', `Removed ${itemName} from cart.`);
    };
  });
}

document.addEventListener('DOMContentLoaded', function() {
  
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.onsubmit = function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const subject = document.querySelector('input[name="subject"]:checked');
      
      if (!name) {
        showModal('Validation Error', 'Please enter your name');
        return;
      }
      
      if (!email) {
        showModal('Validation Error', 'Please enter your email');
        return;
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        showModal('Validation Error', 'Please enter a valid email address');
        return;
      }
      
      if (!subject) {
        showModal('Validation Error', 'Please select a subject');
        return;
      }
      
      if (!message) {
        showModal('Validation Error', 'Please enter a message');
        return;
      }
      
      showModal('Success!', 'Thank you for your message!<br>We will contact you within 24 hours.');
      this.reset();
    };
  }
  
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.onclick = function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.price').textContent;
      const productImage = productCard.querySelector('img')?.src || '';
      
      cart.push({
        name: productName,
        price: productPrice,
        image: productImage,
        date: new Date().toLocaleString()
      });
      
      localStorage.setItem('cart', JSON.stringify(cart));
      showModal('Cart Updated', `Added ${productName} to cart!<br><br>Items in cart: ${cart.length}`);
      updateCartDisplay();
    };
  });
  
  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) {
    clearBtn.onclick = function() {
      if (cart.length === 0) {
        showModal('Cart Empty', 'Your cart is already empty.');
        return;
      }
      
      const modal = document.getElementById('customModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalContent = document.getElementById('modalContent');
      
      modalTitle.textContent = 'Clear Cart';
      modalContent.innerHTML = `
        <div class="modal-message">Are you sure you want to clear all items from your cart?</div>
        <div class="modal-buttons">
          <button id="confirmClear" class="modal-confirm-btn">Confirm</button>
          <button id="cancelClear" class="modal-cancel-btn">Cancel</button>
        </div>
        `;
      
      modal.style.display = 'flex';
      
      document.getElementById('confirmClear').onclick = function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        modal.style.display = 'none';
        showModal('Cart Cleared', 'All items have been removed from your cart.');
      };
      
      document.getElementById('cancelClear').onclick = function() {
        modal.style.display = 'none';
      };
      
      modal.onclick = function(e) {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      };
    };
  }
  
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.onclick = function() {
      if (cart.length === 0) {
        showModal('Cart Empty', 'Your cart is empty! Add some items first.');
        return;
      }
      
      let summary = '<strong>ORDER SUMMARY:</strong><br><br>';
      cart.forEach(item => {
        summary += `• ${item.name} - ${item.price}<br>`;
      });
      
      const total = calculateTotal();
      summary += `<br><strong>Total: ${total} ETB</strong>`;
      summary += `<br><br>Thank you for your order!<br>`;
      
      showModal('Order Confirmed!', summary);
      
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
    };
  }
  
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.onclick = function() {
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      const allCards = document.querySelectorAll('.product-card');
      
      allCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    };
  });
  
  updateCartDisplay();
});
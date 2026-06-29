document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const cartTotalDisplay = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // Custom Toast Notification Logic
  function showToast(message, isError = false) {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return; // Failsafe

    const toast = document.createElement("div");
    toast.className = "toast";
    if (isError) toast.style.background = "#ff4d4d"; // Red toast for removals
    toast.innerText = message;

    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  function renderCart() {
    cartContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartContainer.innerHTML =
        '<p class="empty-cart">Your cart is empty. Go add some fresh items!</p>';
      cartTotalDisplay.textContent = "$0.00";
      if (checkoutBtn) checkoutBtn.style.display = "none"; // Hide checkout if empty
      return;
    }

    if (checkoutBtn) checkoutBtn.style.display = "block";

    cartItems.forEach((item, index) => {
      const quantity = item.quantity || 1;
      const priceNumber = parseFloat(item.price.replace("$", "")) || 0;
      const itemTotal = (priceNumber * quantity).toFixed(2);

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src=''" />
        <div class="cart-item-details">
          <strong>${item.name}</strong>
          <p class="price">Price: ${item.price}</p>
          <p class="subtotal" id="subtotal-${index}">Subtotal: $${itemTotal}</p>
        </div>
        <div class="cart-item-quantity">
          <input type="number" min="1" value="${quantity}" data-index="${index}" class="quantity-input">
        </div>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;

      cartContainer.appendChild(cartItem);
    });

    attachQuantityListeners();
    attachRemoveListeners();
    updateTotal();
  }

  function attachQuantityListeners() {
    const quantityInputs = document.querySelectorAll(".quantity-input");

    quantityInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        let newQuantity = parseInt(e.target.value);

        if (newQuantity < 1 || isNaN(newQuantity)) {
          newQuantity = 1;
          e.target.value = 1;
        }

        cartItems[index].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cartItems));

        updateSubtotal(index);
        updateTotal();
      });
    });
  }

  function updateSubtotal(index) {
    const item = cartItems[index];
    const price = parseFloat(item.price.replace("$", "")) || 0;
    const quantity = item.quantity || 1;
    const subtotal = (price * quantity).toFixed(2);

    const subtotalElement = document.getElementById(`subtotal-${index}`);
    if (subtotalElement) {
      subtotalElement.textContent = `Subtotal: $${subtotal}`;
    }
  }

  function attachRemoveListeners() {
    const removeButtons = document.querySelectorAll(".remove-btn");

    removeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        const removedItemName = cartItems[index].name;

        // Remove item from array and update local storage
        cartItems.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));

        // Show Toast Notification
        showToast(`🗑️ ${removedItemName} removed`, true);

        // Re-render the entire cart
        renderCart();
      });
    });
  }

  function updateTotal() {
    let total = 0;
    cartItems.forEach((item) => {
      const price = parseFloat(item.price.replace("$", "")) || 0;
      const quantity = item.quantity || 1;
      total += price * quantity;
    });
    cartTotalDisplay.textContent = `$${total.toFixed(2)}`;
  }

  // Checkout Button Logic
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      showToast("✅ Order placed successfully! (Demo)");

      // Clear the cart
      setTimeout(() => {
        cartItems = [];
        localStorage.removeItem("cart");
        renderCart();
      }, 1500);
    });
  }

  // Initialize page
  renderCart();
});

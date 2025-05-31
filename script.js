const products = {
  "Bread & Bakery": [
    { name: "Whole Wheat Bread", image: "images/whole-wheat-bread.png", price: "$2.99" },
    { name: "Multigrain Bread", image: "images/multigrain-bread.png", price: "$3.49" },
    { name: "Pastry", image: "images/pastry.png", price: "$3.99" },
    { name: "Cake", image: "images/cake.png", price: "$4.99" },
  ],
  "Flour & Baking": [
    { name: "Besan Gram Flour", image: "images/besan-gram-flour.png", price: "$2.49" },
    { name: "Wheat Flour", image: "images/wheat-flour.png", price: "$2.49" },
    { name: "Corn Flour", image: "images/corn-flour.png", price: "$2.99" },
    { name: "Rice Flour", image: "images/rice-flour.png", price: "$3.49" },
  ],
  "Fruits & Vegetables": [
    { name: "Apple", image: "images/apple.png", price: "$1.50" },
    { name: "Banana", image: "images/banana.png", price: "$1.20" },
    { name: "Orange", image: "images/orange.png", price: "$1.99" },
    { name: "Grapes", image: "images/grapes.png", price: "$2.49" },
  ],
  "Fresh Meals & Pizzas": [
    { name: "Margherita Pizza", image: "images/margherita-pizza.png", price: "$8.99" },
    { name: "Pepperoni Pizza", image: "images/pepperoni-pizza.png", price: "$9.99" },
    { name: "Veggie Pizza", image: "images/veggie-pizza.png", price: "$10.99" },
    { name: "Tomato Pizza", image: "images/tomato-pizza.png", price: "$11.99" },
  ],
  "Beverages": [
    { name: "Orange Juice", image: "images/orange-juice.png", price: "$2.99" },
    { name: "Iced Tea", image: "images/iced-tea.png", price: "$2.49" },
    { name: "Coffee", image: "images/coffee.png", price: "$3.99" },
    { name: "Tea", image: "images/tea.png", price: "$3.49" },
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const categoryItems = document.querySelectorAll('.category-item');
  const categoryProductList = document.getElementById('category-product-list');
  const categoryTitle = document.getElementById('category-title');
  const categorySection = document.getElementById('category-products');
  const cartButton = document.querySelector('.cart-btn');
  const accountBtn = document.querySelector('.account-btn');

  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCartDisplay() {
    const cartCount = cartItems.length;
    const cartTotal = cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '')) || 0;
      return total + price;
    }, 0);
    cartButton.innerText = `$${cartTotal.toFixed(2)} (${cartCount})`;
  }

  window.addToCart = function (product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existing = cart.find(item => item.name === product.name);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    cartItems = cart; // update local cartItems
    updateCartDisplay();
  };

  function renderProducts(category) {
    categoryProductList.innerHTML = '';
    const selectedProducts = products[category] || [];

    selectedProducts.forEach((product) => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p class="desc">${product.price}</p>
        <button class="buy-now-btn">Buy Now</button>
      `;
      productCard.querySelector('button').addEventListener('click', () => {
        addToCart(product);
        animateCart?.(); // optional if animateCart() exists
      });
      categoryProductList.appendChild(productCard);
    });
  }

  function displayProducts(category) {
    categoryProductList.innerHTML = '';
    categoryTitle.innerText = category;
    const selectedProducts = products[category];

    selectedProducts.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product-item');
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <p>${product.name}</p>
        <p class="price">${product.price}</p>
        <button class="buy-now-btn">Buy Now</button>
      `;
      categoryProductList.appendChild(productElement);
    });

    categorySection.style.display = 'block';

    categoryProductList.querySelectorAll('.buy-now-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        addToCart(selectedProducts[idx]);
      });
    });
  }

  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      const category = item.getAttribute('data-category');
      displayProducts(category); // OR use renderProducts(category);
    });
  });

  cartButton.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });

  accountBtn.addEventListener('click', () => {
    alert("Account feature coming soon!");
  });

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  updateCartDisplay(); // Initialize cart info on load
});

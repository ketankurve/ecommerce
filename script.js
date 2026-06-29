const products = {
  "Bread & Bakery": [
    {
      name: "Whole Wheat Bread",
      image: "images/whole-wheat-bread.png",
      price: "$2.99",
    },
    {
      name: "Multigrain Bread",
      image: "images/multigrain-bread.png",
      price: "$3.49",
    },
    { name: "Pastry", image: "images/pastry.png", price: "$3.99" },
    { name: "Cake", image: "images/cake.png", price: "$4.99" },
  ],
  "Flour & Baking": [
    {
      name: "Besan Gram Flour",
      image: "images/besan-gram-flour.png",
      price: "$2.49",
    },
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
    {
      name: "Margherita Pizza",
      image: "images/margherita-pizza.png",
      price: "$8.99",
    },
    {
      name: "Pepperoni Pizza",
      image: "images/pepperoni-pizza.png",
      price: "$9.99",
    },
    { name: "Veggie Pizza", image: "images/veggie-pizza.png", price: "$10.99" },
    { name: "Tomato Pizza", image: "images/tomato-pizza.png", price: "$11.99" },
  ],
  Beverages: [
    { name: "Orange Juice", image: "images/orange-juice.png", price: "$2.99" },
    { name: "Iced Tea", image: "images/iced-tea.png", price: "$2.49" },
    { name: "Coffee", image: "images/coffee.png", price: "$3.99" },
    { name: "Tea", image: "images/tea.png", price: "$3.49" },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const categoryItems = document.querySelectorAll(".category-item");
  const categoryProductList = document.getElementById("category-product-list");
  const categoryTitle = document.getElementById("category-title");
  const categorySection = document.getElementById("category-products");
  const cartButton = document.querySelector(".cart-btn");
  const accountBtn = document.querySelector(".account-btn");

  // Mobile Menu Logic
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartDisplay() {
    const cartCount = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    const cartTotal = cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace("$", "")) || 0;
      return total + price * (item.quantity || 1);
    }, 0);
    cartButton.innerText = `$${cartTotal.toFixed(2)} (${cartCount})`;
  }

  function showToast(message) {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  window.addToCart = function (product) {
    const existing = cartItems.find((item) => item.name === product.name);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartDisplay();
    showToast(`🛒 ${product.name} added to cart!`);
  };

  function displayProducts(category) {
    categoryProductList.innerHTML = "";
    categoryTitle.innerText = category;
    const selectedProducts = products[category] || [];

    selectedProducts.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product-item");
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src=''" />
        <p>${product.name}</p>
        <p class="price">${product.price}</p>
        <button class="buy-now-btn">Buy Now</button>
      `;
      categoryProductList.appendChild(productElement);
    });

    categorySection.style.display = "block";

    categoryProductList.querySelectorAll(".buy-now-btn").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        addToCart(selectedProducts[idx]);
      });
    });
  }

  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      displayProducts(item.getAttribute("data-category"));

      // Calculate offset for fixed navbar
      const headerOffset = 90;
      const elementPosition = categorySection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });

  cartButton.addEventListener(
    "click",
    () => (window.location.href = "cart.html"),
  );
  if (accountBtn)
    accountBtn.addEventListener("click", () =>
      alert("Account feature coming soon!"),
    );

  // Smooth Scrolling with Offset Fix
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      // Close mobile menu on click
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
      }

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  updateCartDisplay();
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("Sitio cargado correctamente ☕");

  /* ======================
     BUSCADOR (OVERLAY)
  ====================== */
  const searchIcon = document.getElementById("searchIcon");
  const searchOverlay = document.getElementById("searchOverlay");
  const closeSearch = document.getElementById("closeSearch");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (searchIcon && searchOverlay) {
    searchIcon.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      if (searchInput) searchInput.focus();
    });
  }

  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
      if (searchInput) searchInput.value = "";
      if (searchResults) searchResults.innerHTML = "";
    });
  }

  if (searchOverlay) {
    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove("active");
        if (searchInput) searchInput.value = "";
        if (searchResults) searchResults.innerHTML = "";
      }
    });
  }

  function getProductsFromHTML() {
    const cards = document.querySelectorAll(".product-card, .producto-card");
    return Array.from(cards).map(card => ({
      name: card.querySelector("h3")?.textContent.trim() || "",
      price: card.querySelector(".price, .producto-precio")?.textContent.trim() || "",
      image: card.querySelector("img")?.src || "",
      element: card
    }));
  }

  function renderSearchResults(results) {
    if (!searchResults) return;

    searchResults.innerHTML = "";

    if (results.length === 0) {
      searchResults.innerHTML = "<p>No se encontraron productos</p>";
      return;
    }

    results.forEach(p => {
      const item = document.createElement("div");
      item.classList.add("search-item");

      item.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="search-info">
          <strong>${p.name}</strong>
          <span>${p.price}</span>
        </div>
        <button class="btn-agregar">Agregar</button>
      `;

      item.querySelector(".btn-agregar").addEventListener("click", (e) => {
        e.stopPropagation();
        const realBtn = p.element.querySelector("button[data-name][data-price]");
        if (realBtn) realBtn.click();
      });

      searchResults.appendChild(item);
    });
  }

  const allProducts = getProductsFromHTML();

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      if (!query) {
        if (searchResults) searchResults.innerHTML = "";
        return;
      }
      renderSearchResults(
        allProducts.filter(p => p.name.toLowerCase().includes(query))
      );
    });
  }

  /* ======================
     TOAST
  ====================== */
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  /* ======================
     CARRITO
  ====================== */
  const cartBtn = document.getElementById("cartBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    if (!cartItemsEl || !cartTotal || !cartCount) return;

    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<p class="cart-empty">Tu carrito está vacío</p>`;
      cartTotal.textContent = "$0";
      cartCount.textContent = "0";
      return;
    }

    let total = 0;
    let count = 0;

    cart.forEach(item => {
      total += item.price * item.qty;
      count += item.qty;

      cartItemsEl.innerHTML += `
        <div class="cart-item">
          <div>
            ${item.name} x${item.qty}<br>
            <span>$${item.price * item.qty}</span>
          </div>
          <div class="remove" data-name="${item.name}">✖</div>
        </div>
      `;
    });

    cartTotal.textContent = `$${total}`;
    cartCount.textContent = count;

    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        removeItem(btn.dataset.name);
      });
    });
  }

  function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    renderCart();
  }

  function addToCart(name, price) {
    const item = cart.find(p => p.name === name);
    if (item) item.qty++;
    else cart.push({ name, price, qty: 1 });

    saveCart();
    renderCart();
    showToast(`"${name}" agregado al carrito`);
  }

  document.querySelectorAll("button[data-name][data-price]").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.name, Number(btn.dataset.price));
    });
  });

  renderCart();

  /* ======================
     ABRIR / CERRAR CARRITO
  ====================== */
  if (cartBtn && cartOverlay) {
    cartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      cartOverlay.classList.add("active");
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", (e) => {
      if (e.target === cartOverlay || e.target.classList.contains("close-cart")) {
        cartOverlay.classList.remove("active");
      }
    });
  }

  /* ======================
     MOSTRAR SOLO UNA CATEGORÍA
  ====================== */
  const botonesMenu = document.querySelectorAll(".btn-ver-productos");
  const seccionesProductos = document.querySelectorAll(".productos-section");

  botonesMenu.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const targetSection = document.getElementById(targetId);

      if (!targetSection) return;

      // Ocultar todas las categorías
      seccionesProductos.forEach(sec => sec.classList.remove("active"));

      // Mostrar solo la elegida
      targetSection.classList.add("active");

      // Scroll hacia la sección
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* ======================
     SLIDER TESTIMONIOS
  ====================== */
  const track = document.querySelector(".testimonials-track");

  if (track) {
    let items = track.querySelectorAll(".testimonial-item");

    if (items.length > 0) {
      const gap = 24;
      let index = 0;
      let itemWidth = items[0].offsetWidth + gap;

      // Duplicar items para efecto infinito
      items.forEach(item => track.appendChild(item.cloneNode(true)));
      items = track.querySelectorAll(".testimonial-item");

      // Recalcular ancho al cambiar tamaño de ventana (opcional pero útil)
      window.addEventListener("resize", () => {
        itemWidth = items[0].offsetWidth + gap;
      });

      setInterval(() => {
        index++;
        track.style.transition = "transform 0.6s ease";
        track.style.transform = `translateX(-${index * itemWidth}px)`;

        if (index >= items.length / 2) {
          setTimeout(() => {
            track.style.transition = "none";
            index = 0;
            track.style.transform = "translateX(0)";
          }, 500);
        }
      }, 2500);
    }
  }

  /* ======================
     RESERVAS
  ====================== */
  const btnReservas = document.getElementById("btnReservas");
  const reservasSection = document.getElementById("reservas");
  const cerrarReservas = document.getElementById("cerrarReservas");

  if (btnReservas && reservasSection) {
    btnReservas.addEventListener("click", (e) => {
      e.preventDefault();
      reservasSection.classList.add("active");
      reservasSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (cerrarReservas && reservasSection) {
    cerrarReservas.addEventListener("click", () => {
      reservasSection.classList.remove("active");
    });
  }
});

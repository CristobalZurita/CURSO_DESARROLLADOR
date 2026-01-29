/* =========================================
   LOGICA DEL SITIO - AROMA & GRANO
   Notificaciones de productos agregados
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // =============================================
    // VARIABLES GLOBALES
    // =============================================
    
    const products = {
        1: { name: 'Espresso Romano', price: 3500, image: 'assets/img/productos/expresso romano.jpg' },
        2: { name: 'Flat White', price: 4500, image: 'assets/img/productos/flat white.jpg' },
        3: { name: 'Cold Brew', price: 4000, image: 'assets/img/productos/cold brew.jpeg' },
        4: { name: 'Cappuccino', price: 4200, image: 'assets/img/productos/cappuccino.jpeg' },
        5: { name: 'Macchiato', price: 3800, image: 'assets/img/productos/macchiato.jpeg' },
        6: { name: 'Americano', price: 3200, image: 'assets/img/productos/americano.jpeg' }
    };

    // =============================================
    // 1. EFECTO SCROLL EN HEADER
    // Objetivo: Añadir sombra cuando el usuario baja
    // =============================================
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    });

    // =============================================
    // 2. BOTONES "AGREGAR AL CARRITO"
    // Objetivo: Mostrar notificación al agregar
    // =============================================

    const cartNotification = document.getElementById('cartNotification');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-product');
            const product = products[productId];
            
            // Mostrar notificación
            showCartNotification(product, productId);
        });
    });

    // Mostrar notificación toast
    function showCartNotification(product, productId) {
        const notification = document.createElement('div');
        notification.className = 'cart-toast';
        notification.innerHTML = `
            <div class="cart-toast__image"><img src="${product.image}" style="width: 100%; height: 100%; object-fit: cover;"></div>
            <div class="cart-toast__content">
                <div class="cart-toast__title">✓ Agregado al carrito</div>
                <div class="cart-toast__text">${product.name}</div>
                <div class="cart-toast__price">$${product.price.toLocaleString('es-CL')}</div>
            </div>`;
        cartNotification.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('removing');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // =============================================
    // 3. MODAL - VER MENÚ PDF
    // Objetivo: Mostrar menú PDF en modal
    // =============================================

    const viewMenuBtn = document.getElementById('viewMenuBtn');
    const menuModal = document.getElementById('menuModal');
    const closeMenuBtn = document.getElementById('closeMenu');
    const modalOverlay = document.getElementById('modalOverlay');

    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', () => {
            menuModal.classList.remove('modal--hidden');
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            menuModal.classList.add('modal--hidden');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            menuModal.classList.add('modal--hidden');
        });
    }

});

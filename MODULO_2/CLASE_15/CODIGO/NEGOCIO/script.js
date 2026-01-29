/**
 * DULCE HORNO - TIENDA VIRTUAL
 */

const productos = [
    {
        id: 1,
        nombre: "Torta de Chocolate Premium",
        categoria: "Tortas",
        descripcion: "Torta de chocolate belga con ganache artesanal.",
        imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        precio: 25000,
        isFavorito: false
    },
    {
        id: 2,
        nombre: "Cheesecake New York",
        categoria: "Tartas",
        descripcion: "Cheesecake clásico con frutos rojos.",
        imagen: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
        precio: 22000,
        isFavorito: false
    },
    {
        id: 3,
        nombre: "Cupcakes Gourmet",
        categoria: "Cupcakes",
        descripcion: "Pack de 6 cupcakes artesanales.",
        imagen: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7",
        precio: 12000,
        isFavorito: false
    }
];

$(document).ready(() => {
    renderizarCatalogo();
    actualizarContador();
    iniciarHero();
});

/* CATÁLOGO */
function renderizarCatalogo() {
    const cont = $("#productos-container");
    cont.empty();

    productos.forEach(p => {
        cont.append(`
            <div class="card">
                <img src="${p.imagen}">
                <div class="card-body">
                    <span class="card-category">${p.categoria}</span>
                    <h5>${p.nombre}</h5>
                    <p>${p.descripcion}</p>
                    <p><strong>$${p.precio.toLocaleString("es-CL")}</strong></p>
                    <button class="btn ${p.isFavorito ? 'btn-primary' : 'btn-outline-primary'} w-100"
                        onclick="toggleFavorito(${p.id})">
                        ❤️ Favorito
                    </button>
                </div>
            </div>
        `);
    });
}

function toggleFavorito(id) {
    const p = productos.find(x => x.id === id);
    if (!p) return;
    p.isFavorito = !p.isFavorito;
    renderizarCatalogo();
    actualizarContador();
}

function actualizarContador() {
    $("#contador-favoritos").text(productos.filter(p => p.isFavorito).length);
}

/* HERO CAROUSEL */
const heroImages = [
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
    "https://images.unsplash.com/photo-1542826438-8b06c37f3c38",
    "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62"
];

let heroIndex = 0;
const slides = document.querySelectorAll(".hero-bg");

function iniciarHero() {
    if (!slides.length) return;

    slides.forEach((s, i) => {
        s.style.backgroundImage = `url("${heroImages[i % heroImages.length]}")`;
    });

    setInterval(() => {
        slides.forEach(s => s.classList.remove("active"));
        slides[heroIndex % slides.length].classList.add("active");
        heroIndex++;
    }, 6000);
}

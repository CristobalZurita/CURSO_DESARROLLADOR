/**
 * DULCE HORNO - TIENDA VIRTUAL
 */

const productos = [
    {
        id: 1,
        nombre: "Torta de Chocolate Premium",
        categoria: "Tortas",
        descripcion: "Chocolate belga con ganache artesanal.",
        imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
        precio: 25000,
        isFavorito: false
    },
    {
        id: 2,
        nombre: "Cheesecake New York",
        categoria: "Tartas",
        descripcion: "Clásico cheesecake con frutos rojos.",
        imagen: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=600",
        precio: 22000,
        isFavorito: false
    },
    {
        id: 3,
        nombre: "Cupcakes Gourmet",
        categoria: "Cupcakes",
        descripcion: "Pack de 6 cupcakes artesanales.",
        imagen: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600",
        precio: 12000,
        isFavorito: false
    }
];

$(document).ready(() => {
    renderizarCatalogo();
    actualizarContador();
    iniciarHero();
});

function renderizarCatalogo() {
    const c = $("#productos-container");
    c.empty();

    productos.forEach(p => {
        c.append(`
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${p.imagen}" alt="${p.nombre}">
                <div class="card-body">
                    <span class="card-category">${p.categoria}</span>
                    <h5>${p.nombre}</h5>
                    <p>${p.descripcion}</p>
                    <p class="fw-bold">$${p.precio.toLocaleString("es-CL")}</p>
                    <button class="btn btn-outline-danger w-100" onclick="toggleFavorito(${p.id})">
                        ❤️ Favorito
                    </button>
                </div>
            </div>
        </div>
        `);
    });
}

function toggleFavorito(id) {
    const p = productos.find(x => x.id === id);
    p.isFavorito = !p.isFavorito;
    actualizarContador();
}

function actualizarContador() {
    $("#contador-favoritos").text(
        productos.filter(p => p.isFavorito).length
    );
}

/* HERO CAROUSEL */
const heroImgs = [
    "https://images.unsplash.com/photo-1542826438-8b06c37f3c38?w=1600",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1600",
    "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=1600"
];

let heroIndex = 0;
const slides = document.querySelectorAll(".hero-bg");

function iniciarHero() {
    slides.forEach((s,i) => {
        s.style.backgroundImage = `url("${heroImgs[i % heroImgs.length]}")`;
    });

    setInterval(() => {
        slides.forEach(s => s.classList.remove("active"));
        slides[heroIndex % slides.length].classList.add("active");
        heroIndex++;
    }, 6000);
}

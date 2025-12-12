// ===============================
// 1) MENÚ HAMBURGUESA
// ===============================
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        navToggle.setAttribute(
            "aria-label",
            navMenu.classList.contains("open") ? "Cerrar menú" : "Abrir menú"
        );
    });

    // Cerrar menú al tocar un link en móvil
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) navMenu.classList.remove("open");
        });
    });
}

// ===============================
// 2) FILTROS DE EVENTOS
// ===============================
const filterButtons = document.querySelectorAll(".filter-btn");
const eventCards = document.querySelectorAll(".event-card");

function applyFilter(category) {
    eventCards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");
        const show = (category === "all") || (cardCategory === category);
        card.classList.toggle("is-hidden", !show);
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const category = btn.getAttribute("data-filter") || "all";
        applyFilter(category);
    });
});

// ===============================
// 3) VALIDACIÓN FORMULARIO
// ===============================
const form         = document.getElementById("registroForm");
const inputNombre  = document.getElementById("nombre");
const inputCorreo  = document.getElementById("correo");
const inputEdad    = document.getElementById("edad");
const mensajes     = document.getElementById("mensaje");

const patronNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mostrarMensaje(texto, tipo) {
    if (!mensajes) return;
    mensajes.textContent = texto;
    mensajes.className = "";
    if (tipo === "error") mensajes.classList.add("error");
    if (tipo === "ok") mensajes.classList.add("ok");
}

function validarFormulario(evento) {
    evento.preventDefault();

    const nombre  = (inputNombre?.value || "").trim();
    const correo  = (inputCorreo?.value || "").trim();
    const edadStr = (inputEdad?.value || "").trim();
    const edad    = Number(edadStr);

    if (!nombre || !correo || !edadStr) {
        mostrarMensaje("Todos los campos son obligatorios.", "error");
        return;
    }

    if (!patronNombre.test(nombre)) {
        mostrarMensaje("El nombre solo puede contener letras y espacios.", "error");
        return;
    }

    if (!patronCorreo.test(correo)) {
        mostrarMensaje("Ingresa un correo electrónico válido.", "error");
        return;
    }

    if (Number.isNaN(edad) || edad < 18) {
        mostrarMensaje("La edad debe ser un número mayor o igual a 18.", "error");
        return;
    }

    mostrarMensaje("Registro completado correctamente. ¡Bienvenido a PANORAMAS MOMO!", "ok");
}

if (form) form.addEventListener("submit", validarFormulario);

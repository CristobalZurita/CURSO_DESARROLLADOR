// Referencias a los elementos del DOM
const form         = document.getElementById("formRegistro");
const inputNombre  = document.getElementById("nombre");
const inputCorreo  = document.getElementById("correo");
const inputEdad    = document.getElementById("edad");
const mensajes     = document.getElementById("mensajes");

// Patrones de validación
const patronNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Función para mostrar mensajes en el área designada
function mostrarMensaje(texto, tipo) {
    mensajes.textContent = texto;   // Escribe el texto

    // Limpia clases anteriores y agrega la nueva
    mensajes.className = "";
    if (tipo === "error") {
        mensajes.classList.add("error");
    } else if (tipo === "ok") {
        mensajes.classList.add("ok");
    }
}

// Función principal de validación
function validarFormulario(evento) {
    // Evita que el formulario se envíe automáticamente
    evento.preventDefault();

    // Obtiene y limpia los valores
    const nombre  = inputNombre.value.trim();
    const correo  = inputCorreo.value.trim();
    const edadStr = inputEdad.value.trim();
    const edad    = Number(edadStr);

    // 1) Verificar que los campos no estén vacíos
    if (!nombre || !correo || !edadStr) {
        mostrarMensaje("Todos los campos son obligatorios.", "error");
        return;
    }

    // 2) Validar que el nombre solo tenga letras y espacios
    if (!patronNombre.test(nombre)) {
        mostrarMensaje("El nombre solo puede contener letras y espacios.", "error");
        return;
    }

    // 3) Validar formato de correo
    if (!patronCorreo.test(correo)) {
        mostrarMensaje("Ingresa un correo electrónico válido.", "error");
        return;
    }

    // 4) Verificar que la edad sea un número mayor o igual a 18
    if (Number.isNaN(edad) || edad < 18) {
        mostrarMensaje("La edad debe ser un número mayor o igual a 18.", "error");
        return;
    }

    // Si todo está correcto
    mostrarMensaje("Registro completado correctamente.", "ok");
    // form.reset(); // Descomenta si quieres limpiar el formulario
}

// Asocia la función al evento submit del formulario
form.addEventListener("submit", validarFormulario);

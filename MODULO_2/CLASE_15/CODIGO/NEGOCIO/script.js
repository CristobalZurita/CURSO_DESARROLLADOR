/**
 * ============================================
 * PASTELERÍA DULCE HORNO - TIENDA VIRTUAL
 * Aplicación de gestión de productos y favoritos
 * ============================================
 */

// ============================================
// DATOS DE PRODUCTOS
// ============================================
let productos = [
    {
        id: 1,
        nombre: "Torta de Chocolate Premium",
        categoria: "Tortas",
        descripcion: "Deliciosa torta de chocolate belga con relleno de ganache suave. Perfecta para celebraciones especiales.",
        imagen: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        precio: 25000,
        isFavorito: false
    },
    {
        id: 2,
        nombre: "Cheesecake New York",
        categoria: "Tartas",
        descripcion: "Auténtico cheesecake estilo New York con base de galleta y frutos rojos frescos del día.",
        imagen: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=400&fit=crop",
        precio: 22000,
        isFavorito: false
    },
    {
        id: 3,
        nombre: "Cupcakes Gourmet",
        categoria: "Cupcakes",
        descripcion: "Set de 6 cupcakes con variedad de sabores y buttercream artesanal. Ideal para compartir.",
        imagen: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop",
        precio: 12000,
        isFavorito: false
    },
    {
        id: 4,
        nombre: "Brownies Belgas",
        categoria: "Brownies",
        descripcion: "Brownies húmedos de chocolate belga 70% cacao con nueces pecanas. Una explosión de sabor.",
        imagen: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop",
        precio: 8000,
        isFavorito: false
    },
    {
        id: 5,
        nombre: "Tarta Mousse de Limón",
        categoria: "Tartas",
        descripcion: "Refrescante tarta de mousse de limón natural sobre base crujiente. Perfecta para el verano.",
        imagen: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop",
        precio: 20000,
        isFavorito: false
    },
    {
        id: 6,
        nombre: "Kuchen Alemán de Manzana",
        categoria: "Kuchen",
        descripcion: "Receta tradicional alemana con manzanas frescas, canela y masa hojaldrada casera.",
        imagen: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop",
        precio: 18000,
        isFavorito: false
    }
];

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================
$(document).ready(function() {
    console.log('🧁 Pastelería Dulce Horno - Aplicación iniciada');
    
    // Renderizar el catálogo de productos
    renderizarCatalogo();
    
    // Configurar event listeners
    configurarEventos();
    
    // Actualizar contador inicial
    actualizarContador();
    
    // Animación suave al hacer scroll
    configurarScrollSuave();
});

// ============================================
// RENDERIZADO DEL CATÁLOGO
// ============================================
/**
 * Renderiza todas las tarjetas de productos en el DOM
 */
function renderizarCatalogo() {
    const $container = $('#productos-container');
    $container.empty(); // Limpiar contenedor
    
    // Generar HTML para cada producto
    productos.forEach(function(producto) {
        const tarjetaHTML = crearTarjetaProducto(producto);
        $container.append(tarjetaHTML);
    });
    
    console.log(`✅ ${productos.length} productos renderizados`);
}

/**
 * Crea el HTML de una tarjeta de producto
 * @param {Object} producto - Objeto con datos del producto
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaProducto(producto) {
    // Determinar clases y texto del botón según estado
    const claseBoton = producto.isFavorito ? 'btn-primary' : 'btn-outline-primary';
    const textoBoton = producto.isFavorito ? 'En Favoritos' : 'Agregar a Favoritos';
    const iconoBoton = producto.isFavorito ? 'fas fa-heart' : 'far fa-heart';
    const claseTarjeta = producto.isFavorito ? 'card card-favorito' : 'card';
    
    return `
        <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="${claseTarjeta}" data-producto-id="${producto.id}">
                <img src="${producto.imagen}" 
                     class="card-img-top" 
                     alt="${producto.nombre}"
                     loading="lazy">
                <div class="card-body">
                    <span class="card-category">${producto.categoria}</span>
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="text-primary fw-bold mb-3">
                        <i class="fas fa-tag me-2"></i>
                        $${producto.precio.toLocaleString('es-CL')}
                    </p>
                    <button class="btn ${claseBoton} btn-favorito w-100" 
                            data-product-id="${producto.id}">
                        <i class="${iconoBoton}"></i>
                        ${textoBoton}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// CONFIGURACIÓN DE EVENTOS
// ============================================
/**
 * Configura todos los event listeners de la aplicación
 */
function configurarEventos() {
    // Event delegation para botones de favoritos
    // Esto permite que funcione incluso con elementos dinámicos
    $('#productos-container').on('click', '.btn-favorito', function(e) {
        e.preventDefault();
        
        // Obtener ID del producto desde el atributo data
        const productId = parseInt($(this).data('product-id'));
        
        // Llamar a la función de toggle
        toggleFavorito(productId);
    });
    
    console.log('✅ Event listeners configurados');
}

// ============================================
// LÓGICA DE FAVORITOS
// ============================================
/**
 * Alterna el estado de favorito de un producto
 * @param {number} id - ID del producto
 */
function toggleFavorito(id) {
    // Buscar el producto en el array
    const producto = buscarProductoPorId(id);
    
    if (!producto) {
        console.error(`❌ Producto con ID ${id} no encontrado`);
        return;
    }
    
    // Toggle del estado
    producto.isFavorito = !producto.isFavorito;
    
    // Log para debugging
    console.log(`${producto.isFavorito ? '❤️ Agregado' : '💔 Eliminado'}: ${producto.nombre}`);
    
    // Actualizar la interfaz
    actualizarUIProducto(id, producto.isFavorito);
    
    // Mostrar notificación
    mostrarNotificacion(producto.nombre, producto.isFavorito);
    
    // Actualizar contador
    actualizarContador();
}

/**
 * Busca un producto por su ID
 * @param {number} id - ID del producto
 * @returns {Object|undefined} Producto encontrado
 */
function buscarProductoPorId(id) {
    return productos.find(producto => producto.id === id);
}

// ============================================
// ACTUALIZACIÓN DE LA INTERFAZ
// ============================================
/**
 * Actualiza la UI de un producto específico
 * @param {number} id - ID del producto
 * @param {boolean} esFavorito - Estado de favorito
 */
function actualizarUIProducto(id, esFavorito) {
    // Selector del botón
    const $boton = $(`.btn-favorito[data-product-id="${id}"]`);
    
    // Selector de la tarjeta padre
    const $tarjeta = $boton.closest('.card');
    
    if (esFavorito) {
        // Cambiar a estado FAVORITO
        $boton.removeClass('btn-outline-primary').addClass('btn-primary');
        $boton.html('<i class="fas fa-heart"></i> En Favoritos');
        $tarjeta.addClass('card-favorito');
    } else {
        // Cambiar a estado NORMAL
        $boton.removeClass('btn-primary').addClass('btn-outline-primary');
        $boton.html('<i class="far fa-heart"></i> Agregar a Favoritos');
        $tarjeta.removeClass('card-favorito');
    }
    
    // Pequeña animación de feedback
    $boton.addClass('pulse');
    setTimeout(() => $boton.removeClass('pulse'), 300);
}

/**
 * Actualiza el contador de favoritos en la navegación
 */
function actualizarContador() {
    const cantidadFavoritos = productos.filter(p => p.isFavorito).length;
    $('#contador-favoritos').text(cantidadFavoritos);
    
    // Pequeña animación cuando cambia
    $('#contador-favoritos').parent()
        .addClass('fw-bold')
        .css('color', cantidadFavoritos > 0 ? '#ff6b6b' : '');
}

// ============================================
// SISTEMA DE NOTIFICACIONES
// ============================================
/**
 * Muestra una notificación temporal
 * @param {string} nombreProducto - Nombre del producto
 * @param {boolean} agregado - True si se agregó, false si se eliminó
 */
function mostrarNotificacion(nombreProducto, agregado) {
    // Determinar tipo y mensaje
    const tipo = agregado ? 'success' : 'info';
    const icono = agregado ? '✓' : 'ℹ';
    const accion = agregado ? 'agregado a' : 'eliminado de';
    const mensaje = `${icono} <strong>${nombreProducto}</strong> ${accion} favoritos`;
    
    // Crear el HTML de la alerta
    const alertHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    
    // Insertar en el contenedor (con fade in)
    const $alerta = $(alertHTML).hide();
    $('#notificaciones-container').prepend($alerta);
    $alerta.fadeIn(300);
    
    // Auto-cerrar después de 4 segundos
    setTimeout(function() {
        $alerta.fadeOut(300, function() {
            $(this).remove();
        });
    }, 4000);
}

// ============================================
// UTILIDADES
// ============================================
/**
 * Configura scroll suave para enlaces de navegación
 */
function configurarScrollSuave() {
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        
        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
}

// ============================================
// FUNCIONES DE DEBUGGING (Opcional)
// ============================================
/**
 * Muestra el estado actual de todos los productos
 * Útil para debugging en la consola
 */
function verEstadoProductos() {
    console.table(productos.map(p => ({
        ID: p.id,
        Nombre: p.nombre,
        Favorito: p.isFavorito ? '❤️' : '🤍',
        Precio: `$${p.precio.toLocaleString('es-CL')}`
    })));
}

/**
 * Obtiene solo los productos favoritos
 */
function obtenerFavoritos() {
    return productos.filter(p => p.isFavorito);
}

// Exponer funciones útiles al objeto window para debugging
window.pasteleria = {
    verEstadoProductos,
    obtenerFavoritos,
    productos
};

console.log('💡 Tip: Usa pasteleria.verEstadoProductos() en la consola para ver el estado actual');
// Capturar elementos del DOM
const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const resultValue = document.getElementById("resultValue");
const operator = document.getElementById("operator");
const userNameInput = document.getElementById("userName"); // Campo de usuario
const historialTbody = document.querySelector("#historialLista tbody"); // Cuerpo de la tabla
const btnLimpiar = document.getElementById("btnLimpiar");

let historial = [];
let activeInput = num1Input; // Variable para rastrear el campo de entrada activo

// --- FUNCIONES DE LÓGICA DE LA CALCULADORA ---

/**
 * Función que realiza la operación matemática y actualiza el DOM.
 * @param {string} operacion - La operación a realizar ('+', '-', '*', '/').
 * @param {string} simbolo - El símbolo visual de la operación.
 */
function calcular(operacion, simbolo) {
    const userName = userNameInput.value.trim();
    const valor1 = Number(num1Input.value);
    const valor2 = Number(num2Input.value);
    let resultado = 0;

    // Validación CRÍTICA: Asegurarse de que el usuario ingresó su nombre
    if (userName === "") {
        alert("¡Alto! Debes ingresar un Nombre de Usuario para registrar la operación en el historial.");
        userNameInput.focus();
        return;
    }
    
    // Validación de números y campos llenos
    if (num1Input.value === "" || num2Input.value === "") {
        resultValue.textContent = "Complete ambos campos numéricos.";
        return;
    }

    if (isNaN(valor1) || isNaN(valor2)) {
         resultValue.textContent = "Error: Ingrese números válidos.";
         return;
    }

    // Lógica de cálculo
    switch (operacion) {
        case '+': resultado = valor1 + valor2; break;
        case '-': resultado = valor1 - valor2; break;
        case '*': resultado = valor1 * valor2; break;
        case '/':
            if (valor2 === 0) {
                resultValue.textContent = "Error: División por cero";
                return;
            }
            resultado = valor1 / valor2;
            break;
    }

    // Redondear a 6 decimales para precisión
    resultado = Math.round(resultado * 1000000) / 1000000;

    mostrarResultado(resultado);
    agregarAlHistorial(userName, valor1, valor2, simbolo, resultado); 
    actualizarOperador(simbolo);
}

function mostrarResultado(valor) {
    resultValue.textContent = valor;
    
    // Animación sutil
    resultValue.style.transform = "scale(1.05)";
    setTimeout(() => {
        resultValue.style.transform = "scale(1)";
    }, 200);
}

function actualizarOperador(simbolo) {
    operator.textContent = simbolo;
    operator.style.transform = "rotate(360deg)";
    setTimeout(() => {
        operator.style.transform = "rotate(0deg)";
    }, 300);
}

// --- FUNCIONES DE HISTORIAL (TABLA) ---

function agregarAlHistorial(usuario, num1, num2, operacion, resultado) {
    const fechaCompleta = new Date();
    // Formato de hora y fecha legible
    const hora = fechaCompleta.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fecha = fechaCompleta.toLocaleDateString('es-ES');
    
    historial.unshift({
        usuario: usuario,
        operacionStr: `${num1} ${operacion} ${num2}`,
        resultado: resultado,
        fechaHora: `${fecha} ${hora}`
    });

    if (historial.length > 20) {
        historial.pop();
    }

    actualizarHistorialDOM();
}

function actualizarHistorialDOM() {
    historialTbody.innerHTML = ''; // Limpia el cuerpo de la tabla

    if (historial.length === 0) {
        historialTbody.innerHTML = '<tr class="empty-row"><td colspan="4">Sin operaciones registradas</td></tr>';
        return;
    }

    // Recorre y crea filas <tr> para la tabla
    historial.forEach((item) => {
        const row = historialTbody.insertRow(historialTbody.rows.length);
        row.className = 'history-item-row';
        
        row.insertCell(0).textContent = item.usuario;
        row.insertCell(1).textContent = item.operacionStr;
        row.insertCell(2).textContent = item.resultado;
        row.insertCell(3).textContent = item.fechaHora;
    });
}

function limpiarHistorial() {
    historial = [];
    actualizarHistorialDOM();
}

// --- LISTENERS DE CÁLCULO ---

// Asignar Event Listeners a cada botón de cálculo
document.getElementById("btnSumar").addEventListener("click", function() {
    calcular('+', '+');
});

document.getElementById("btnRestar").addEventListener("click", function() {
    calcular('-', '−');
});

document.getElementById("btnMultiplicar").addEventListener("click", function() {
    calcular('*', '×');
});

document.getElementById("btnDividir").addEventListener("click", function() {
    calcular('/', '÷');
});

btnLimpiar.addEventListener("click", limpiarHistorial);

// --- LÓGICA DE KEYPAD (Botones 0-9 y Control) ---

// 1. Alternar el input activo al hacer foco
num1Input.addEventListener('focus', () => {
    activeInput = num1Input;
});

num2Input.addEventListener('focus', () => {
    activeInput = num2Input;
});

// Inicializar el foco en el primer input (opcional, pero ayuda)
num1Input.focus();

// 2. Lógica para botones numéricos y decimal
document.querySelectorAll('.btn-num').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        
        if (value === '.') {
            // Evitar múltiples puntos decimales
            if (activeInput.value.includes('.')) {
                return;
            }
        }
        
        // Agregar el valor al input activo
        activeInput.value += value;
    });
});

// 3. Botón de Borrar Entrada (CE - Clear Entry)
document.querySelector('.btn-clear-entry').addEventListener('click', () => {
    // Borra el último carácter del campo activo
    activeInput.value = activeInput.value.slice(0, -1);
});

// 4. Botón de Igual (=)
document.querySelector('.btn-equals').addEventListener('click', () => {
    // Ejecuta la operación basada en el operador visible
    const currentOperator = operator.textContent.trim();
    if (currentOperator === '+') {
        document.getElementById("btnSumar").click();
    } else if (currentOperator === '−') {
        document.getElementById("btnRestar").click();
    } else if (currentOperator === '×') {
        document.getElementById("btnMultiplicar").click();
    } else if (currentOperator === '÷') {
        document.getElementById("btnDividir").click();
    } else {
        // En caso de que no haya un operador claro, por defecto usamos la suma
        document.getElementById("btnSumar").click();
    }
});


// --- EFECTOS VISUALES Y EVENTOS DE TECLADO ---

// Efecto de "Presionado" en todos los botones
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.classList.add('btn-pressed');
    });
    button.addEventListener('mouseup', () => {
        button.classList.remove('btn-pressed');
    });
    button.addEventListener('mouseleave', () => {
        button.classList.remove('btn-pressed');
    });
});

// Resaltar la fila de entrada
const inputRow = document.querySelector('.input-row');
inputRow.addEventListener('mouseenter', () => {
    inputRow.style.backgroundColor = '#f0f0f0'; 
    inputRow.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)';
});
inputRow.addEventListener('mouseleave', () => {
    inputRow.style.backgroundColor = 'transparent';
    inputRow.style.boxShadow = 'none';
});

// Permitir calcular con Enter
num1Input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault(); 
        num2Input.focus();
    }
});

num2Input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault(); 
        // Usar el botón de igual para ejecutar la operación actual
        document.querySelector('.btn-equals').click();
    }
});

// Inicialización
actualizarHistorialDOM();
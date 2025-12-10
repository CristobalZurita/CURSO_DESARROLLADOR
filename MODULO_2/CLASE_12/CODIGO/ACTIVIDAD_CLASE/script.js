// 1. Capturar elementos del DOM que se usarán repetidamente (Inputs y Resultado)
const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const resultadoParrafo = document.getElementById("resultado");

/**
 * Función central para realizar la operación seleccionada.
 * @param {string} operacion - La operación a realizar ('+', '-', '*', '/').
 */
function calcular(operacion) {
    // Captura los valores de los inputs y los convierte a números.
    const valor1 = Number(num1Input.value);
    const valor2 = Number(num2Input.value);
    let resultado = 0;
    
    // Si algún campo está vacío o no es un número válido, detiene la operación.
    if (isNaN(valor1) || isNaN(valor2)) {
        resultadoParrafo.textContent = "Resultado: Error en la entrada de números.";
        return;
    }

    // Lógica para cada operación
    switch (operacion) {
        case '+':
            resultado = valor1 + valor2;
            break;
        case '-':
            resultado = valor1 - valor2;
            break;
        case '*':
            resultado = valor1 * valor2;
            break;
        case '/':
            if (valor2 === 0) {
                resultadoParrafo.textContent = "Resultado: Error, división por cero.";
                return;
            }
            resultado = valor1 / valor2;
            break;
        default:
            resultadoParrafo.textContent = "Resultado: Operación no válida.";
            return;
    }

    // 2. Actualizar el contenido visible en la página (Manipulación del DOM)
    // Se usa textContent para inyectar el resultado como texto.
    resultadoParrafo.textContent = "Resultado: " + resultado;
}

// 3. Asignar Event Listeners (Responder a eventos de clic)
// Se asigna la función calcular() a cada botón con la operación respectiva.
document.getElementById("btnSumar").addEventListener("click", function() {
    calcular('+');
});

document.getElementById("btnRestar").addEventListener("click", function() {
    calcular('-');
});

document.getElementById("btnMultiplicar").addEventListener("click", function() {
    calcular('*');
});

document.getElementById("btnDividir").addEventListener("click", function() {
    calcular('/');
});
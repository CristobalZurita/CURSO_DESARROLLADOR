// ============================================
// calculator.js — El Calculador Personal
// Reto integrado con validación por parentesco
// ============================================

/**
 * Calcula datos básicos del usuario raíz
 * @param {number} edad
 * @param {number} anioActual
 * @returns {object}
 */
function calcularDatosPersona(edad, anioActual) {
  // --- Operadores aritméticos ---
  const anioNacimiento = anioActual - edad;

  // --- Operadores de comparación y lógicos ---
  const mayorEdad    = edad >= 18;
  const jovenAdulto  = edad >= 18 && edad < 30;
  const adultoMedio  = edad >= 30 && edad < 60;
  const adultoMayor  = edad >= 60;

  // --- Template literal (mensaje principal) ---
  const mensaje = `Tienes ${edad} años. Naciste en ${anioNacimiento}. ¿Mayor de edad? ${mayorEdad ? 'Sí ✓' : 'No ✗'}`;

  // Log en consola (requisito del reto)
  console.log('=== Calculador Personal ===');
  console.log('Año de nacimiento:', anioNacimiento);
  console.log('¿Mayor de edad?', mayorEdad);
  console.log('¿Joven adulto?', jovenAdulto);
  console.log(mensaje);

  return { anioNacimiento, mayorEdad, jovenAdulto, adultoMedio, adultoMayor, mensaje };
}

/**
 * Validación lógica de edad por tipo de parentesco
 * Retorna { valido, tipo, mensaje }
 *
 * Reglas:
 *  - Padre/Madre:    DEBE ser mayor que yo (mínimo yo+13 años)
 *  - Abuelo/a:       DEBE ser mayor que yo (mínimo yo+26 años)
 *  - Bisabuelo/a:    DEBE ser mayor que yo (mínimo yo+39 años)
 *  - Hijo/a:         PUEDE ser menor o igual, pero no mayor que (yo - 13)
 *  - Nieto/a:        PUEDE ser cualquier edad, pero lógicamente menor
 *  - Bisnieto/a:     Razonablemente <18 (advertencia si mayor)
 *  - Hermano/a:      Rango libre, advertencia si diferencia > 25 años
 */
function validarEdadParentesco(edadPariente, edadYo, relacion) {
  const dif = edadPariente - edadYo; // positivo = pariente mayor que yo

  const reglas = {
    'Padre':      { minDif:  13, maxDif: 70,  dir: 'mayor' },
    'Madre':      { minDif:  13, maxDif: 65,  dir: 'mayor' },
    'Abuelo':     { minDif:  26, maxDif: 100, dir: 'mayor' },
    'Abuela':     { minDif:  26, maxDif: 100, dir: 'mayor' },
    'Bisabuelo':  { minDif:  39, maxDif: 130, dir: 'mayor' },
    'Bisabuela':  { minDif:  39, maxDif: 130, dir: 'mayor' },
    'Hijo':       { minDif: -70, maxDif: -13, dir: 'menor' },
    'Hija':       { minDif: -70, maxDif: -13, dir: 'menor' },
    'Nieto':      { minDif: -100, maxDif: -1, dir: 'menor' },
    'Nieta':      { minDif: -100, maxDif: -1, dir: 'menor' },
    'Bisnieto':   { minDif: -100, maxDif: 0,  dir: 'menor' },
    'Bisnieta':   { minDif: -100, maxDif: 0,  dir: 'menor' },
    'Hermano':    { minDif: -25,  maxDif: 25, dir: 'libre'  },
    'Hermana':    { minDif: -25,  maxDif: 25, dir: 'libre'  },
  };

  const regla = reglas[relacion];
  if (!regla) return { valido: true, tipo: 'info', mensaje: '' };

  // Cálculos con operadores aritméticos y comparación
  const esValido    = dif >= regla.minDif && dif <= regla.maxDif;
  const esFrontera  = Math.abs(dif - regla.minDif) <= 5 || Math.abs(dif - regla.maxDif) <= 5;

  if (regla.dir === 'mayor' && edadPariente <= edadYo) {
    return {
      valido: false,
      tipo: 'invalid',
      mensaje: `⚠️ Tu ${relacion.toLowerCase()} debe ser mayor que tú. 
        Diferencia mínima esperada: ${regla.minDif} años.`
    };
  }

  if (regla.dir === 'menor' && edadPariente >= edadYo) {
    return {
      valido: false,
      tipo: 'invalid',
      mensaje: `⚠️ Tu ${relacion.toLowerCase()} no puede ser mayor que tú 
        (diferencia esperada: mínimo ${Math.abs(regla.maxDif)} años menor).`
    };
  }

  if (!esValido) {
    return {
      valido: false,
      tipo: 'invalid',
      mensaje: `⚠️ La edad ingresada no es lógica para un/a ${relacion.toLowerCase()}. 
        Diferencia con tu edad: ${dif > 0 ? '+' : ''}${dif} años.`
    };
  }

  // Bisnieto mayor de 18: advertencia, no error
  if ((relacion === 'Bisnieto' || relacion === 'Bisnieta') && edadPariente >= 18) {
    return {
      valido: true,
      tipo: 'warning',
      mensaje: `ℹ️ Bisnieto/a de ${edadPariente} años: poco común, pero posible. 
        Año nacimiento: ${2025 - edadPariente}.`
    };
  }

  if (esFrontera) {
    return {
      valido: true,
      tipo: 'warning',
      mensaje: `ℹ️ Edad en el límite lógico para un/a ${relacion.toLowerCase()}, pero válida.`
    };
  }

  // Calcular datos del pariente
  const anioNacPariente = 2025 - edadPariente;
  const mayorEdad       = edadPariente >= 18;
  const jovenAdulto     = edadPariente >= 18 && edadPariente < 30;

  console.log(`[Calculador] ${relacion} — Año nac.: ${anioNacPariente} | Mayor edad: ${mayorEdad} | Joven adulto: ${jovenAdulto}`);

  return {
    valido: true,
    tipo: 'valid',
    mensaje: `✓ Válido. Año de nacimiento: ${anioNacPariente}. 
      ¿Mayor de edad? ${mayorEdad ? 'Sí' : 'No'}. 
      ¿Joven adulto? ${jovenAdulto ? 'Sí' : 'No'}.`
  };
}

// Exportar para uso en otros módulos
window.Calculator = { calcularDatosPersona, validarEdadParentesco };

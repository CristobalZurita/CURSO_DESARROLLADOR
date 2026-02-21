/**
 * calculator.js – Pulp Fiction Tip Calculator
 * ==============================================
 * Funciones puras de cálculo (ejercicio base intacto)
 * + Módulo de UI encapsulado en IIFE
 */

'use strict';

/* ============================================================
   FUNCIONES PURAS DE CÁLCULO
   (Paso 2 y 3 del ejercicio – sin modificar)
   ============================================================ */

/**
 * Calcula el monto de la propina.
 * @param {number} montoCuenta       - Monto base de la cuenta
 * @param {number} porcentajePropina - Porcentaje (ej: 10 → 10%)
 * @returns {number}
 */
function calcularPropina(montoCuenta, porcentajePropina) {
  let propina = montoCuenta * (porcentajePropina / 100);
  return propina;
}

/**
 * Calcula el total a pagar.
 * @param {number} montoCuenta - Monto de la cuenta
 * @param {number} propina     - Monto de la propina
 * @returns {number}
 */
function calcularTotal(montoCuenta, propina) {
  return montoCuenta + propina;
}

/**
 * Formatea un número como moneda CLP.
 * @param {number} valor
 * @returns {string} "$25.000"
 */
function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(Math.round(valor));
}

/**
 * Genera el output de consola (Paso 4 del ejercicio).
 * Función reutilizable: usa calcularPropina y calcularTotal internamente.
 * @param {number} cuenta
 * @param {number} porcentaje
 * @returns {Array<{key:string, value:string}>}
 */
function generarOutputConsola(cuenta, porcentaje) {
  const propina = calcularPropina(cuenta, porcentaje);
  const total   = calcularTotal(cuenta, propina);

  // Equivale al Paso 4 del ejercicio:
  // console.log("Monto de la cuenta: $" + cuenta);
  // console.log("Propina (" + porcentaje + "%): $" + propina);
  // console.log("Total a pagar: $" + total);
  return [
    { key: 'Monto de la cuenta', value: formatearMoneda(cuenta)   },
    { key: `Propina (${porcentaje}%)`, value: formatearMoneda(propina) },
    { key: 'Total a pagar',      value: formatearMoneda(total)    },
  ];
}

/* ============================================================
   MÓDULO DE UI – Patrón Módulo IIFE
   Encapsula estado y listeners sin contaminar el scope global
   ============================================================ */
const TipCalcUI = (() => {

  // ── Referencias DOM
  const $form    = document.getElementById('tipForm');
  const $monto   = document.getElementById('inputMonto');
  const $pct     = document.getElementById('inputPct');
  const $tipBtns = document.querySelectorAll('.tip-btn');
  const $results = document.getElementById('resultsPanel');
  const $console = document.getElementById('consoleSection');
  const $reset   = document.getElementById('btnReset');

  // ── Quotes de Pulp Fiction para animar el botón (Paso 5 – distintos valores)
  const QUOTES = [
    'Say "propina" again!',
    'Does he look like a 10%?',
    'Royale with tip.',
    'Check it before you wreck it.',
    'Zed\'s tip is dead, baby.',
  ];
  let quoteIdx = 0;

  /* ── init ────────────────────────────────────────────────── */
  function init() {
    $form.addEventListener('submit', onSubmit);
    $reset.addEventListener('click', onReset);

    $tipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        $pct.value = btn.dataset.value;
        $tipBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });

    $pct.addEventListener('input', () => {
      $tipBtns.forEach(b => b.classList.remove('is-active'));
    });

    // Rotar quotes en el botón
    const $btn = document.querySelector('.btn-primary');
    if ($btn) {
      setInterval(() => {
        if (!$results.classList.contains('is-visible')) {
          quoteIdx = (quoteIdx + 1) % QUOTES.length;
          $btn.textContent = QUOTES[quoteIdx];
          setTimeout(() => { $btn.textContent = 'Calcular propina'; }, 2000);
        }
      }, 5000);
    }
  }

  /* ── Validación ───────────────────────────────────────────── */
  function validar() {
    const cuenta  = parseFloat($monto.value);
    const pct     = parseFloat($pct.value);
    let ok = true;

    if (isNaN(cuenta) || cuenta <= 0) {
      sacudir($monto.closest('.input-wrap'));
      ok = false;
    }
    if (isNaN(pct) || pct < 0 || pct > 100) {
      sacudir($pct.closest('.input-wrap'));
      ok = false;
    }
    if (!ok) return null;
    return { cuenta, pct };
  }

  function sacudir(el) {
    if (!el) return;
    el.classList.add('is-error');
    el.addEventListener('animationend', () => el.classList.remove('is-error'), { once: true });
  }

  /* ── Submit ───────────────────────────────────────────────── */
  function onSubmit(e) {
    e.preventDefault();
    const datos = validar();
    if (!datos) return;

    const { cuenta, pct } = datos;

    // ← Funciones del ejercicio
    const propina = calcularPropina(cuenta, pct);
    const total   = calcularTotal(cuenta, propina);

    // Output en consola del navegador (F12) – Paso 4
    const lineas = generarOutputConsola(cuenta, pct);
    lineas.forEach(l => console.log(`%c${l.key}: %c${l.value}`,
      'color:#c8622a', 'color:#f5d000; font-weight:bold'));

    renderResultados(cuenta, pct, propina, total, lineas);
  }

  /* ── Render ───────────────────────────────────────────────── */
  function renderResultados(cuenta, pct, propina, total, lineas) {
    document.getElementById('resBase').textContent    = formatearMoneda(cuenta);
    document.getElementById('resPct').textContent     = `${pct}%`;
    document.getElementById('resPropina').textContent = formatearMoneda(propina);
    document.getElementById('resTotal').textContent   = formatearMoneda(total);

    $results.classList.add('is-visible');

    // Terminal visual
    const $out = document.getElementById('consoleOut');
    $out.innerHTML = '';
    lineas.forEach(({ key, value }, i) => {
      const d = document.createElement('div');
      d.className = 'console-line';
      d.style.animationDelay = `${i * 0.12}s`;
      d.innerHTML = `<span class="ck">${key}</span><span class="cs">: </span><span class="cv">${value}</span>`;
      $out.appendChild(d);
    });

    $console.classList.add('is-visible');
    $results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ── Reset ────────────────────────────────────────────────── */
  function onReset() {
    $form.reset();
    $tipBtns.forEach(b => b.classList.remove('is-active'));
    $results.classList.remove('is-visible');
    $console.classList.remove('is-visible');
    $monto.focus();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', TipCalcUI.init);

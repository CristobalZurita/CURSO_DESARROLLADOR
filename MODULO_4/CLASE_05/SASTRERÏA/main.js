/**
 * main.js — Hilo & Oficio
 * -------------------------------------------------------
 * 1. Navbar scroll + hamburger
 * 2. Fade-up intersection observer
 * 3. Catalog filter
 * 4. Skin guide hover
 * 5. STEPPER CLIENT — buscar sastre (10 pasos)
 * 6. STEPPER WORKER — postular a la tienda (11 pasos)
 * 7. Toast notifications
 * 8. Scroll-to-top
 * 9. Smooth anchor scroll
 */

'use strict';

// ============================================================
// 1. NAVBAR
// ============================================================
(function initNav() {
  const nav       = document.getElementById('nav');
  const burger    = document.getElementById('burger');
  const drawer    = document.getElementById('drawer');
  const drawerClose = document.getElementById('drawer-close');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('nav--scrolled', window.scrollY > 60);
  }, { passive: true });

  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    drawer?.classList.toggle('open');
    document.body.style.overflow = drawer?.classList.contains('open') ? 'hidden' : '';
  });

  function closeDrawer() {
    burger?.classList.remove('open');
    drawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  drawerClose?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
})();

// ============================================================
// 2. FADE-UP OBSERVER
// ============================================================
(function initFade() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
})();

// ============================================================
// 3. CATALOG FILTER
// ============================================================
(function initCatalog() {
  const btns  = document.querySelectorAll('.sec-catalog__filter-btn');
  const cards = document.querySelectorAll('.fabric-card');

  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => {
      const match = f === 'all' || c.dataset.type === f;
      c.style.opacity   = match ? '1'    : '0.25';
      c.style.transform = match ? ''     : 'scale(0.96)';
      c.style.pointerEvents = match ? '' : 'none';
      c.style.transition = 'opacity .3s, transform .3s';
    });
  }));
})();

// ============================================================
// 4. SKIN GUIDE HOVER
// ============================================================
(function initSkin() {
  const cards = document.querySelectorAll('.skin-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () =>
      cards.forEach(c => { if (c !== card) { c.style.opacity = '.55'; c.style.transform = 'scale(.97)'; c.style.transition = 'all .25s'; } })
    );
    card.addEventListener('mouseleave', () =>
      cards.forEach(c => { c.style.opacity = ''; c.style.transform = ''; })
    );
  });
})();

// ============================================================
// 5 & 6. STEPPER FACTORY
// ============================================================
function createStepper(config) {
  const {
    flowId,       // id del div.stepper__flow
    totalSteps,   // número de pasos
    formData,     // objeto vacío para acumular datos
    validators,   // { 1: fn, 2: fn, ... } → cada fn(data) retorna [] si ok o [{id,msg}]
    collectors,   // { 1: fn, 2: fn, ... } → cada fn() llena formData
    resultId,     // id del div.stepper__done
    wrapperId,    // id del div que contiene el form
    summaryId,    // id donde se inyecta el resumen
    toastOk,      // mensaje de éxito
  } = config;

  const flow    = document.getElementById(flowId);
  if (!flow) return;

  const barFill   = flow.querySelector('.stepper__bar-fill');
  const barText   = flow.querySelector('.stepper__progress-row span');
  const barPct    = flow.querySelector('.stepper__progress-row strong');
  const dots      = flow.querySelectorAll('.stepper__dots button');
  const wrapper   = document.getElementById(wrapperId);
  const resultEl  = document.getElementById(resultId);

  let current = 1;

  function pct() { return Math.round(((current - 1) / totalSteps) * 100); }

  function updateUI() {
    const p = pct();
    if (barFill)  barFill.style.width = p + '%';
    if (barText)  barText.textContent  = `Paso ${current} de ${totalSteps}`;
    if (barPct)   barPct.textContent   = p + '% completado';

    dots.forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i + 1 < current)       d.classList.add('done');
      else if (i + 1 === current) d.classList.add('active');
    });
  }

  function goTo(n) {
    flow.querySelectorAll('.stepper__step').forEach(s => s.classList.remove('active'));
    const target = flow.querySelector(`.stepper__step[data-step="${n}"]`);
    if (target) target.classList.add('active');
    current = n;
    updateUI();
    const sec = document.getElementById('form-section');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validate(step) {
    const fn = validators[step];
    const col = collectors[step];
    if (col) col();
    if (!fn) return [];
    return fn(formData);
  }

  function markErrors(errors) {
    flow.querySelectorAll('.stepper__field.error').forEach(f => f.classList.remove('error'));
    flow.querySelectorAll('.group-err').forEach(e => e.remove());

    errors.forEach(({ id, msg }) => {
      const el = document.getElementById(id);
      if (el) {
        const field = el.closest('.stepper__field');
        if (field) {
          field.classList.add('error');
          const errSpan = field.querySelector('.err');
          if (errSpan) errSpan.textContent = msg;
        }
      } else {
        const grp = flow.querySelector(`[data-group="${id}"]`);
        if (grp) {
          const p = document.createElement('p');
          p.className = 'group-err';
          p.textContent = '⚠ ' + msg;
          grp.after(p);
        }
      }
    });
  }

  // Click delegation
  flow.addEventListener('click', e => {
    const nextBtn = e.target.closest('[data-next]');
    const prevBtn = e.target.closest('[data-prev]');
    const subBtn  = e.target.closest('[data-submit]');

    if (nextBtn) {
      const errs = validate(current);
      if (errs.length) { markErrors(errs); showToast('Completa los campos requeridos.', 'err'); return; }
      if (current < totalSteps) goTo(current + 1);
    }

    if (prevBtn && current > 1) goTo(current - 1);

    if (subBtn) {
      const errs = validate(current);
      if (errs.length) { markErrors(errs); showToast('Completa los campos requeridos.', 'err'); return; }
      submitFlow(subBtn);
    }
  });

  function submitFlow(btn) {
    btn.classList.add('btn--loading'); btn.disabled = true;
    setTimeout(() => {
      if (wrapper)  wrapper.style.display = 'none';
      if (resultEl) resultEl.classList.add('show');
      populateSummary();
      // 100% progress
      if (barFill) barFill.style.width = '100%';
      if (barPct)  barPct.textContent  = '100% completado';
      dots.forEach(d => d.classList.replace('active', 'done') || d.classList.add('done'));
      showToast(toastOk, 'ok');
    }, 1800);
  }

  function populateSummary() {
    const el = document.getElementById(summaryId);
    if (!el) return;
    el.innerHTML = Object.entries(formData)
      .filter(([, v]) => v && String(v).trim())
      .map(([k, v]) => `<div class="stepper__summary-row"><span class="k">${k}</span><span class="val">${Array.isArray(v) ? v.join(', ') : v}</span></div>`)
      .join('');
  }

  updateUI();
}

// ============================================================
// 5. STEPPER CLIENTE — buscar sastre (10 pasos)
// ============================================================
const clientData = {};

createStepper({
  flowId: 'flow-client',
  totalSteps: 10,
  formData: clientData,
  wrapperId: 'client-form-wrap',
  resultId:  'client-done',
  summaryId: 'client-summary',
  toastOk:   '¡Tu solicitud fue enviada! Te contactaremos pronto.',

  collectors: {
    1: () => {
      clientData['Nombre']  = v('cl-nombre') + ' ' + v('cl-apellido');
      clientData['Correo']  = v('cl-correo');
      clientData['Teléfono']= v('cl-tel');
    },
    2: () => {
      clientData['Región']  = v('cl-region');
      clientData['Ciudad']  = v('cl-ciudad');
    },
    3: () => { clientData['Tipo de prenda'] = radioVal('cl-tipo'); },
    4: () => { clientData['Ocasión']        = radioVal('cl-ocasion'); },
    5: () => {
      clientData['Telas preferidas'] = checkVals('cl-tela');
    },
    6: () => { clientData['Tono de piel'] = radioVal('cl-tono'); },
    7: () => { clientData['Presupuesto']  = '$' + parseInt(v('cl-presupuesto')).toLocaleString('es-CL') + ' CLP'; },
    8: () => { clientData['Plazo'] = radioVal('cl-plazo'); },
    9: () => { clientData['Disponibilidad'] = radioVal('cl-disponibilidad'); },
    10:() => { clientData['Descripción del proyecto'] = v('cl-descripcion'); clientData['Referencia visual'] = v('cl-referencia'); },
  },

  validators: {
    1: () => {
      const errs = [];
      if (!v('cl-nombre'))  errs.push({ id: 'cl-nombre',  msg: 'Nombre obligatorio.' });
      if (!v('cl-apellido'))errs.push({ id: 'cl-apellido',msg: 'Apellido obligatorio.' });
      if (!v('cl-correo') || !v('cl-correo').includes('@')) errs.push({ id: 'cl-correo', msg: 'Correo inválido.' });
      if (!v('cl-tel'))     errs.push({ id: 'cl-tel',     msg: 'Teléfono obligatorio.' });
      return errs;
    },
    2: () => {
      const errs = [];
      if (!v('cl-region')) errs.push({ id: 'cl-region', msg: 'Selecciona una región.' });
      if (!v('cl-ciudad')) errs.push({ id: 'cl-ciudad', msg: 'Ingresa tu ciudad.' });
      return errs;
    },
    3: () => !radioVal('cl-tipo')       ? [{ id: 'g-tipo',   msg: 'Elige el tipo de prenda.' }]   : [],
    4: () => !radioVal('cl-ocasion')    ? [{ id: 'g-ocasion',msg: 'Indica la ocasión.' }]          : [],
    5: () => !checkVals('cl-tela').length? [{ id: 'g-tela',  msg: 'Selecciona al menos una tela.' }]: [],
    6: () => !radioVal('cl-tono')       ? [{ id: 'g-tono',   msg: 'Elige tu tono de piel.' }]     : [],
    8: () => !radioVal('cl-plazo')      ? [{ id: 'g-plazo',  msg: 'Indica el plazo.' }]            : [],
    9: () => !radioVal('cl-disponibilidad') ? [{ id: 'g-disp', msg: 'Indica tu disponibilidad.' }] : [],
    10:() => {
      const desc = v('cl-descripcion');
      if (!desc || desc.length < 20) return [{ id: 'cl-descripcion', msg: 'Mínimo 20 caracteres.' }];
      return [];
    },
  },
});

// ============================================================
// 6. STEPPER POSTULANTE — trabajar en la tienda (11 pasos)
// ============================================================
const workerData = {};

createStepper({
  flowId: 'flow-worker',
  totalSteps: 11,
  formData: workerData,
  wrapperId: 'worker-form-wrap',
  resultId:  'worker-done',
  summaryId: 'worker-summary',
  toastOk:   '¡Postulación enviada con éxito! Nos contactaremos en 3-5 días hábiles.',

  collectors: {
    1:  () => { workerData['Nombre'] = v('wk-nombre') + ' ' + v('wk-apellido'); workerData['RUT'] = v('wk-rut'); workerData['Correo'] = v('wk-correo'); workerData['Teléfono'] = v('wk-tel'); },
    2:  () => { workerData['Fecha nac.'] = v('wk-fnac'); workerData['Género'] = v('wk-genero'); workerData['Nacionalidad'] = v('wk-nac'); },
    3:  () => { workerData['Región'] = v('wk-region'); workerData['Ciudad'] = v('wk-ciudad'); workerData['Dirección'] = v('wk-dir'); },
    4:  () => { workerData['Cargo'] = radioVal('wk-cargo'); },
    5:  () => { workerData['Nivel educacional'] = radioVal('wk-edu'); workerData['Institución'] = v('wk-inst'); },
    6:  () => { workerData['Experiencia'] = radioVal('wk-exp'); },
    7:  () => { workerData['Especialidades'] = checkVals('wk-esp'); },
    8:  () => { workerData['Disponibilidad'] = radioVal('wk-disp'); workerData['Modalidad'] = radioVal('wk-modal'); },
    9:  () => { workerData['Expectativa salarial'] = '$' + parseInt(v('wk-salario')).toLocaleString('es-CL') + ' / mes'; },
    10: () => { workerData['Motivación'] = v('wk-motiv'); workerData['Portafolio/LinkedIn'] = v('wk-link'); },
    11: () => { workerData['Referencias'] = v('wk-ref'); },
  },

  validators: {
    1: () => {
      const e = [];
      if (!v('wk-nombre'))   e.push({ id: 'wk-nombre',   msg: 'Nombre obligatorio.' });
      if (!v('wk-apellido')) e.push({ id: 'wk-apellido', msg: 'Apellido obligatorio.' });
      if (!v('wk-rut') || v('wk-rut').length < 8) e.push({ id: 'wk-rut', msg: 'RUT inválido.' });
      if (!v('wk-correo') || !v('wk-correo').includes('@')) e.push({ id: 'wk-correo', msg: 'Correo inválido.' });
      if (!v('wk-tel'))      e.push({ id: 'wk-tel',      msg: 'Teléfono obligatorio.' });
      return e;
    },
    2: () => {
      const e = [];
      if (!v('wk-fnac'))   e.push({ id: 'wk-fnac',   msg: 'Fecha de nacimiento obligatoria.' });
      if (!v('wk-genero')) e.push({ id: 'wk-genero', msg: 'Selecciona una opción.' });
      return e;
    },
    3: () => {
      const e = [];
      if (!v('wk-region')) e.push({ id: 'wk-region', msg: 'Selecciona tu región.' });
      if (!v('wk-ciudad')) e.push({ id: 'wk-ciudad', msg: 'Ingresa tu ciudad.' });
      return e;
    },
    4:  () => !radioVal('wk-cargo') ? [{ id: 'g-wk-cargo', msg: 'Selecciona el cargo.' }] : [],
    5:  () => !radioVal('wk-edu')   ? [{ id: 'g-wk-edu',   msg: 'Selecciona tu nivel educacional.' }] : [],
    6:  () => !radioVal('wk-exp')   ? [{ id: 'g-wk-exp',   msg: 'Indica tu experiencia.' }] : [],
    7:  () => !checkVals('wk-esp').length ? [{ id: 'g-wk-esp', msg: 'Selecciona al menos una especialidad.' }] : [],
    8:  () => {
      const e = [];
      if (!radioVal('wk-disp'))  e.push({ id: 'g-wk-disp',  msg: 'Indica tu disponibilidad.' });
      if (!radioVal('wk-modal')) e.push({ id: 'g-wk-modal', msg: 'Indica la modalidad.' });
      return e;
    },
    10: () => {
      const txt = v('wk-motiv');
      return (!txt || txt.length < 40) ? [{ id: 'wk-motiv', msg: 'Cuéntanos un poco más (mínimo 40 caracteres).' }] : [];
    },
  },
});

// ---- Range sliders ----
function initRange(inputId, displayId, prefix = '$', suffix = '') {
  const input   = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (!input || !display) return;
  const fmt = val => prefix + parseInt(val).toLocaleString('es-CL') + suffix;
  display.textContent = fmt(input.value);
  input.addEventListener('input', () => { display.textContent = fmt(input.value); });
}
initRange('cl-presupuesto', 'cl-pres-display');
initRange('wk-salario',     'wk-sal-display');

// ---- FLOW TABS ----
document.querySelectorAll('.flow-tabs__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.flow-tabs__btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.flow;
    document.querySelectorAll('.stepper__flow').forEach(f => f.classList.remove('active'));
    document.getElementById('flow-' + target)?.classList.add('active');
  });
});

// ============================================================
// 7. TOAST
// ============================================================
function showToast(msg, type = 'inf') {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  const ico = { ok: '✅', err: '⚠️', inf: '🧵' };
  t.innerHTML = `<span class="toast__ico">${ico[type] || '•'}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4000);
}
window.showToast = showToast;

// ============================================================
// 8. SCROLL TOP
// ============================================================
(function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('on', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ============================================================
// 9. SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const tgt = document.querySelector(a.getAttribute('href'));
    if (tgt) { e.preventDefault(); tgt.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ============================================================
// HELPERS
// ============================================================
function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function radioVal(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
}
function checkVals(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(e => e.value);
}

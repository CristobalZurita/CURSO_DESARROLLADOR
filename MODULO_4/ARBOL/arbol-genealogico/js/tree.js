// ============================================
// tree.js — Árbol Genealógico Interactivo
// ============================================

window.FamilyTree = (() => {

  // ---- Estado del árbol ----
  let state = {
    usuario: { nombre: '', edad: 0, anioNacimiento: 0 },
    nodos: {},        // { id: { id, nombre, edad, relacion, tipo, hijos:[], padres:[] } }
    totalParientes: 0,
  };

  // Tipos de relación con metadata
  const TIPOS = {
    'yo':        { clase: 'yo',        icon: '🌳', gen: 0  },
    'Padre':     { clase: 'padre',     icon: '👨', gen: -1 },
    'Madre':     { clase: 'padre',     icon: '👩', gen: -1 },
    'Abuelo':    { clase: 'abuelo',    icon: '👴', gen: -2 },
    'Abuela':    { clase: 'abuelo',    icon: '👵', gen: -2 },
    'Bisabuelo': { clase: 'bisabuelo', icon: '🧓', gen: -3 },
    'Bisabuela': { clase: 'bisabuelo', icon: '👴', gen: -3 },
    'Hijo':      { clase: 'hijo',      icon: '👦', gen:  1 },
    'Hija':      { clase: 'hijo',      icon: '👧', gen:  1 },
    'Nieto':     { clase: 'nieto',     icon: '🧒', gen:  2 },
    'Nieta':     { clase: 'nieto',     icon: '🧒', gen:  2 },
    'Bisnieto':  { clase: 'bisnieto',  icon: '👶', gen:  3 },
    'Bisnieta':  { clase: 'bisnieto',  icon: '👶', gen:  3 },
    'Hermano':   { clase: 'hijo',      icon: '🧑', gen:  0 },
    'Hermana':   { clase: 'hijo',      icon: '🧑', gen:  0 },
  };

  // Qué relaciones puede añadir cada tipo de nodo
  const RELACIONES_DISPONIBLES = {
    'yo':        ['Padre', 'Madre', 'Hijo', 'Hija', 'Hermano', 'Hermana'],
    'Padre':     ['Abuelo', 'Abuela'],
    'Madre':     ['Abuelo', 'Abuela'],
    'Abuelo':    ['Bisabuelo', 'Bisabuela'],
    'Abuela':    ['Bisabuelo', 'Bisabuela'],
    'Bisabuelo': [],
    'Bisabuela': [],
    'Hijo':      ['Nieto', 'Nieta'],
    'Hija':      ['Nieto', 'Nieta'],
    'Hermano':   [],
    'Hermana':   [],
    'Nieto':     ['Bisnieto', 'Bisnieta'],
    'Nieta':     ['Bisnieto', 'Bisnieta'],
    'Bisnieto':  [],
    'Bisnieta':  [],
  };

  // ---- Inicializar árbol con usuario raíz ----
  function init(nombre, edad, anioNacimiento) {
    state.usuario = { nombre, edad, anioNacimiento };
    state.nodos = {};
    state.totalParientes = 0;

    const nodoYo = {
      id: 'yo',
      nombre,
      edad,
      relacion: 'yo',
      tipo: 'yo',
      hijos: [],  // referencias a IDs hijos directos
    };

    state.nodos['yo'] = nodoYo;
    renderTree();
    actualizarStats();
    guardarEnStorage();
  }

  // ---- Añadir nodo al árbol ----
  function addNodo(parentId, nombre, edad, relacion) {
    const id = `node_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    const nodo = { id, nombre, edad, relacion, tipo: relacion, hijos: [] };

    state.nodos[id] = nodo;

    // Registrar en el padre
    const parent = state.nodos[parentId];
    if (parent) parent.hijos.push(id);

    state.totalParientes++;
    renderTree();
    actualizarStats();
    guardarEnStorage();

    return id;
  }

  // ---- Renderizado del árbol ----
  function renderTree() {
    const container = document.getElementById('tree-container');
    if (!container) return;
    container.innerHTML = '';

    // Renderizar árbol completo desde raíz "yo"
    const treeEl = buildSubtree('yo', true);
    container.appendChild(treeEl);
  }

  /**
   * Construye el árbol completo de forma recursiva
   * Separa ancestros (padres, abuelos, bisabuelos) arriba
   * y descendentes (hijos, nietos, bisnietos) abajo
   */
  function buildSubtree(nodeId, isRoot = false) {
    const nodo = state.nodos[nodeId];
    if (!nodo) return document.createElement('div');

    const tipoMeta = TIPOS[nodo.tipo] || TIPOS['yo'];
    const claseTipo = tipoMeta.clase;

    // Clasificar hijos por dirección
    const hijosAscendentes  = nodo.hijos.filter(id => {
      const h = state.nodos[id];
      return h && ['Padre','Madre','Abuelo','Abuela','Bisabuelo','Bisabuela'].includes(h.tipo);
    });
    const hijosDescendentes = nodo.hijos.filter(id => {
      const h = state.nodos[id];
      return h && ['Hijo','Hija','Nieto','Nieta','Bisnieto','Bisnieta','Hermano','Hermana'].includes(h.tipo);
    });

    // Wrapper principal del subtree
    const wrapper = document.createElement('div');
    wrapper.className = 'subtree';
    wrapper.dataset.nodeId = nodeId;

    // --- SECCIÓN ASCENDENTES ---
    if (hijosAscendentes.length > 0) {
      const ancestorsEl = document.createElement('div');
      ancestorsEl.className = 'siblings-row';

      hijosAscendentes.forEach(id => {
        const childSubtree = buildSubtreeAscendente(id);
        ancestorsEl.appendChild(childSubtree);
      });

      wrapper.appendChild(ancestorsEl);

      const vConUp = document.createElement('div');
      vConUp.className = 'v-connector v-connector--up';
      wrapper.appendChild(vConUp);
    }

    // --- NODO ACTUAL ---
    const nodeCard = createNodeCard(nodo, claseTipo);
    wrapper.appendChild(nodeCard);

    // --- SECCIÓN DESCENDENTES ---
    if (hijosDescendentes.length > 0) {
      const vConDown = document.createElement('div');
      vConDown.className = 'v-connector v-connector--down';
      wrapper.appendChild(vConDown);

      const descRow = document.createElement('div');
      descRow.className = 'siblings-row';

      hijosDescendentes.forEach(id => {
        const childSubtree = buildSubtreeDescendente(id);
        descRow.appendChild(childSubtree);
      });

      wrapper.appendChild(descRow);
    }

    // Botones de añadir parientes (solo si hay relaciones disponibles)
    const relDisp = RELACIONES_DISPONIBLES[nodo.tipo] || [];
    if (relDisp.length > 0) {
      const addRow = document.createElement('div');
      addRow.className = 'node-add-row';
      addRow.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:8px;';

      relDisp.forEach(rel => {
        // Evitar duplicados (ej: solo 1 padre, 1 madre para "yo")
        const yaExiste = nodo.hijos.some(id => state.nodos[id] && state.nodos[id].tipo === rel);
        if (yaExiste && ['Padre','Madre','Abuelo','Abuela','Bisabuelo','Bisabuela'].includes(rel)) return;

        const btn = document.createElement('button');
        btn.className = 'node-card__add-btn';
        const metaRel = TIPOS[rel];
        btn.textContent = `+ ${rel}`;
        btn.title = `Añadir ${rel} de ${nodo.nombre}`;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.AppUI.openModal(nodeId, nodo, rel);
        });
        addRow.appendChild(btn);
      });

      if (addRow.children.length > 0) {
        wrapper.appendChild(addRow);
      }
    }

    return wrapper;
  }

  function buildSubtreeAscendente(nodeId) {
    const nodo = state.nodos[nodeId];
    if (!nodo) return document.createElement('div');

    const tipoMeta = TIPOS[nodo.tipo] || {};
    const claseTipo = tipoMeta.clase || 'padre';

    const wrapper = document.createElement('div');
    wrapper.className = 'subtree';
    wrapper.dataset.nodeId = nodeId;

    // Sub-ascendentes
    if (nodo.hijos && nodo.hijos.length > 0) {
      const row = document.createElement('div');
      row.className = 'siblings-row';
      nodo.hijos.forEach(id => {
        row.appendChild(buildSubtreeAscendente(id));
      });
      wrapper.appendChild(row);

      const vcon = document.createElement('div');
      vcon.className = 'v-connector v-connector--up';
      wrapper.appendChild(vcon);
    }

    const card = createNodeCard(nodo, claseTipo);
    wrapper.appendChild(card);

    // Botones añadir
    const relDisp = RELACIONES_DISPONIBLES[nodo.tipo] || [];
    if (relDisp.length > 0) {
      const addRow = document.createElement('div');
      addRow.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-top:6px;';
      relDisp.forEach(rel => {
        const yaExiste = nodo.hijos.some(id => state.nodos[id] && state.nodos[id].tipo === rel);
        if (yaExiste) return;
        const btn = document.createElement('button');
        btn.className = 'node-card__add-btn';
        btn.textContent = `+ ${rel}`;
        btn.addEventListener('click', e => {
          e.stopPropagation();
          window.AppUI.openModal(nodeId, nodo, rel);
        });
        addRow.appendChild(btn);
      });
      if (addRow.children.length > 0) wrapper.appendChild(addRow);
    }

    return wrapper;
  }

  function buildSubtreeDescendente(nodeId) {
    const nodo = state.nodos[nodeId];
    if (!nodo) return document.createElement('div');

    const tipoMeta = TIPOS[nodo.tipo] || {};
    const claseTipo = tipoMeta.clase || 'hijo';

    const wrapper = document.createElement('div');
    wrapper.className = 'subtree';
    wrapper.dataset.nodeId = nodeId;

    const card = createNodeCard(nodo, claseTipo);
    wrapper.appendChild(card);

    if (nodo.hijos && nodo.hijos.length > 0) {
      const vcon = document.createElement('div');
      vcon.className = 'v-connector v-connector--down';
      wrapper.appendChild(vcon);

      const row = document.createElement('div');
      row.className = 'siblings-row';
      nodo.hijos.forEach(id => {
        row.appendChild(buildSubtreeDescendente(id));
      });
      wrapper.appendChild(row);
    }

    // Botones añadir
    const relDisp = RELACIONES_DISPONIBLES[nodo.tipo] || [];
    if (relDisp.length > 0) {
      const addRow = document.createElement('div');
      addRow.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-top:6px;';
      relDisp.forEach(rel => {
        const btn = document.createElement('button');
        btn.className = 'node-card__add-btn';
        btn.textContent = `+ ${rel}`;
        btn.addEventListener('click', e => {
          e.stopPropagation();
          window.AppUI.openModal(nodeId, nodo, rel);
        });
        addRow.appendChild(btn);
      });
      if (addRow.children.length > 0) wrapper.appendChild(addRow);
    }

    return wrapper;
  }

  // ---- Crear card de nodo ----
  function createNodeCard(nodo, claseTipo) {
    const tipoMeta = TIPOS[nodo.tipo] || TIPOS['yo'];
    const anioNac  = 2025 - nodo.edad;

    const card = document.createElement('div');
    card.className = `node-card node-card--${claseTipo}`;
    card.dataset.id = nodo.id;

    card.innerHTML = `
      <span class="node-card__relation">${nodo.relacion === 'yo' ? '★ Yo' : nodo.relacion}</span>
      <div class="node-card__name">${tipoMeta.icon} ${nodo.nombre}</div>
      <span class="node-card__age">${nodo.edad} años · ${anioNac}</span>
    `;

    return card;
  }

  // ---- Actualizar estadísticas ----
  function actualizarStats() {
    const statEl = document.getElementById('stat-total');
    if (statEl) statEl.textContent = state.totalParientes;
  }

  // ---- Persistencia localStorage ----
  function guardarEnStorage() {
    try {
      localStorage.setItem('raices_tree', JSON.stringify(state));
    } catch(e) { /* silent */ }
  }

  function cargarDeStorage() {
    try {
      const saved = localStorage.getItem('raices_tree');
      if (saved) {
        state = JSON.parse(saved);
        return true;
      }
    } catch(e) { /* silent */ }
    return false;
  }

  function resetTree() {
    state = { usuario: { nombre: '', edad: 0, anioNacimiento: 0 }, nodos: {}, totalParientes: 0 };
    localStorage.removeItem('raices_tree');
  }

  function getState() { return state; }

  return { init, addNodo, renderTree, cargarDeStorage, resetTree, getState, TIPOS, RELACIONES_DISPONIBLES };

})();

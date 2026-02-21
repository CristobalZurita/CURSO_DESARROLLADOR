#!/usr/bin/env bash
# ================================================================
# setup-raices.sh
# Crea toda la estructura del proyecto "Raíces - Árbol Genealógico"
# con arquitectura Sass 7-1
# ================================================================
# USO: bash setup-raices.sh [nombre-carpeta]
# ================================================================

set -e

PROJECT="${1:-arbol-genealogico}"
echo ""
echo "🌳  Creando proyecto: $PROJECT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Crear estructura de directorios ──────────────────────────
mkdir -p "$PROJECT"/{scss/{abstracts,base,components,layout,pages,themes,vendors},js,css,assets}

echo "✓ Estructura de carpetas creada (Sass 7-1)"

# ── 2. Copiar/crear archivos del proyecto ───────────────────────
# (Los archivos ya estarán en el zip descargado. Este script
#  recrea la estructura vacía con los archivos placeholder si
#  se ejecuta solo.)

# main.scss - punto de entrada
cat > "$PROJECT/scss/main.scss" << 'SCSS'
// ============================================================
// MAIN.SCSS — Punto de entrada Sass 7-1
// ============================================================

// 1. ABSTRACTS
@use 'abstracts/variables' as *;
@use 'abstracts/functions' as *;
@use 'abstracts/mixins' as *;

// 2. VENDORS
@use 'vendors/normalize';

// 3. BASE
@use 'base/reset';
@use 'base/typography';
@use 'base/animations';

// 4. LAYOUT
@use 'layout/screens';
@use 'layout/header';

// 5. COMPONENTS
@use 'components/buttons';
@use 'components/forms';
@use 'components/tree-nodes';
@use 'components/modal';
@use 'components/toast';

// 6. PAGES
@use 'pages/welcome';
@use 'pages/tree';

// 7. THEMES
@use 'themes/organic';
SCSS

echo "✓ main.scss creado"

# ── 3. Instalar dependencias (sass) ─────────────────────────────
echo ""
echo "📦 Instalando sass..."
cd "$PROJECT"

if command -v npm &> /dev/null; then
    npm init -y --quiet > /dev/null 2>&1
    npm install sass --save-dev --quiet
    echo "✓ sass instalado"
else
    echo "⚠  npm no encontrado. Instala sass manualmente: npm install -g sass"
fi

# ── 4. Scripts package.json ──────────────────────────────────────
cat > package.json << 'JSON'
{
  "name": "raices-arbol-genealogico",
  "version": "1.0.0",
  "description": "Árbol genealógico interactivo con Sass 7-1",
  "scripts": {
    "sass": "sass scss/main.scss css/main.css --style=expanded --watch",
    "build": "sass scss/main.scss css/main.css --style=compressed",
    "dev": "sass scss/main.scss css/main.css --watch"
  },
  "devDependencies": {}
}
JSON

# Intento de compilación inicial
if [ -f "node_modules/.bin/sass" ]; then
    echo ""
    echo "🎨 Compilando Sass..."
    node_modules/.bin/sass scss/main.scss css/main.css --style=expanded 2>/dev/null && echo "✓ CSS compilado en css/main.css" || echo "⚠  Compilación pendiente (ejecuta: npm run build)"
fi

cd ..

# ── 5. Resumen final ─────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅  Proyecto creado en: ./$PROJECT/"
echo ""
echo "📁 Estructura:"
echo "   $PROJECT/"
echo "   ├── index.html"
echo "   ├── css/main.css          ← CSS compilado"
echo "   ├── scss/"
echo "   │   ├── main.scss         ← Punto de entrada"
echo "   │   ├── abstracts/        ← variables, mixins, functions"
echo "   │   ├── base/             ← reset, typography, animations"
echo "   │   ├── components/       ← buttons, forms, tree-nodes, modal, toast"
echo "   │   ├── layout/           ← screens, header"
echo "   │   ├── pages/            ← welcome, tree"
echo "   │   ├── themes/           ← organic"
echo "   │   └── vendors/          ← normalize"
echo "   └── js/"
echo "       ├── calculator.js     ← Reto: Calculador Personal"
echo "       ├── tree.js           ← Árbol genealógico"
echo "       └── app.js            ← Controlador principal SPA"
echo ""
echo "🚀 Comandos:"
echo "   cd $PROJECT"
echo "   npm run dev    ← Compilar Sass + watch"
echo "   npm run build  ← Build CSS minificado"
echo ""
echo "   Abre index.html en tu navegador 🌳"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

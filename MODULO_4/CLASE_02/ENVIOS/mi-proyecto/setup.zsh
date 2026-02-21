#!/usr/bin/env zsh
# =====================================================
# MarioShop — Project Setup Script (ZSH)
# Crea toda la estructura del proyecto en un comando
# =====================================================
# USO:
#   chmod +x setup.zsh && ./setup.zsh [nombre-proyecto]
# =====================================================

set -e

# ---- Color output (Mario colors!) ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RESET='\033[0m'
BOLD='\033[1m'

# ---- Project name ----
PROJECT="${1:-mario-store}"

echo ""
echo "${RED}  ╔══════════════════════════════════════╗${RESET}"
echo "${RED}  ║  ${YELLOW}🍄 MARIOSHOP — Project Generator 🍄  ${RED}║${RESET}"
echo "${RED}  ║  ${CYAN}SASS 7-1 Architecture • NES & SNES   ${RED}║${RESET}"
echo "${RED}  ╚══════════════════════════════════════╝${RESET}"
echo ""
echo "${GREEN}▶ Creando proyecto: ${BOLD}${PROJECT}${RESET}"
echo ""

# ---- Función para crear directorio con log ----
mkd() {
  mkdir -p "$1"
  echo "${CYAN}  📁 ${1}${RESET}"
}

# ---- Función para crear archivo con log ----
mkf() {
  touch "$1"
  echo "${YELLOW}  📄 ${1}${RESET}"
}

# ================================================
# ESTRUCTURA DE CARPETAS — ONE COMMAND VERSION
# ================================================
# Puedes ejecutar solo esta línea en cualquier terminal:
#
#   mkdir -p mario-store/{assets/{scss/{abstracts,base,components,layout,pages,themes,vendors},js,img/{sprites,products,bg}},docs,public}
#
# ================================================

echo "${GREEN}📂 Creando estructura de carpetas...${RESET}"
echo ""

# Root
mkd "${PROJECT}"
cd "${PROJECT}"

# Assets
mkd "assets/scss/abstracts"
mkd "assets/scss/base"
mkd "assets/scss/components"
mkd "assets/scss/layout"
mkd "assets/scss/pages"
mkd "assets/scss/themes"
mkd "assets/scss/vendors"
mkd "assets/js"
mkd "assets/img/sprites"
mkd "assets/img/products"
mkd "assets/img/bg"
mkd "assets/fonts"
mkd "docs"
mkd "public"

echo ""
echo "${GREEN}📄 Creando archivos SCSS (7-1 Architecture)...${RESET}"
echo ""

# ---- ABSTRACTS ----
mkf "assets/scss/abstracts/_variables.scss"
mkf "assets/scss/abstracts/_mixins.scss"
mkf "assets/scss/abstracts/_functions.scss"

# ---- BASE ----
mkf "assets/scss/base/_reset.scss"
mkf "assets/scss/base/_typography.scss"
mkf "assets/scss/base/_animations.scss"

# ---- COMPONENTS ----
mkf "assets/scss/components/_buttons.scss"
mkf "assets/scss/components/_cards.scss"
mkf "assets/scss/components/_cart.scss"
mkf "assets/scss/components/_badge.scss"
mkf "assets/scss/components/_toast.scss"

# ---- LAYOUT ----
mkf "assets/scss/layout/_header.scss"
mkf "assets/scss/layout/_hero.scss"
mkf "assets/scss/layout/_grid.scss"
mkf "assets/scss/layout/_footer.scss"

# ---- PAGES ----
mkf "assets/scss/pages/_home.scss"
mkf "assets/scss/pages/_shipping.scss"

# ---- THEMES ----
mkf "assets/scss/themes/_nes.scss"
mkf "assets/scss/themes/_snes.scss"

# ---- VENDORS ----
mkf "assets/scss/vendors/_normalize.scss"

# ---- MAIN ENTRY ----
mkf "assets/scss/main.scss"

echo ""
echo "${GREEN}📄 Creando archivos JS...${RESET}"
echo ""

mkf "assets/js/main.js"
mkf "assets/js/cart.js"
mkf "assets/js/pixel-art.js"
mkf "assets/js/parallax.js"

echo ""
echo "${GREEN}📄 Creando archivos raíz...${RESET}"
echo ""

mkf "index.html"
mkf "README.md"
mkf ".gitignore"
mkf "package.json"

# ---- Escribir .gitignore ----
cat > .gitignore << 'GITIGNORE'
node_modules/
.sass-cache/
*.css.map
dist/
.DS_Store
GITIGNORE

# ---- Escribir package.json ----
cat > package.json << 'PACKAGEJSON'
{
  "name": "mario-store",
  "version": "1.0.0",
  "description": "Nintendo NES & SNES fan-art store — SASS 7-1 Architecture",
  "scripts": {
    "sass:watch": "sass --watch assets/scss/main.scss:assets/css/main.css --style=expanded",
    "sass:build": "sass assets/scss/main.scss:assets/css/main.css --style=compressed",
    "dev":        "npx live-server . --port=3000 --open=index.html",
    "build":      "npm run sass:build"
  },
  "devDependencies": {
    "sass": "^1.70.0",
    "live-server": "^1.2.2"
  }
}
PACKAGEJSON

# ---- Escribir main SCSS ----
cat > assets/scss/main.scss << 'MAINSASS'
// =====================================================
// main.scss — MarioShop Entry Point
// SASS 7-1 Architecture
// =====================================================

// 1. Vendors
@use 'vendors/normalize';

// 2. Abstracts
@use 'abstracts/variables' as *;
@use 'abstracts/mixins'    as *;
@use 'abstracts/functions' as *;

// 3. Base
@use 'base/reset';
@use 'base/typography';
@use 'base/animations';

// 4. Layout
@use 'layout/header';
@use 'layout/hero';
@use 'layout/grid';
@use 'layout/footer';

// 5. Components
@use 'components/buttons';
@use 'components/cards';
@use 'components/cart';
@use 'components/badge';
@use 'components/toast';

// 6. Pages
@use 'pages/home';
@use 'pages/shipping';

// 7. Themes
@use 'themes/nes';
@use 'themes/snes';
MAINSASS

echo ""
echo "${GREEN}✅ Estructura completa creada!${RESET}"
echo ""
echo "${YELLOW}╔═══════════════════════════════════════╗${RESET}"
echo "${YELLOW}║  ESTRUCTURA CREADA:                   ║${RESET}"
echo "${YELLOW}╠═══════════════════════════════════════╣${RESET}"
echo "${YELLOW}║  ${RESET}${PROJECT}/                            ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}├── assets/                          ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   ├── scss/ (7-1 SASS)             ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   │   ├── abstracts/               ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   │   ├── base/                    ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   │   ├── components/              ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   │   ├── layout/                  ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   │   ├── pages/                   ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   │   ├── themes/                  ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   │   └── vendors/                 ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   ├── js/                          ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}│   └── img/                         ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}├── public/                          ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}├── docs/                            ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}├── index.html                       ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}├── package.json                     ${YELLOW}║${RESET}"
echo "${YELLOW}║  ${CYAN}└── README.md                        ${YELLOW}║${RESET}"
echo "${YELLOW}╚═══════════════════════════════════════╝${RESET}"
echo ""
echo "${GREEN}▶ PRÓXIMOS PASOS:${RESET}"
echo ""
echo "  ${CYAN}cd ${PROJECT}${RESET}"
echo "  ${CYAN}npm install${RESET}          # instalar SASS y live-server"
echo "  ${CYAN}npm run dev${RESET}          # servidor de desarrollo"
echo "  ${CYAN}npm run sass:watch${RESET}   # compilar SCSS en tiempo real"
echo ""
echo "${RED}  🍄 ¡IT'S-A ME, MARIO! Happy coding! 🍄${RESET}"
echo ""

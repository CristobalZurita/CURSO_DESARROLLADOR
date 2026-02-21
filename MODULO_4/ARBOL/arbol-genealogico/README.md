# 🌳 Raíces — Árbol Genealógico Interactivo

## ¿Cómo usar este proyecto?

### Opción 1: Descomprimir y abrir directo
Abre `index.html` en tu navegador. El CSS ya está compilado en `css/main.css`.

### Opción 2: Trabajar con Sass (recomendado)

```bash
# Instalar dependencias
npm install

# Compilar Sass una vez
npm run build

# Compilar con watch (auto-recompila al guardar)
npm run dev
```

---

## Arquitectura Sass 7-1

```
scss/
├── main.scss               ← Punto de entrada (importa todo)
├── abstracts/
│   ├── _variables.scss     ← Colores, tipografía, espaciados
│   ├── _functions.scss     ← Funciones utilitarias (rem, spacing)
│   └── _mixins.scss        ← Mixins reutilizables
├── base/
│   ├── _reset.scss         ← Reset CSS
│   ├── _typography.scss    ← Estilos tipográficos base
│   └── _animations.scss    ← Keyframes y clases de animación
├── components/
│   ├── _buttons.scss       ← Sistema de botones
│   ├── _forms.scss         ← Inputs y formularios
│   ├── _tree-nodes.scss    ← Nodos del árbol genealógico
│   ├── _modal.scss         ← Modal de añadir pariente
│   └── _toast.scss         ← Notificaciones toast
├── layout/
│   ├── _screens.scss       ← Sistema de pantallas SPA
│   └── _header.scss        ← Header del árbol
├── pages/
│   ├── _welcome.scss       ← Pantalla de bienvenida + calculador
│   └── _tree.scss          ← Pantalla del árbol
├── themes/
│   └── _organic.scss       ← Scrollbar, selección, temas
└── vendors/
    └── _normalize.scss     ← Placeholder librerías externas
```

---

## JavaScript — Módulos

### `js/calculator.js`
- **Reto: El Calculador Personal** integrado
- `calcularDatosPersona(edad, anio)` → año nacimiento, mayoría de edad, joven adulto
- `validarEdadParentesco(edadPariente, edadYo, relacion)` → valida lógicamente si la edad es coherente con el parentesco

### `js/tree.js`
- `FamilyTree.init(nombre, edad, anioNacimiento)` → inicializa árbol
- `FamilyTree.addNodo(parentId, nombre, edad, relacion)` → añade pariente con animación
- Persiste en `localStorage` automáticamente
- Generaciones soportadas: bisabuelos ↑ hasta bisnietos ↓

### `js/app.js`
- Controlador principal SPA
- Maneja navegación entre pantallas
- Modal de añadir pariente con validación en tiempo real
- Toast notifications

---

## Relaciones soportadas

| Desde | Puede añadir |
|-------|-------------|
| Yo | Padre, Madre, Hijo/a, Hermano/a |
| Padre / Madre | Abuelo/a |
| Abuelo / Abuela | Bisabuelo/a |
| Hijo / Hija | Nieto/a |
| Nieto / Nieta | Bisnieto/a |

---

## Validación lógica de edades (Calculador integrado)

El sistema valida automáticamente que las edades sean coherentes:
- **Padre/Madre**: debe ser mayor que yo (mínimo +13 años)
- **Abuelo/a**: mínimo +26 años
- **Bisabuelo/a**: mínimo +39 años
- **Hijo/a**: debe ser menor (mínimo -13 años)
- **Nieto/a**: debe ser menor que yo
- **Bisnieto/a**: probablemente menor de 18 (advertencia si no)

---

## Comando de terminal para generar la estructura desde cero

```bash
# Crear estructura completa con un comando
mkdir -p arbol-genealogico/{scss/{abstracts,base,components,layout,pages,themes,vendors},js,css,assets} && echo "✅ Estructura Sass 7-1 creada"
```

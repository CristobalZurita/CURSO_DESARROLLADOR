# 🏀 Torneo de Básquetbol — Registro de Jugadores
**Módulo 4 · Aprendizaje Esperado N°2**
*Explorando Variables, Expresiones y Sentencias Condicionales en JavaScript*

---

## Estructura del Proyecto

```
basketball/
├── index.html                  # Punto de entrada HTML
├── css/
│   └── main.css                # CSS compilado desde SASS 7-1
├── js/
│   └── app.js                  # Lógica JavaScript completa
├── scss/                       # Arquitectura SASS 7-1
│   ├── main.scss               # ← Punto de entrada SASS (importa todo)
│   │
│   ├── abstracts/              # 1. Herramientas sin output CSS
│   │   ├── _variables.scss     #    Paleta, tipografía, espaciado
│   │   ├── _mixins.scss        #    LED glow, board-panel, respond-to
│   │   └── _functions.scss     #    rem(), tint(), shade()
│   │
│   ├── vendors/                # 2. Librerías externas
│   │   └── _normalize.scss     #    Placeholder para vendors
│   │
│   ├── base/                   # 3. Reset y tipografía base
│   │   ├── _reset.scss
│   │   └── _typography.scss
│   │
│   ├── layout/                 # 4. Estructura de página
│   │   └── _main.scss          #    Grid, toasts, site-wrapper
│   │
│   ├── components/             # 5. Componentes reutilizables
│   │   ├── _buttons.scss       #    .btn--primary/secondary/ghost
│   │   ├── _form.scss          #    Formulario de registro
│   │   ├── _player-card.scss   #    Cards de jugadores + lista
│   │   ├── _scoreboard.scss    #    Header estilo tablero LED
│   │   └── _teams-modal.scss   #    Modal de equipos por categoría
│   │
│   ├── pages/                  # 6. Estilos por página
│   │   └── _home.scss          #    Page intro, animación just-added
│   │
│   └── themes/                 # 7. Variaciones temáticas
│       └── _basketball.scss    #    Court lines, pos-chips, footer
│
└── README.md
```

---

## Paleta de Colores

| Variable       | HEX       | Uso en la UI                          |
|----------------|-----------|---------------------------------------|
| `$color-orange`| `#fb3c19` | Acción principal, bordes, alertas     |
| `$color-salmon`| `#fcea74` | Numeración LED, badge adultos, ghost  |
| `$color-navy`  | `#043578` | Header, fondo nav, modal panels       |
| `$color-slate` | `#728aa5` | Bordes, separadores, texto secundario |
| `$color-steel` | `#98a4bc` | Labels, texto muted, íconos           |
| `$color-teal`  | `#42e3bd` | Border-top activo, categoría juvenil  |

---

## Lógica JavaScript

### Variables declaradas
```js
let jugadores = [];                   // Array de jugadores (string/number/object)
const POSICIONES_VALIDAS = [...]      // string[]
const REQUISITOS = { edadMinima: 16, edadAdulto: 18, alturaMinima: 160 }
```

### Validaciones (if-else)
- `validarNombre()` → tipo string, no vacío, 2–60 chars
- `validarEdad()` → número entero, ≥16, ≤65
- `validarAltura()` → número, 100–250 cm (registra igual con warning si <160)
- `validarPosicion()` → debe estar en POSICIONES_VALIDAS

### Clasificación por categoría
```js
function determinarCategoria(edad) {
  return edad >= 18 ? 'adulto' : 'juvenil';  // Condicional ternario
}
```

### Condiciones de borde manejadas
- Campo vacío → error específico por campo
- Edad fuera de rango → mensaje de rechazo
- Posición inexistente → error de selección
- Altura bajo recomendado → advertencia, se registra igual
- Lista vacía al limpiar → toast informativo
- Lista vacía al armar equipos → toast informativo

---

## Cómo usar

1. Abrir `index.html` en el navegador (o con Live Server)
2. Completar el formulario: nombre, edad, altura y posición
3. Hacer clic en **REGISTRAR JUGADOR**
4. La card del jugador aparece arriba en la lista con su estado
5. Repetir para agregar más jugadores
6. **ARMAR EQUIPOS** → abre modal con clasificación Adultos / Juveniles
7. **LIMPIAR LISTA** → borra todos los registros (pide confirmación)

### Para compilar el SASS
```bash
sass scss/main.scss css/main.css --style=expanded
# o en modo watch:
sass --watch scss/main.scss:css/main.css
```

---

## Tecnologías
- **HTML5** semántico con ARIA
- **SASS** arquitectura 7-1 (compilado a CSS)
- **JavaScript** ES6+ sin frameworks
- **Fuentes**: Orbitron · Rajdhani · Share Tech Mono (Google Fonts)

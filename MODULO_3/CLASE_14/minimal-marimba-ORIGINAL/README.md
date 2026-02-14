# Minimal Marimba - Resonancias Electronicas 2026

## 1. Descripcion
Micrositio promocional para el evento "Resonancias Electronicas 2026", enfocado en marimba contemporanea, experimentacion sonora y difusion de programa de concierto.

El proyecto esta construido como front-end estatico modular, con arquitectura Sass y componentes reutilizables.

## 2. Stack y enfoque tecnico
- HTML5 semantico
- Sass (estructura 7-1 con parciales por capa)
- CSS compilado en `css/main.css`
- JavaScript vanilla modular (`js/` + `js/modules/`)
- Bootstrap 4.6.2 via CDN (uso selectivo, integrado al sistema visual propio)

## 3. Funcionalidades implementadas
- Header fijo con navegacion desktop/mobile.
- Hero principal con CTA y animaciones.
- Seccion Concepto con layout editorial.
- Programa del concierto con tarjetas interactivas.
- Popup de repertorio por obra (biografia y reseña).
- Cronograma del evento.
- Seccion Artistas, Ubicacion, FAQ y Galeria.
- Lightbox para galeria.
- Popup de compra de tickets embebido (`tickets.html`).
- Panel de accesibilidad:
  - alto contraste
  - texto aumentado
  - foco visible
  - lectura por voz y controles flotantes
- Efectos visuales modulares (cursor custom, particulas, visualizador, arcos, etc.).

## 4. Seguridad aplicada (aditiva, no destructiva)
Se reforzaron puntos de superficie de ataque en JS y enlaces externos:

- Eliminacion de insercion HTML dinamica insegura en popup de repertorio:
  - ahora se renderiza con nodos DOM y `textContent`.
- Cursor custom sin `innerHTML` por string:
  - SVG construido con `createElementNS`.
- Hardening de enlaces `target="_blank"`:
  - `rel="noopener noreferrer"` en enlaces externos.
- Modulo `js/security-hardening.js`:
  - neutraliza protocolos peligrosos (`javascript:`, `vbscript:`, `data:text/html`).
  - refuerza dinamicamente enlaces inyectados.
  - bloqueo de menu contextual (clic derecho) como disuasivo basico, con excepcion en campos editables.

Nota: estas medidas reducen riesgo en cliente, pero no reemplazan seguridad de servidor.

## 5. Estructura de carpetas
```text
minimal-marimba-ORIGINAL/
├── index.html
├── tickets.html
├── README.md
├── CHECKLIST_ENTREGA.md
├── assets/
│   └── images/
├── css/
│   ├── main.css
│   └── main.css.map
├── js/
│   ├── main.js
│   ├── accessibility.js
│   ├── effects.js
│   ├── security-hardening.js
│   └── modules/
├── scss/
│   ├── abstracts/
│   ├── base/
│   ├── components/
│   ├── layout/
│   ├── pages/
│   ├── themes/
│   ├── utilities/
│   ├── vendors/
│   └── main.scss
└── compile_sass.py
```

## 6. Ejecucion local
### Opcion recomendada (Live Server en VS Code)
1. Abrir carpeta `minimal-marimba-ORIGINAL`.
2. Abrir `index.html`.
3. Ejecutar "Open with Live Server".

### Opcion simple con Python
```bash
cd MODULO_3/CLASE_14/minimal-marimba-ORIGINAL
python3 -m http.server 5500
```
Luego abrir:
- `http://127.0.0.1:5500/index.html`

## 7. Compilacion Sass
Compilar SCSS a CSS con Dart Sass:
```bash
cd MODULO_3/CLASE_14/minimal-marimba-ORIGINAL
npx sass scss/main.scss css/main.css
```

Validacion sin sobrescribir CSS final:
```bash
npx sass --no-source-map scss/main.scss /tmp/minimal-marimba-main.css
```

## 8. Checklist de cierre (resumen)
Resultado detallado en `CHECKLIST_ENTREGA.md`.

- JS: sintaxis valida.
- Sass: compila correctamente.
- Links internos por ancla: correctos.
- Rutas locales `src/href`: correctas.
- Enlaces externos `_blank`: endurecidos con `noopener noreferrer`.
- Debug inline removido de `index.html`.

## 9. Limitaciones conocidas y recomendacion de produccion
- El bloqueo de clic derecho es solo disuasivo.
- Para cierre de seguridad real en produccion, agregar headers de servidor:
  - Content-Security-Policy
  - Strict-Transport-Security
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
- Existen advertencias de deprecacion Sass por `lighten()`, recomendable migrar a `color.adjust` o `color.scale`.

## 10. Creditos
Proyecto desarrollado para evaluacion de modulo, con enfoque en buenas practicas de maquetacion modular, Sass y experiencia de usuario para evento cultural.

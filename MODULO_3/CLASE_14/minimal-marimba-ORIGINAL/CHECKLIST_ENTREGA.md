# Checklist de Entrega - Minimal Marimba

Fecha de validacion: 2026-02-14

## 1. Validaciones tecnicas ejecutadas

### 1.1 Sintaxis JavaScript
- Estado: OK
- Comando:
```bash
for f in js/*.js js/modules/*.js; do node --check "$f"; done
```

### 1.2 Compilacion Sass
- Estado: OK (compila)
- Comando:
```bash
npx --yes sass --no-source-map scss/main.scss /tmp/minimal-marimba-main.css
```
- Observacion:
  - Hay warning de deprecacion por `lighten()` en `scss/layout/_sections.scss:346`.
  - No bloquea compilacion.

### 1.3 Integridad de rutas locales en `index.html`
- Estado: OK
- Resultado: `LOCAL_ASSET_LINKS_OK`

### 1.4 Enlaces internos por ancla
- Estado: OK
- Resultado: `ANCHOR_LINKS_OK`

### 1.5 Hardening de enlaces externos
- Estado: OK
- Criterio:
  - Enlaces `target="_blank"` con `rel="noopener noreferrer"` aplicados.

### 1.6 Busqueda de patrones JS riesgosos
- Estado: OK en archivos criticos revisados
- Criterio:
  - Sin `eval`, `new Function`, `document.write`, `insertAdjacentHTML` en rutas revisadas.
  - `innerHTML` removido de los puntos criticos tratados.

## 2. Recomendaciones antes de entrega final

### 2.1 Pruebas manuales de interfaz (obligatorias)
- [ ] Desktop 1366px+:
  - nav, hero, programa, cronograma, FAQ, galeria, popups.
- [ ] Tablet:
  - menu mobile, tarjetas, popups con scroll interno.
- [ ] Mobile:
  - botonera flotante, panel accesibilidad, cierre de popups.

### 2.2 Pruebas funcionales
- [ ] Popup de repertorio abre/cierra con click y Escape.
- [ ] Popup de tickets abre/cierra correctamente.
- [ ] Voice controls habilitan/deshabilitan segun checkbox de accesibilidad.
- [ ] Lightbox de galeria (abrir, navegar, cerrar).

### 2.3 Produccion (si aplica deploy real)
- [ ] Configurar headers HTTP de seguridad en servidor:
  - CSP
  - HSTS
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy

## 3. Criterio de cierre
Si todos los checks automaticos estan en OK y las pruebas manuales no muestran regresiones visuales/funcionales, el proyecto esta listo para entrega academica.

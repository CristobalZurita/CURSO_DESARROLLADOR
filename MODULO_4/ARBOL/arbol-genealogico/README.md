# 🌳 Raíces — Árbol Genealógico Interactivo

Manual rápido del proyecto con fake-backend en `localStorage`, control de sesión y panel de administración.

## 1) Cómo ejecutar

### Opción rápida
Abre `index.html` en el navegador.

### Opción recomendada (Sass)
```bash
npm install
npm run build
# o
npm run dev
```

## 2) Acceso de usuarios (fake-backend)

El login está en la portada:
- Si el usuario **no existe**, se crea automáticamente.
- Si el usuario **existe**, valida contraseña.

Credenciales admin de demo:
- Usuario: `admin`
- Contraseña: `admin123`

## 3) Qué guarda el sistema

Se usa `localStorage` como backend simulado:
- `raices_auth_users`: usuarios y perfiles.
- `raices_auth_session`: sesión activa.
- `raices_tree_<usuario>`: árbol de cada cuenta.

Eso permite que al volver a iniciar sesión con el mismo usuario se recupere su árbol.

## 4) Lógica de edades, años y estado de vida

### Cálculo base por usuario
1. El usuario ingresa su edad y año actual.
2. Se calcula su año de nacimiento.
3. El árbol se construye usando ese año base para calcular parientes.

### Validaciones de parentesco
- Padre/Madre: mínimo +13 años respecto al usuario.
- Abuelo/a: mínimo +26.
- Bisabuelo/a: mínimo +39.
- Hijo/a: mínimo -13 (más joven que el usuario).
- Nieto/a y bisnieto/a con coherencia de diferencia de edad.

### Estado de vida estimado
Cada nodo se marca como:
- `Vivo`
- `Fallecido`

Es una estimación heurística (no dato real), basada en edad, relación y año de nacimiento.

## 5) Panel de administración

Con usuario `admin`:
- Ve listado de usuarios registrados.
- Puede eliminar usuarios.
- Al eliminar un usuario, también se borra su árbol guardado.

## 6) Estructura Sass (7-1)

```text
scss/
├── main.scss
├── abstracts/
├── base/
├── components/
├── layout/
├── pages/
├── themes/
└── vendors/
```

Regla de mantenimiento:
- El único punto de entrada es `scss/main.scss`.
- No se usa CSS inline en HTML ni JS.
- El archivo histórico combinado quedó movido a `scss/legacy/_combined.scss` y no participa en la compilación.

## 7) Módulos JS

- `js/auth.js`: login/registro, sesión, admin y gestión de usuarios.
- `js/calculator.js`: cálculo de edad/año nacimiento y validaciones lógicas.
- `js/tree.js`: render y persistencia del árbol por cuenta.
- `js/app.js`: orquestación UI, modales, toasts y navegación SPA.

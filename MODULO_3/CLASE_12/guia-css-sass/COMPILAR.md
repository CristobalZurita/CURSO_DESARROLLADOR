# 🎨 Cómo Compilar SASS a CSS

## Opción 1: Comando Rápido (Recomendado)

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar SASS una vez
npm run sass

# 3. Modo watch (auto-compilar al guardar)
npm run sass:watch

# 4. Compilar para producción (comprimido)
npm run sass:build
```

## Opción 2: Sin Node.js (Usar SASS directamente)

### Instalar SASS globalmente:
```bash
# Usando npm
npm install -g sass

# Usando Homebrew (Mac)
brew install sass/sass/sass

# Usando Chocolatey (Windows)
choco install sass
```

### Compilar:
```bash
# Compilar una vez
sass scss/main.scss css/main.css

# Watch mode (auto-compilar)
sass --watch scss/main.scss:css/main.css

# Compilar comprimido
sass scss/main.scss css/main.css --style compressed
```

## Opción 3: Extensión de VS Code

1. Instalar extensión "Live Sass Compiler"
2. Abrir el proyecto en VS Code
3. Click en "Watch Sass" en la barra inferior
4. Los cambios se compilarán automáticamente

## Verificar que funciona

Después de compilar, deberías ver:
- ✅ Archivo `css/main.css` creado
- ✅ (Opcional) Archivo `css/main.css.map` para debugging

## Estructura de archivos SASS

```
scss/
├── main.scss           ← Archivo principal (importa todo)
├── abstracts/
│   ├── _variables.scss ← Modifica colores, espaciados aquí
│   ├── _mixins.scss    ← Funciones reutilizables
│   └── _functions.scss
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _utilities.scss
├── components/         ← Modifica componentes aquí
│   ├── _box-model.scss
│   ├── _display.scss
│   └── ...
├── layout/
│   ├── _header.scss
│   ├── _footer.scss
│   └── ...
└── pages/
    └── _home.scss
```

## Tips:

1. **Nunca edites** `css/main.css` directamente (se sobrescribe al compilar)
2. **Edita** los archivos `.scss` en la carpeta `scss/`
3. **Compila** después de cada cambio (o usa watch mode)
4. **Revisa** el resultado en el navegador

## Solución de problemas

### Error: "sass: command not found"
→ Instala SASS globalmente o usa `npm run sass`

### Error: "Cannot find module 'sass'"
→ Ejecuta `npm install` en la carpeta del proyecto

### Los cambios no se ven
→ Asegúrate de compilar después de editar SCSS
→ Refresca el navegador (Ctrl+F5 o Cmd+Shift+R)

### Conflictos de caché
→ Borra el caché del navegador
→ Usa modo incógnito para probar

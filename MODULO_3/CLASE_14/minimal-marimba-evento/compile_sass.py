#!/usr/bin/env python3
"""
SASS Compiler - Minimal Marimba
Compila archivos SASS a CSS
"""

import os
import re
import shutil
import subprocess

def process_sass_file(filepath):
    """Lee y procesa un archivo SASS"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    return content

def compile_sass_to_css(scss_dir, output_file):
    """Compila todos los archivos SASS a un solo CSS"""
    
    # Leer main.scss
    main_file = os.path.join(scss_dir, 'main.scss')
    
    if not os.path.exists(main_file):
        print(f"Error: {main_file} no encontrado")
        return
    
    # Si hay un compilador real disponible, usarlo
    if try_compile_with_tool(main_file, output_file):
        return
    if try_compile_with_python_lib(main_file, output_file):
        return
    
    # Fallback: compilación "plana" (no resuelve variables ni anidación)
    # Esto sirve solo para depurar imports, no para producción.
    # Leer archivo principal
    with open(main_file, 'r', encoding='utf-8') as f:
        main_content = f.read()
    
    # Encontrar todos los @import
    imports = re.findall(r"@import\s+['\"]([^'\"]+)['\"];", main_content)
    
    compiled_css = "/* Minimal Marimba - Resonancias Electrónicas 2026 */\n"
    compiled_css += "/* Compilado desde SASS */\n\n"
    
    # Procesar cada import
    for import_path in imports:
        # Construir ruta del archivo
        file_path = os.path.join(scss_dir, import_path + '.scss')
        
        if os.path.exists(file_path):
            print(f"Procesando: {import_path}.scss")
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Remover comentarios de SASS
                content = re.sub(r'//.*$', '', content, flags=re.MULTILINE)
                
                # Convertir variables SASS básicas
                # Esto es una conversión simplificada
                content = convert_sass_to_css(content)
                
                compiled_css += f"\n/* {import_path} */\n"
                compiled_css += content + "\n"
        else:
            print(f"Advertencia: {file_path} no encontrado")
    
    # Escribir archivo CSS compilado
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(compiled_css)
    
    print(f"\n✅ CSS compilado exitosamente en: {output_file}")
    print(f"📦 Tamaño: {len(compiled_css)} caracteres")
    print("⚠️  Advertencia: esta compilación NO resuelve SASS real. Instala un compilador.")

def convert_sass_to_css(sass_content):
    """
    Conversión básica de SASS a CSS
    Nota: Esta es una conversión muy simplificada
    """
    # Por ahora, retornamos el contenido tal cual
    # En producción, usaríamos libsass o dart-sass
    return sass_content

def try_compile_with_tool(main_file, output_file):
    """Intenta compilar usando sass CLI (global o via npx)."""
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    if shutil.which("sass"):
        print("🔧 Usando sass CLI...")
        subprocess.run(["sass", main_file, output_file], check=True)
        return True
    if shutil.which("npx"):
        print("🔧 Usando npx sass (requiere instalación o descarga)...")
        try:
            subprocess.run(["npx", "sass", main_file, output_file], check=True)
            return True
        except Exception:
            return False
    return False

def try_compile_with_python_lib(main_file, output_file):
    """Intenta compilar usando la librería python 'sass' (libsass)."""
    try:
        import sass  # type: ignore
    except Exception:
        return False
    print("🔧 Usando libsass (python)...")
    css = sass.compile(filename=main_file, output_style="expanded")
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(css)
    return True

if __name__ == "__main__":
    project_root = os.path.dirname(os.path.abspath(__file__))
    scss_dir = os.path.join(project_root, "scss")
    output_file = os.path.join(project_root, "css", "main.css")
    
    print("🎨 Compilando SASS...")
    compile_sass_to_css(scss_dir, output_file)

#!/usr/bin/env python3
"""
SASS Compiler - Minimal Marimba
Compila archivos SASS a CSS
"""

import os
import re

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

def convert_sass_to_css(sass_content):
    """
    Conversión básica de SASS a CSS
    Nota: Esta es una conversión muy simplificada
    """
    # Por ahora, retornamos el contenido tal cual
    # En producción, usaríamos libsass o dart-sass
    return sass_content

if __name__ == "__main__":
    import subprocess
    import sys
    
    print("🎨 Compilando SASS...")
    
    try:
        # Usar dart-sass (npx sass)
        result = subprocess.run([
            'npx', 'sass', 
            'scss/main.scss', 
            'css/main.css'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ CSS compilado exitosamente")
            print(result.stdout)
        else:
            print("❌ Error compilando SASS:")
            print(result.stderr)
            sys.exit(1)
    except FileNotFoundError:
        print("❌ npx no encontrado. Instala Node.js o usa: npm install -g sass")
        sys.exit(1)

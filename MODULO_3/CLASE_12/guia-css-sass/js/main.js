// ========================================
// GUÍA VISUAL CSS - JAVASCRIPT
// Interactividad opcional
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // SMOOTH SCROLL
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ANIMACIONES AL HACER SCROLL
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar secciones
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // CONTADOR DE CAJAS
    // ========================================
    function contarElementos() {
        const stats = {
            secciones: document.querySelectorAll('.section').length,
            ejemplos: document.querySelectorAll('[class*="example"]').length,
            componentes: document.querySelectorAll('[class*="item"], [class*="box"]').length
        };
        
        console.log('📊 Estadísticas del documento:');
        console.log(`   Secciones: ${stats.secciones}`);
        console.log(`   Ejemplos: ${stats.ejemplos}`);
        console.log(`   Componentes: ${stats.componentes}`);
    }

    contarElementos();

    // COPIAR CÓDIGO AL HACER CLICK
    // ========================================
    document.querySelectorAll('.code-snippet').forEach(codeBlock => {
        codeBlock.style.cursor = 'pointer';
        codeBlock.title = 'Click para copiar código';
        
        codeBlock.addEventListener('click', function() {
            const text = this.innerText;
            navigator.clipboard.writeText(text).then(() => {
                // Feedback visual
                const originalBg = this.style.background;
                this.style.background = '#4caf50';
                this.style.transition = 'background 0.3s ease';
                
                setTimeout(() => {
                    this.style.background = originalBg;
                }, 500);
                
                console.log('✅ Código copiado al portapapeles');
            });
        });
    });

    // MODO OSCURO (opcional para futuro)
    // ========================================
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
    }

    // Restaurar preferencia de dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // LOGGING DE INTERACCIONES
    // ========================================
    let interactionCount = 0;
    
    document.addEventListener('click', function(e) {
        interactionCount++;
        
        // Log cada 10 interacciones
        if (interactionCount % 10 === 0) {
            console.log(`👆 ${interactionCount} interacciones registradas`);
        }
    });

    // MENSAJE DE BIENVENIDA
    // ========================================
    console.log('%c¡Bienvenido a la Guía Visual de CSS!', 'font-size: 20px; color: #667eea; font-weight: bold;');
    console.log('%cArquitectura: SASS 7-1 + BEM', 'color: #764ba2;');
    console.log('%cAbre las DevTools para experimentar en tiempo real', 'color: #95a5a6;');
    console.log('%cTip: Click en cualquier bloque de código para copiar', 'color: #2ecc71;');

    // HELPERS GLOBALES (disponibles en consola)
    // ========================================
    window.cssGuide = {
        stats: contarElementos,
        darkMode: toggleDarkMode,
        version: '1.0.0'
    };

    console.log('💡 Usa cssGuide.stats() para ver estadísticas');
    console.log('💡 Usa cssGuide.darkMode() para alternar modo oscuro');

});

// ==========================================================================
// MAIN.JS - Interactividad para la Guía CSS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Guía CSS cargada correctamente');
    
    // ==========================================
    // 1. NAVEGACIÓN MÓVIL (Hamburguesa)
    // ==========================================
    const navToggle = document.querySelector('.l-nav__toggle');
    const navMenu = document.querySelector('.l-nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('is-active');
            navMenu.classList.toggle('is-open');
        });
        
        // Cerrar menú al hacer click en un link
        document.querySelectorAll('.l-nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('is-active');
                navMenu.classList.remove('is-open');
            });
        });
    }
    
    // ==========================================
    // 2. NAVEGACIÓN ACTIVA EN SCROLL (Scroll Spy)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.l-nav__link, .l-toc__link');
    
    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('is-active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Ejecutar al cargar
    
    // ==========================================
    // 3. SCROLL SUAVE (Smooth Scroll)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==========================================
    // 4. ANIMACIÓN DE ENTRADA (Fade In)
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.l-section, .c-display-example, .c-flex-example').forEach(el => {
        el.classList.add('u-fade-in');
        observer.observe(el);
    });
    
    // ==========================================
    // 5. INTERACTIVIDAD BOX MODEL
    // ==========================================
    const boxModel = document.querySelector('.c-box-model');
    if (boxModel) {
        const layers = ['margin', 'border', 'padding', 'content'];
        let currentLayer = 0;
        
        boxModel.addEventListener('click', () => {
            // Remover clase anterior
            boxModel.classList.remove(`is-highlight-${layers[currentLayer]}`);
            
            // Siguiente capa
            currentLayer = (currentLayer + 1) % layers.length;
            
            // Agregar nueva clase
            boxModel.classList.add(`is-highlight-${layers[currentLayer]}`);
            
            // Mostrar tooltip temporal
            showTooltip(boxModel, `Capa: ${layers[currentLayer].toUpperCase()}`);
        });
    }
    
    // ==========================================
    // 6. COPIAR CÓDIGO AL PORTAPAPELES
    // ==========================================
    document.querySelectorAll('.c-code-snippet').forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'c-copy-btn';
        copyBtn.innerHTML = '📋 Copiar';
        copyBtn.setAttribute('aria-label', 'Copiar código');
        
        copyBtn.addEventListener('click', () => {
            const code = block.innerText.replace('📋 Copiar', '').trim();
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerHTML = '✅ Copiado!';
                copyBtn.classList.add('is-copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 Copiar';
                    copyBtn.classList.remove('is-copied');
                }, 2000);
            });
        });
        
        block.appendChild(copyBtn);
    });
    
    // ==========================================
    // 7. BOTÓN "VOLVER ARRIBA"
    // ==========================================
    const backToTop = document.createElement('button');
    backToTop.className = 'c-back-to-top';
    backToTop.innerHTML = '⬆️';
    backToTop.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('is-visible');
        } else {
            backToTop.classList.remove('is-visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ==========================================
    // 8. TOOLTIP HELPER
    // ==========================================
    function showTooltip(element, text) {
        const existing = document.querySelector('.c-tooltip');
        if (existing) existing.remove();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'c-tooltip';
        tooltip.textContent = text;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 40}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(tooltip);
        
        setTimeout(() => tooltip.remove(), 2000);
    }
    
    // ==========================================
    // 9. TECLAS DE ACCESO RÁPIDO
    // ==========================================
    document.addEventListener('keydown', (e) => {
        // Alt + 1-5 para navegar entre módulos
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const sections = ['box-model', 'display', 'positioning', 'flexbox', 'grid'];
            const index = parseInt(e.key) - 1;
            if (sections[index]) {
                document.getElementById(sections[index])?.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Alt + T para volver arriba
        if (e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    console.log('✅ Todos los módulos inicializados');
});
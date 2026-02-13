/**
 * Effects Initialization Module
 * Coordinates all visual effects for Resonancias Electrónicas event site
 */

import AudioVisualizer from './modules/AudioVisualizer.js';
import ParticleSystem from './modules/ParticleSystem.js';
import CustomCursor from './modules/CustomCursor.js';
import RippleEffect from './modules/RippleEffect.js';
import ParallaxReverb from './modules/ParallaxReverb.js';
import ElectricArcs from './modules/ElectricArcs.js';

/**
 * Initialize all effects
 * Call this after DOM is ready
 */
export function initializeEffects(config = {}) {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    console.log('🎨 Initializing Resonancias Electrónicas effects...');
    console.log('⚙️ Respects prefers-reduced-motion:', prefersReducedMotion);

    const effects = {};

    try {
        // Audio Visualizer (fixed bottom) - SOLO si existe el contenedor
        const visualizerContainer = document.querySelector('.visualizer');
        if (visualizerContainer) {
            effects.audioVisualizer = new AudioVisualizer({
                container: visualizerContainer,
                barCount: 60,
                colors: ['#cc5500', '#ff6b3d', '#00ff9d']
            });

            // Mostrar visualizer solo al llegar al footer
            visualizerContainer.classList.remove('visualizer--active');
            const footer = document.querySelector('footer.footer, footer');
            if (footer) {
                effects.visualizerObserver = new IntersectionObserver((entries) => {
                    const isFooterVisible = entries.some((entry) => entry.isIntersecting);
                    visualizerContainer.classList.toggle('visualizer--active', isFooterVisible);
                }, {
                    threshold: 0.15
                });
                effects.visualizerObserver.observe(footer);
            }
        } else {
            console.log('ℹ️ AudioVisualizer: No .visualizer container found');
        }

        // Electric arcs (hero section - full hero)
        const heroContainer = document.querySelector('.hero');
        if (heroContainer) {
            effects.electricArcs = new ElectricArcs({
                container: heroContainer,
                intensity: 0.28,
                minDelay: 3000,
                maxDelay: 3000
            });
            heroContainer.classList.add('hero--electric');
        } else {
            console.log('ℹ️ ElectricArcs: No .hero container found');
        }

        // Particle System disabled by request
        console.log('ℹ️ ParticleSystem: Disabled by request');

        // Custom Cursor (baqueta) - no se fuerza en dispositivos sin puntero fino
        const cursorElement = document.querySelector('.custom-cursor');
        if (cursorElement && window.matchMedia('(pointer: fine)').matches) {
            effects.customCursor = new CustomCursor({
                cursor: cursorElement,
                size: 20,
                height: 80,
                color1: '#cc5500',
                color2: '#00ff9d'
            });
        }

        // Ripple Effect (cards) - SIEMPRE inicializar
        effects.rippleEffect = new RippleEffect({
            selector: '.card--marimba',
            duration: 720,
            color: 'rgba(255, 107, 61, 0.48)'
        });

        // Parallax Reverb (scroll effect) - SIEMPRE inicializar
        effects.parallaxReverb = new ParallaxReverb({
            selector: '.parallax-image',
            speed: 0.5,
            throttleDelay: 16
        });

        console.log('✅ All effects initialized successfully');
        return effects;
    } catch (err) {
        console.error('❌ Error initializing effects:', err);
        return null;
    }
}

// Export individual classes for manual use
export {
    AudioVisualizer,
    ParticleSystem,
    CustomCursor,
    RippleEffect,
    ParallaxReverb,
    ElectricArcs
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.resonanciasEffects = initializeEffects();
    });
} else {
    window.resonanciasEffects = initializeEffects();
}

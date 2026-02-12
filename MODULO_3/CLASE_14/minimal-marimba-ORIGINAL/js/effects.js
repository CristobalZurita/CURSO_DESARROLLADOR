/**
 * Effects Initialization Module
 * Coordinates all visual effects for Resonancias Electrónicas event site
 */

import AudioVisualizer from './modules/AudioVisualizer.js';
import ParticleSystem from './modules/ParticleSystem.js';
import CustomCursor from './modules/CustomCursor.js';
import RippleEffect from './modules/RippleEffect.js';
import ParallaxReverb from './modules/ParallaxReverb.js';

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
        } else {
            console.log('ℹ️ AudioVisualizer: No .visualizer container found');
        }

        // Particle System (hero section) - SOLO si existe el contenedor
        const particlesContainer = document.querySelector('.hero__particles');
        if (particlesContainer) {
            effects.particleSystem = new ParticleSystem({
                container: particlesContainer,
                particleCount: 50,
                connectionDistance: 150,
                gridSize: 150,
                colors: ['#cc5500', '#ff6b3d', '#00ff9d']
            });
        } else {
            console.log('ℹ️ ParticleSystem: No .hero__particles container found');
        }

        // Custom Cursor (baqueta) - SOLO si hay mouse y existe el elemento
// Reemplazar la condición por:
const cursorElement = document.querySelector('.custom-cursor');
if (cursorElement) {
    effects.customCursor = new CustomCursor({
        cursor: cursorElement,
        size: 20,
        height: 80,
        color1: '#cc5500',
        color2: '#00ff9d'
    });
    console.log('✨ CustomCursor initialized (forced)');
}

        // Ripple Effect (cards) - SIEMPRE inicializar
        effects.rippleEffect = new RippleEffect({
            selector: '.card--marimba',
            duration: 600,
            color: 'rgba(255, 107, 61, 0.3)'
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
    ParallaxReverb
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.resonanciasEffects = initializeEffects();
    });
} else {
    window.resonanciasEffects = initializeEffects();
}
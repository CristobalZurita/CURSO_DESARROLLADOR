/**
 * ParallaxReverb - Parallax scroll effect with reverb echo
 * Optimized: Throttled scroll handler, GPU acceleration with transform3D
 * A11y: Respects prefers-reduced-motion
 */

class ParallaxReverb {
    constructor(options = {}) {
        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            console.log('⚙️ ParallaxReverb: Respecting prefers-reduced-motion');
            return;
        }

        this.selector = options.selector || '.parallax-image';
        this.speed = options.speed || 0.5;
        this.throttleDelay = options.throttleDelay || 16; // ~60fps

        this.elements = document.querySelectorAll(this.selector);
        this.lastScrollTime = 0;
        this.scrollY = 0;
        this.animationId = null;

        this.setupParallax();
        this.setupScrollListener();

        console.log('✨ ParallaxReverb initialized');
    }

    /**
     * Setup parallax elements with GPU hints
     */
    setupParallax() {
        this.elements.forEach((el) => {
            // GPU acceleration hints
            el.style.willChange = 'transform';
            el.style.transform = 'translate3d(0, 0, 0)';

            // Store original position
            el.dataset.parallaxOffsetY = el.offsetTop - window.innerHeight;
        });
    }

    /**
     * Setup scroll listener with throttling
     */
    setupScrollListener() {
        document.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;

            const now = Date.now();
            if (now - this.lastScrollTime > this.throttleDelay) {
                this.lastScrollTime = now;
                this.updateParallax();
            }
        }, { passive: true });

        // Initial update
        this.updateParallax();
    }

    /**
     * Update parallax positions
     */
    updateParallax() {
        this.elements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            const elementHeight = el.offsetHeight;

            // Only update if element is in viewport or nearby
            if (elementTop < window.innerHeight && elementTop + elementHeight > 0) {
                const offset = -(elementTop * this.speed);

                // Use transform3D for GPU acceleration
                el.style.transform = `translate3d(0, ${offset}px, 0)`;

                // Add reverb echo effect with slight blur
                const echoOpacity = Math.max(0, 0.1 - Math.abs(offset) / 1000);
                el.style.filter = `blur(${echoOpacity}px)`;
            }
        });
    }

    /**
     * Update speed dynamically
     */
    setSpeed(speed) {
        this.speed = speed;
        this.updateParallax();
    }

    /**
     * Cleanup
     */
    destroy() {
        this.elements.forEach((el) => {
            el.style.willChange = 'auto';
            el.style.transform = '';
            el.style.filter = '';
        });
    }
}

export default ParallaxReverb;


/**
 * CustomCursor - Baqueta cursor with mouse tracking
 * Optimized: RAF for smooth 60fps tracking, touch device fallback
 * A11y: Focus-visible restoration, pointer: fine/coarse detection
 */

class CustomCursor {
    constructor(options = {}) {
        this.cursor = options.cursor || document.querySelector('.custom-cursor');
        if (!this.cursor) {
            console.warn('⚠️ CustomCursor: No cursor element found');
            return;
        }

        // Configuration
        this.size = options.size || 20;
        this.height = options.height || 80;
        this.color1 = options.color1 || '#cc5500';
        this.color2 = options.color2 || '#00ff9d';

        // State
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.isClicking = false;
        this.isHovering = false;
        // Hide native cursor and show custom (CSS media query handles pointer: fine/coarse)
        this.setupCursor();
        this.setupEventListeners();
        this.animate();
        console.log('✨ CustomCursor initialized');
    }

    /**
     * Detect if device supports pointer: fine (mouse)
     */
    supportsPointerFine() {
        return window.matchMedia('(pointer: fine)').matches;
    }

    /**
     * Detect touch device
     */
    detectTouchDevice() {
        return (
            (window.ontouchstart !== undefined) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0)
        );
    }

    /**
     * Initialize cursor styling
     */
    setupCursor() {
        // Solo la imagen PNG, sin elementos extra
        const svg = `
            <svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg" width="72" height="108">
                <image href="assets/images/MALLET4.png" x="0" y="0" width="40" height="60" preserveAspectRatio="xMidYMid meet"/>
            </svg>
        `;
        this.cursor.innerHTML = svg;
        this.cursor.style.position = 'fixed';
        this.cursor.style.top = '0';
        this.cursor.style.left = '0';
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.zIndex = '300';
        document.documentElement.style.cursor = 'none';
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });

        // Mouse down/up for clicking effect
        document.addEventListener('mousedown', () => {
            this.isClicking = true;
            this.cursor.classList.add('custom-cursor--clicking');
        });

        document.addEventListener('mouseup', () => {
            this.isClicking = false;
            this.cursor.classList.remove('custom-cursor--clicking');
        });

        // Hover detection
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a, button, input, textarea, [role="button"]')) {
                this.isHovering = true;
                this.cursor.classList.add('custom-cursor--hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('a, button, input, textarea, [role="button"]')) {
                this.isHovering = false;
                this.cursor.classList.remove('custom-cursor--hovering');
            }
        });

        // Leave page
        document.addEventListener('mouseleave', () => {
            this.cursor.style.display = 'none';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.display = 'block';
        });

        // Focus-visible: restore native cursor for keyboard users
        const handleFocusVisible = () => {
            if (document.activeElement && document.activeElement.matches(':focus-visible')) {
                document.documentElement.style.cursor = 'auto';
            }
        };

        document.addEventListener('focusin', handleFocusVisible);
        document.addEventListener('blur', () => {
            document.documentElement.style.cursor = 'none';
        });
    }

    /**
     * Smooth animation with easing
     */
    animate = () => {
        requestAnimationFrame(() => this.animate());

        // Smooth easing
        const easing = 0.15;
        this.x += (this.targetX - this.x) * easing;
        this.y += (this.targetY - this.y) * easing;

        // Apply transform - solo translación y escala, sin rotación
        const scale = this.isClicking ? 0.9 : (this.isHovering ? 1.1 : 1);
        this.cursor.style.transform = `translate(${this.x}px, ${this.y}px) translate(-50%, 0%) scale(${scale})`;
    };

    /**
     * Restore native cursor
     */
    restore() {
        document.documentElement.style.cursor = 'auto';
        if (this.cursor) {
            this.cursor.style.display = 'none';
        }
    }
}

export default CustomCursor;


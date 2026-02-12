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
        this.rafId = null;
        this.lastX = null;
        this.lastY = null;
        this.lastScale = null;
        // Hotspot calibration: top of the red head ("norte" absoluto)
        this.hotspotOffsetYPercent = 8.2;
        // Hide native cursor and show custom (CSS media query handles pointer: fine/coarse)
        this.setupCursor();
        this.setupEventListeners();
        this.scheduleRender();
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
            <svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg" width="103.4" height="154">
                <image href="assets/images/MALLET4.png" x="0" y="0" width="40" height="60" preserveAspectRatio="xMidYMid meet"/>
            </svg>
        `;
        this.cursor.innerHTML = svg;
        this.cursor.style.position = 'fixed';
        this.cursor.style.top = '0';
        this.cursor.style.left = '0';
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.zIndex = '10000';
        document.documentElement.classList.add('custom-cursor-active');
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
            this.scheduleRender();
        }, { passive: true });

        // Mouse down/up for clicking effect
        document.addEventListener('mousedown', () => {
            this.isClicking = true;
            this.cursor.classList.add('custom-cursor--clicking');
            this.scheduleRender();
        });

        document.addEventListener('mouseup', () => {
            this.isClicking = false;
            this.cursor.classList.remove('custom-cursor--clicking');
            this.scheduleRender();
        });

        // Hover detection
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a, button, input, textarea, [role="button"]')) {
                this.isHovering = true;
                this.cursor.classList.add('custom-cursor--hovering');
                this.scheduleRender();
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('a, button, input, textarea, [role="button"]')) {
                this.isHovering = false;
                this.cursor.classList.remove('custom-cursor--hovering');
                this.scheduleRender();
            }
        });

        // Keep native cursor hidden consistently
        document.addEventListener('focusin', () => {
            document.documentElement.style.cursor = 'none';
            this.scheduleRender();
        });
        document.addEventListener('blur', () => {
            document.documentElement.style.cursor = 'none';
            this.scheduleRender();
        });
    }

    /**
     * Request a single RAF render if one is not already queued
     */
    scheduleRender() {
        if (this.rafId !== null) return;
        this.rafId = requestAnimationFrame(() => this.render());
    }

    /**
     * Render cursor state
     */
    render = () => {
        this.rafId = null;

        // No easing: cursor image sticks to real pointer position
        this.x = this.targetX;
        this.y = this.targetY;

        const scale = this.isClicking ? 0.9 : (this.isHovering ? 1.1 : 1);
        if (this.x === this.lastX && this.y === this.lastY && scale === this.lastScale) return;

        this.lastX = this.x;
        this.lastY = this.y;
        this.lastScale = scale;
        this.cursor.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) translate(-50%, -${this.hotspotOffsetYPercent}%) scale(${scale})`;
    };

    /**
     * Restore native cursor
     */
    restore() {
        document.documentElement.classList.remove('custom-cursor-active');
        document.documentElement.style.cursor = 'auto';
        if (this.cursor) {
            this.cursor.style.display = 'none';
        }
    }
}

export default CustomCursor;

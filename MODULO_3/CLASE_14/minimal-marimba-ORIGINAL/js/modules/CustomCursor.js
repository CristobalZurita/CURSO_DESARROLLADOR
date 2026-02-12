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
        // Create baqueta shape SVG
        const svg = `
            <svg viewBox="0 0 ${this.size} ${this.height}" xmlns="http://www.w3.org/2000/svg" style="width: ${this.size}px; height: ${this.height}px;">
                <defs>
                    <linearGradient id="baquetaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${this.color1};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${this.color2};stop-opacity:1" />
                    </linearGradient>
                    <filter id="cursorGlow">
                        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <!-- Baqueta stick -->
                <rect x="${this.size/2 - 2}" y="5" width="4" height="${this.height - 10}" fill="url(#baquetaGradient)" rx="2" filter="url(#cursorGlow)"/>
                <!-- Ball head -->
                <circle cx="${this.size/2}" cy="8" r="5" fill="url(#baquetaGradient)" filter="url(#cursorGlow)"/>
            </svg>
        `;

        this.cursor.innerHTML = svg;
        this.cursor.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 300;
            mix-blend-mode: difference;
            will-change: transform;
        `;

        // Hide native cursor
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
            this.cursor.style.transform = `translate(${this.x - this.size/2}px, ${this.y - this.size/2}px) scale(0.8)`;
        });

        document.addEventListener('mouseup', () => {
            this.isClicking = false;
        });

        // Hover detection
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a, button, input, textarea, [role="button"]')) {
                this.isHovering = true;
                this.cursor.style.opacity = '0.8';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('a, button, input, textarea, [role="button"]')) {
                this.isHovering = false;
                this.cursor.style.opacity = '1';
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

        // Apply transform
        const scale = this.isClicking ? 0.8 : 1;
        this.cursor.style.transform = `
            translate(${this.x - this.size/2}px, ${this.y - this.size/2}px)
            scale(${scale})
            rotate(${this.x * 0.01}deg)
        `;
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


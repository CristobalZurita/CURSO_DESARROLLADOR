/**
 * RippleEffect - Click ripple animation
 * Optimized: Minimal DOM impact, uses CSS animations
 * A11y: Respects prefers-reduced-motion, keyboard accessible
 */

class RippleEffect {
    constructor(options = {}) {
        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            console.log('⚙️ RippleEffect: Respecting prefers-reduced-motion');
            return;
        }

        this.selector = options.selector || '.card--marimba';
        this.duration = options.duration || 600;
        this.color = options.color || 'rgba(255, 107, 61, 0.3)';

        this.setupRipples();
        console.log('✨ RippleEffect initialized');
    }

    /**
     * Setup ripple effect on all matching elements
     */
    setupRipples() {
        const elements = document.querySelectorAll(this.selector);

        elements.forEach(el => {
            el.addEventListener('click', (e) => this.createRipple(e, el));
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.createRipple(e, el, true);
                }
            });
        });

        // Handle dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.matches(this.selector)) {
                        node.addEventListener('click', (e) => this.createRipple(e, node));
                        node.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                this.createRipple(e, node, true);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { subtree: true, childList: true });
    }

    /**
     * Create ripple effect at click position
     */
    createRipple(event, element, isKeyboard = false) {
        // Only create ripple on left click
        if (event.button && event.button !== 0) return;

        let x, y;

        if (isKeyboard) {
            // For keyboard, center the ripple
            const rect = element.getBoundingClientRect();
            x = rect.width / 2;
            y = rect.height / 2;
        } else {
            // For mouse, use click position
            const rect = element.getBoundingClientRect();
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: 20px;
            height: 20px;
            background: ${this.color};
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: ripple ${this.duration}ms ease-out forwards;
            z-index: 10;
        `;

        // Ensure element has position context
        if (window.getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }

        element.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, this.duration);
    }
}

export default RippleEffect;


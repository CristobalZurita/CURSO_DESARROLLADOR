/**
 * AudioVisualizer - Simple animated spectrum demo
 * No Web Audio API - just CSS-driven animation with canvas fallback
 */

class AudioVisualizer {
    constructor(options = {}) {
        this.container = options.container || document.querySelector('.visualizer');
        if (!this.container) {
            console.log('⚙️ AudioVisualizer: No container found');
            return;
        }

        this.isActive = true;
        this.animationId = null;

        // Create simple canvas with demo animation
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        // IMPORTANTE: Esperar a que el contenedor tenga dimensiones
        this.width = 0;
        this.height = 0;

        // Demo data - simulating audio (sin waves)
        this.dataArray = new Uint8Array(60);
        this.phase = 0;

        // Esperar un frame para que el contenedor tenga tamaño
        requestAnimationFrame(() => {
            this.setCanvasSize();
            if (this.width > 0 && this.height > 0) {
                this.container.appendChild(this.canvas);
                this.setupEventListeners();
                this.animate();
                console.log('✨ AudioVisualizer initialized (demo mode)');
            } else {
                console.warn('⚠️ AudioVisualizer: Container has no dimensions');
            }
        });
    }

    setCanvasSize() {
        const rect = this.container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.width = rect.width;
        this.height = rect.height;

        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.setCanvasSize());
    }

    animate = () => {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.width || !this.height) return;

        // Generate demo spectrum using sine waves
        for (let i = 0; i < 60; i++) {
            const frequency = Math.sin(this.phase + i * 0.14) * 110 + 105;
            this.dataArray[i] = Math.abs(frequency);
        }
        this.phase += 0.024;

        const barWidth = this.width / 60;

        // Clear canvas with subtle depth layer
        this.ctx.clearRect(0, 0, this.width, this.height);
        const depthGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        depthGradient.addColorStop(0, 'rgba(10, 10, 10, 0)');
        depthGradient.addColorStop(1, 'rgba(10, 10, 10, 0.08)');
        this.ctx.fillStyle = depthGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw bars (full-color palette, but transparent)
        for (let i = 0; i < 60; i++) {
            const value = this.dataArray[i];
            const barHeight = (value / 255) * this.height * 0.9;
            const hueA = ((i / 60) * 360 + this.phase * 140) % 360;
            const hueB = (hueA + 52) % 360;
            const alphaTop = 0.24 + (value / 255) * 0.26;
            const alphaBottom = 0.12 + (value / 255) * 0.2;
            const barGradient = this.ctx.createLinearGradient(0, this.height - barHeight, 0, this.height);
            barGradient.addColorStop(0, `hsla(${hueA}, 96%, 62%, ${alphaTop})`);
            barGradient.addColorStop(1, `hsla(${hueB}, 94%, 50%, ${alphaBottom})`);

            this.ctx.fillStyle = barGradient;
            this.ctx.fillRect(
                i * barWidth + 1,
                this.height - barHeight,
                barWidth - 2,
                barHeight
            );
        }
    };

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
export default AudioVisualizer;

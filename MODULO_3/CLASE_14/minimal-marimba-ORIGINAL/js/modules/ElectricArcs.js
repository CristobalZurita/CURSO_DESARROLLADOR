/**
 * ElectricArcs - Subtle random electric bolt effect for hero layer
 * Draws lightweight lightning paths on a canvas inside the full .hero
 */
class ElectricArcs {
    constructor(options = {}) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }

        this.container = options.container || document.querySelector('.hero');
        if (!this.container) {
            return;
        }

        this.intensity = options.intensity ?? 0.22;
        this.minDelay = options.minDelay ?? 350;
        this.maxDelay = options.maxDelay ?? 1200;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        this.canvas.classList.add('hero-electric-arcs');
        this.canvas.setAttribute('aria-hidden', 'true');

        this.width = 0;
        this.height = 0;
        this.bolts = [];
        this.animationId = null;
        this.lastSpawn = 0;
        this.nextSpawnDelay = this.randomDelay();

        requestAnimationFrame(() => {
            this.setCanvasSize();
            if (!this.width || !this.height) return;

            this.container.appendChild(this.canvas);
            this.setupEvents();
            this.animate(performance.now());
        });
    }

    randomDelay() {
        return this.minDelay + Math.random() * (this.maxDelay - this.minDelay);
    }

    setCanvasSize() {
        const rect = this.container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
    }

    setupEvents() {
        window.addEventListener('resize', () => this.setCanvasSize(), { passive: true });
    }

    createBoltPath() {
        const marginX = this.width * 0.05;
        const marginY = this.height * 0.08;
        const startX = marginX + Math.random() * (this.width - marginX * 2);
        const startY = marginY + Math.random() * (this.height - marginY * 2);
        const endX = marginX + Math.random() * (this.width - marginX * 2);
        const endY = marginY + Math.random() * (this.height - marginY * 2);
        const segments = 9 + Math.floor(Math.random() * 6);
        const points = [{ x: startX, y: startY }];

        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const jitterX = (Math.random() - 0.5) * Math.max(24, this.width * 0.035);
            const jitterY = (Math.random() - 0.5) * Math.max(18, this.height * 0.03);
            points.push({
                x: startX + (endX - startX) * t + jitterX,
                y: startY + (endY - startY) * t + jitterY
            });
        }

        points.push({ x: endX, y: endY });
        return points;
    }

    spawnBolt() {
        this.bolts.push({
            points: this.createBoltPath(),
            life: 1
        });
    }

    drawBolt(points, alpha) {
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }

        this.ctx.strokeStyle = `rgba(0, 255, 157, ${alpha * this.intensity})`;
        this.ctx.lineWidth = 2.8;
        this.ctx.shadowColor = 'rgba(0, 255, 157, 0.6)';
        this.ctx.shadowBlur = 12;
        this.ctx.stroke();

        this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * (this.intensity + 0.08)})`;
        this.ctx.lineWidth = 1.2;
        this.ctx.shadowBlur = 0;
        this.ctx.stroke();
    }

    animate = (time) => {
        this.animationId = requestAnimationFrame(this.animate);

        if (!this.width || !this.height) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        if (time - this.lastSpawn >= this.nextSpawnDelay) {
            this.spawnBolt();
            if (Math.random() > 0.6) this.spawnBolt();
            this.lastSpawn = time;
            this.nextSpawnDelay = this.randomDelay();
        }

        this.bolts = this.bolts.filter((bolt) => {
            this.drawBolt(bolt.points, bolt.life);
            bolt.life -= 0.12;
            return bolt.life > 0;
        });
    };

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    }
}

export default ElectricArcs;

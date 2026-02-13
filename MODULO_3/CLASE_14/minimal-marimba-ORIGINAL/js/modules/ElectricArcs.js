/**
 * ElectricArcs - Hero lightning effect (controlled intensity)
 */
class ElectricArcs {
    constructor(options = {}) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        this.container = options.container || document.querySelector('.hero');
        if (!this.container) return;

        this.intensity = options.intensity ?? 0.28;
        this.minDelay = options.minDelay ?? 800;
        this.maxDelay = options.maxDelay ?? 2000;

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

    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
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

    createMainPath() {
        const startX = this.width * (0.1 + Math.random() * 0.8);
        const startY = this.height * (0.03 + Math.random() * 0.06);
        const endX = this.clamp(startX + (Math.random() - 0.5) * this.width * 0.2, this.width * 0.05, this.width * 0.95);
        const endY = this.height * (0.78 + Math.random() * 0.18);
        const segments = 14 + Math.floor(Math.random() * 8);
        const points = [{ x: startX, y: startY }];
        let x = startX;
        let y = startY;
        const stepY = (endY - startY) / segments;

        for (let i = 1; i < segments; i++) {
            const attract = (endX - x) * 0.1;
            const jitter = (Math.random() - 0.5) * this.width * 0.035;
            x = this.clamp(x + attract + jitter, this.width * 0.02, this.width * 0.98);
            y += stepY * (0.86 + Math.random() * 0.45);
            points.push({ x, y });
        }

        points.push({ x: endX, y: endY });
        return points;
    }

    createBranch(anchor, direction = 1) {
        const endX = this.clamp(
            anchor.x + direction * this.width * (0.05 + Math.random() * 0.14),
            this.width * 0.02,
            this.width * 0.98
        );
        const endY = this.clamp(anchor.y + this.height * (0.08 + Math.random() * 0.2), anchor.y + 8, this.height * 0.98);
        const segments = 4 + Math.floor(Math.random() * 3);
        const points = [{ x: anchor.x, y: anchor.y }];
        let x = anchor.x;
        let y = anchor.y;
        const stepY = (endY - anchor.y) / segments;

        for (let i = 1; i < segments; i++) {
            const attract = (endX - x) * 0.17;
            const jitter = (Math.random() - 0.5) * this.width * 0.022;
            x = this.clamp(x + attract + jitter, this.width * 0.02, this.width * 0.98);
            y += stepY * (0.8 + Math.random() * 0.5);
            points.push({ x, y });
        }

        points.push({ x: endX, y: endY });
        return points;
    }

    spawnBolt() {
        const mainPoints = this.createMainPath();
        const branches = [];
        const branchCount = 2 + Math.floor(Math.random() * 3);
        const minAnchor = Math.max(2, Math.floor(mainPoints.length * 0.2));
        const maxAnchor = Math.max(minAnchor + 1, Math.floor(mainPoints.length * 0.85));

        for (let i = 0; i < branchCount; i++) {
            const anchorIndex = minAnchor + Math.floor(Math.random() * (maxAnchor - minAnchor));
            const anchor = mainPoints[Math.min(anchorIndex, mainPoints.length - 2)];
            branches.push(this.createBranch(anchor, Math.random() > 0.5 ? 1 : -1));
        }

        this.bolts.push({
            mainPoints,
            branches,
            life: 1,
            decay: 0.09 + Math.random() * 0.03
        });
    }

    drawPath(points, strokeStyle, lineWidth, blur = 0, shadowColor = 'transparent') {
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.lineWidth = lineWidth;
        this.ctx.shadowBlur = blur;
        this.ctx.shadowColor = shadowColor;
        this.ctx.stroke();
    }

    drawLocalFlash(point, radius, alpha) {
        if (!point || alpha <= 0) return;
        const gradient = this.ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
        gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
        gradient.addColorStop(0.5, `rgba(170,220,255,${alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(170,220,255,0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSkyFlash(alpha) {
        if (alpha <= 0) return;
        this.ctx.fillStyle = `rgba(206, 224, 255, ${alpha})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawBolt(bolt) {
        const alpha = Math.max(0, bolt.life);
        if (alpha <= 0) return;

        const trunkGlow = alpha * (0.25 + this.intensity * 0.45);
        const trunkCore = alpha * (0.65 + this.intensity * 0.18);
        const skyFlashAlpha = alpha * (0.03 + this.intensity * 0.05);

        // Flash global breve y sutil (no debe lavar toda la pantalla)
        this.drawSkyFlash(skyFlashAlpha);

        this.drawPath(bolt.mainPoints, `rgba(120,190,255,${trunkGlow})`, 5.2, 18, 'rgba(145,205,255,0.65)');
        this.drawPath(bolt.mainPoints, `rgba(190,235,255,${trunkCore})`, 2.4, 8, 'rgba(215,245,255,0.4)');
        this.drawPath(bolt.mainPoints, `rgba(255,255,255,${trunkCore * 0.9})`, 1.15, 0);

        for (let i = 0; i < bolt.branches.length; i++) {
            const branchAlpha = alpha * (0.45 + Math.random() * 0.2);
            this.drawPath(bolt.branches[i], `rgba(160,220,255,${branchAlpha * 0.75})`, 1.6, 6, 'rgba(150,210,255,0.35)');
            this.drawPath(bolt.branches[i], `rgba(255,255,255,${branchAlpha * 0.8})`, 0.8, 0);
        }

        this.drawLocalFlash(bolt.mainPoints[0], this.width * 0.06, alpha * 0.12);
        this.drawLocalFlash(bolt.mainPoints[bolt.mainPoints.length - 1], this.width * 0.1, alpha * 0.2);
        this.ctx.shadowBlur = 0;
    }

    animate = (time) => {
        this.animationId = requestAnimationFrame(this.animate);
        if (!this.width || !this.height) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        if (time - this.lastSpawn >= this.nextSpawnDelay) {
            this.spawnBolt();
            if (Math.random() < 0.09) this.spawnBolt();
            this.lastSpawn = time;
            this.nextSpawnDelay = this.randomDelay();
        }

        this.bolts = this.bolts.filter((bolt) => {
            this.drawBolt(bolt);
            bolt.life -= bolt.decay;
            return bolt.life > 0;
        });
    };

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    }
}

export default ElectricArcs;

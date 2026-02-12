/**
 * ParticleSystem - Spatial grid for O(n) neighbor detection
 * Optimized: Spatial hashing instead of O(n²) comparisons
 * Performance: Handles 100+ particles with ripple connections efficiently
 * A11y: Respects prefers-reduced-motion
 */

class ParticleSystem {
    constructor(options = {}) {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            console.log('⚙️ ParticleSystem: Respecting prefers-reduced-motion');
            return;
        }

        this.container = options.container || document.querySelector('.hero__particles');
        if (!this.container) {
            console.warn('⚠️ ParticleSystem: No container found');
            return;
        }

        // Configuration
        this.particleCount = options.particleCount || 50;
        this.connectionDistance = options.connectionDistance || 150;
        this.gridSize = options.gridSize || 150; // Spatial grid cell size
        this.colors = options.colors || ['#cc5500', '#ff6b3d', '#00ff9d'];

        // Physics
        this.friction = 0.98;
        this.gravity = 0.1;
        this.bounceElasticity = 0.6;

        // Canvas setup
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        
        // IMPORTANTE: Esperar a que el contenedor tenga dimensiones
        this.width = 0;
        this.height = 0;
        
        // Particle storage
        this.particles = [];
        this.grid = new Map(); // Spatial grid for O(n) neighbor lookup
        this.animationId = null;

        // Esperar un frame para que el contenedor tenga tamaño
        requestAnimationFrame(() => {
            this.setCanvasSize();
            if (this.width > 0 && this.height > 0) {
                this.container.appendChild(this.canvas);
                this.initializeParticles();
                this.setupEventListeners();
                this.animate();
                console.log(`✨ ParticleSystem initialized with ${this.particleCount} particles`);
            } else {
                console.warn('⚠️ ParticleSystem: Container has no dimensions');
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

    initializeParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                life: 1,
                isConnected: false
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.setCanvasSize();
            // Reinitialize particles on resize to fit new bounds
            this.particles.forEach(p => {
                p.x = Math.max(0, Math.min(p.x, this.width));
                p.y = Math.max(0, Math.min(p.y, this.height));
            });
        });

        // Mouse interaction
        let mouseX = this.width / 2;
        let mouseY = this.height / 2;

        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            // Attract nearby particles
            this.particles.forEach(p => {
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    const force = (1 - dist / 200) * 0.5;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
            });
        });
    }

    /**
     * Spatial Grid Hash - Convert (x, y) to grid cell key
     * O(1) lookup for nearby particles
     */
    getGridKey(x, y) {
        const cellX = Math.floor(x / this.gridSize);
        const cellY = Math.floor(y / this.gridSize);
        return `${cellX},${cellY}`;
    }

    /**
     * Build spatial grid for O(n) neighbor detection
     */
    buildGrid() {
        this.grid.clear();

        this.particles.forEach((p, index) => {
            const key = this.getGridKey(p.x, p.y);
            if (!this.grid.has(key)) {
                this.grid.set(key, []);
            }
            this.grid.get(key).push(index);
        });
    }

    /**
     * Get nearby particles using spatial grid - O(1) instead of O(n)
     */
    getNearbyParticles(particle) {
        const key = this.getGridKey(particle.x, particle.y);
        const nearby = [];

        // Check current cell and 8 surrounding cells
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const cellX = Math.floor(particle.x / this.gridSize) + dx;
                const cellY = Math.floor(particle.y / this.gridSize) + dy;
                const cellKey = `${cellX},${cellY}`;

                if (this.grid.has(cellKey)) {
                    nearby.push(...this.grid.get(cellKey));
                }
            }
        }

        return nearby;
    }

    animate = () => {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (!this.width || !this.height) return;

        // Update physics
        this.particles.forEach(p => {
            // Velocity
            p.vx *= this.friction;
            p.vy *= this.friction;
            p.vy += this.gravity;

            // Position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off walls
            if (p.x - p.radius < 0 || p.x + p.radius > this.width) {
                p.vx *= -this.bounceElasticity;
                p.x = Math.max(p.radius, Math.min(this.width - p.radius, p.x));
            }

            if (p.y - p.radius < 0 || p.y + p.radius > this.height) {
                p.vy *= -this.bounceElasticity;
                p.y = Math.max(p.radius, Math.min(this.height - p.radius, p.y));
            }
        });

        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Rebuild spatial grid
        this.buildGrid();

        // Draw connections using spatial grid - O(n) not O(n²)
        this.particles.forEach((p) => {
            const nearby = this.getNearbyParticles(p);

            nearby.forEach(nearbyIndex => {
                if (nearbyIndex <= this.particles.indexOf(p)) return; // Avoid duplicate lines

                const other = this.particles[nearbyIndex];
                const dx = other.x - p.x;
                const dy = other.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDistance) {
                    const opacity = 1 - dist / this.connectionDistance;
                    this.ctx.strokeStyle = `rgba(255, 107, 61, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            });
        });

        // Draw particles
        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Glow
            this.ctx.fillStyle = `${p.color}33`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    };

    emitParticles(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random();

            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 2 + 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                life: 1
            });
        }

        // Keep particle count bounded
        if (this.particles.length > this.particleCount * 2) {
            this.particles.splice(0, this.particles.length - this.particleCount);
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.canvas.remove();
    }

    initializeParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                life: 1,
                isConnected: false
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.setCanvasSize();
            // Reinitialize particles on resize to fit new bounds
            this.particles.forEach(p => {
                p.x = Math.max(0, Math.min(p.x, this.width));
                p.y = Math.max(0, Math.min(p.y, this.height));
            });
        });

        // Mouse interaction
        let mouseX = this.width / 2;
        let mouseY = this.height / 2;

        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            // Attract nearby particles
            this.particles.forEach(p => {
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    const force = (1 - dist / 200) * 0.5;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }
            });
        });
    }

    /**
     * Spatial Grid Hash - Convert (x, y) to grid cell key
     * O(1) lookup for nearby particles
     */
    getGridKey(x, y) {
        const cellX = Math.floor(x / this.gridSize);
        const cellY = Math.floor(y / this.gridSize);
        return `${cellX},${cellY}`;
    }

    /**
     * Build spatial grid for O(n) neighbor detection
     */
    buildGrid() {
        this.grid.clear();

        this.particles.forEach((p, index) => {
            const key = this.getGridKey(p.x, p.y);
            if (!this.grid.has(key)) {
                this.grid.set(key, []);
            }
            this.grid.get(key).push(index);
        });
    }

    /**
     * Get nearby particles using spatial grid - O(1) instead of O(n)
     */
    getNearbyParticles(particle) {
        const key = this.getGridKey(particle.x, particle.y);
        const nearby = [];

        // Check current cell and 8 surrounding cells
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const cellX = Math.floor(particle.x / this.gridSize) + dx;
                const cellY = Math.floor(particle.y / this.gridSize) + dy;
                const cellKey = `${cellX},${cellY}`;

                if (this.grid.has(cellKey)) {
                    nearby.push(...this.grid.get(cellKey));
                }
            }
        }

        return nearby;
    }

    animate = () => {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Update physics
        this.particles.forEach(p => {
            // Velocity
            p.vx *= this.friction;
            p.vy *= this.friction;
            p.vy += this.gravity;

            // Position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off walls
            if (p.x - p.radius < 0 || p.x + p.radius > this.width) {
                p.vx *= -this.bounceElasticity;
                p.x = Math.max(p.radius, Math.min(this.width - p.radius, p.x));
            }

            if (p.y - p.radius < 0 || p.y + p.radius > this.height) {
                p.vy *= -this.bounceElasticity;
                p.y = Math.max(p.radius, Math.min(this.height - p.radius, p.y));
            }
        });

        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Rebuild spatial grid
        this.buildGrid();

        // Draw connections using spatial grid - O(n) not O(n²)
        this.particles.forEach((p) => {
            const nearby = this.getNearbyParticles(p);

            nearby.forEach(nearbyIndex => {
                if (nearbyIndex <= this.particles.indexOf(p)) return; // Avoid duplicate lines

                const other = this.particles[nearbyIndex];
                const dx = other.x - p.x;
                const dy = other.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDistance) {
                    const opacity = 1 - dist / this.connectionDistance;
                    this.ctx.strokeStyle = `rgba(255, 107, 61, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            });
        });

        // Draw particles
        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Glow
            this.ctx.fillStyle = `${p.color}33`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    };

    emitParticles(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random();

            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 2 + 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                life: 1
            });
        }

        // Keep particle count bounded
        if (this.particles.length > this.particleCount * 2) {
            this.particles.splice(0, this.particles.length - this.particleCount);
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.canvas.remove();
    }
}

export default ParticleSystem;

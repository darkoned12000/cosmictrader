// Performance monitoring for Cosmic Trader
// ES6 Module exports

export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            memoryUsage: 0,
            fps: 0,
            frameCount: 0,
            lastTime: performance.now()
        };
        this.isVisible = false;
        this.displayElement = null;
    }

    // Initialize performance monitoring
    init() {
        // Measure initial load time
        this.metrics.loadTime = performance.now();

        // Create performance display (hidden by default)
        this.createDisplay();

        // Start FPS monitoring
        this.startFPSMonitor();

        // Monitor memory usage (if available)
        if (performance.memory) {
            this.startMemoryMonitor();
        }

        console.log('🚀 Performance Monitor initialized');
    }

    // Create the performance display UI
    createDisplay() {
        this.displayElement = document.createElement('div');
        this.displayElement.id = 'performance-monitor';
        this.displayElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0f0;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            border: 1px solid #0f0;
            border-radius: 5px;
            z-index: 10000;
            display: none;
            max-width: 250px;
        `;

        this.displayElement.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🚀 Performance Monitor</div>
            <div id="perf-load-time">Load Time: -- ms</div>
            <div id="perf-memory">Memory: -- MB</div>
            <div id="perf-fps">FPS: --</div>
            <div id="perf-frame-time">Frame Time: -- ms</div>
            <button id="perf-toggle" style="margin-top: 5px; background: #004400; color: #0f0; border: 1px solid #0f0; cursor: pointer;">Toggle</button>
        `;

        document.body.appendChild(this.displayElement);

        // Add toggle functionality
        document.getElementById('perf-toggle').onclick = () => this.toggle();
    }

    // Toggle visibility of performance monitor
    toggle() {
        this.isVisible = !this.isVisible;
        this.displayElement.style.display = this.isVisible ? 'block' : 'none';
    }

    // Start FPS monitoring
    startFPSMonitor() {
        const updateFPS = () => {
            const now = performance.now();
            const delta = now - this.metrics.lastTime;
            this.metrics.frameCount++;

            // Update every second
            if (delta >= 1000) {
                this.metrics.fps = Math.round((this.metrics.frameCount * 1000) / delta);
                this.metrics.frameCount = 0;
                this.metrics.lastTime = now;

                this.updateDisplay();
            }

            requestAnimationFrame(updateFPS);
        };

        requestAnimationFrame(updateFPS);
    }

    // Start memory monitoring
    startMemoryMonitor() {
        setInterval(() => {
            if (performance.memory) {
                this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                this.updateDisplay();
            }
        }, 1000);
    }

    // Update the display with current metrics
    updateDisplay() {
        if (!this.isVisible) return;

        const loadTimeEl = document.getElementById('perf-load-time');
        const memoryEl = document.getElementById('perf-memory');
        const fpsEl = document.getElementById('perf-fps');

        if (loadTimeEl) loadTimeEl.textContent = `Load Time: ${Math.round(this.metrics.loadTime)} ms`;
        if (memoryEl) memoryEl.textContent = `Memory: ${this.metrics.memoryUsage} MB`;
        if (fpsEl) fpsEl.textContent = `FPS: ${this.metrics.fps}`;
    }

    // Get current performance metrics
    getMetrics() {
        return { ...this.metrics };
    }

    // Log performance to console
    logMetrics() {
        console.log('📊 Performance Metrics:', this.metrics);
    }
}

// Create global instance
export const perfMonitor = new PerformanceMonitor();

// Make toggle accessible via console
if (typeof window !== 'undefined') {
    window.perfMonitor = perfMonitor;
}
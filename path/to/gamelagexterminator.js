// gamelagexterminator.js

// Initialize the game performance optimizer
class GameLagExterminator {
    constructor() {
        this.initPerformanceOptimization();
        this.scheduleCacheClearing();
    }

    // Method to initialize performance optimization
    initPerformanceOptimization() {
        // Use requestAnimationFrame for smoother rendering
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

        // Optimize event listeners
        this.optimizeEventListeners();

        // Reduce rendering complexity
        this.reduceRenderingComplexity();

        // Clear cache every 10 minutes (600000 milliseconds)
        setInterval(() => {
            this.clearCache();
        }, 600000);
    }

    // Method to optimize event listeners
    optimizeEventListeners() {
        const optimizedResize = (callback) => {
            let running = false;
            const resizeCallback = () => {
                if (!running) {
                    running = true;
                    if (window.requestAnimationFrame) {
                        window.requestAnimationFrame(() => {
                            callback();
                            running = false;
                        });
                    } else {
                        setTimeout(() => {
                            callback();
                            running = false;
                        }, 66);
                    }
                }
            };
            window.addEventListener('resize', resizeCallback);
        };

        optimizedResize(() => {
            // Resize handling code here
            map.invalidateSize();
        });
    }

    // Method to reduce rendering complexity
    reduceRenderingComplexity() {
        // Example: Remove off-screen elements
        const elements = document.querySelectorAll('.game-element');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                el.style.display = 'none';
            } else {
                el.style.display = 'block';
            }
        });

        // Optimize canvas rendering
        if (window.devicePixelRatio > 1) {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const scale = window.devicePixelRatio;
                canvas.width = canvas.clientWidth * scale;
                canvas.height = canvas.clientHeight * scale;
                ctx.scale(scale, scale);
            }
        }
    }

    // Method to clear cache
    clearCache() {
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName);
                });
            });
        }

        if (navigator.serviceWorker) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister();
                });
            });
        }

        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();
    }

    // Method to schedule cache clearing
    scheduleCacheClearing() {
        // Clear cache immediately on script load
        this.clearCache();

        // Clear cache every 10 minutes (600000 milliseconds)
        setInterval(() => {
            this.clearCache();
        }, 600000);
    }
}

// Instantiate the GameLagExterminator
new GameLagExterminator();
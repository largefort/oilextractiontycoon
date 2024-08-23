// Create a full-screen canvas for particle effects
const particleCanvas = document.createElement('canvas');
particleCanvas.style.position = 'fixed';
particleCanvas.style.top = '0';
particleCanvas.style.left = '0';
particleCanvas.style.pointerEvents = 'none';
particleCanvas.style.zIndex = '10000';
document.body.appendChild(particleCanvas);

const ctx = particleCanvas.getContext('2d');

// Resize canvas to fit the screen
function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial call to set canvas size

// Function to handle touch and click events
function handleTap(x, y) {
    createTouchParticle(x, y);
}

// Add touch-specific interactions with visual feedback
document.addEventListener('touchstart', function(event) {
    const touch = event.touches[0];
    handleTap(touch.clientX, touch.clientY);
});

// Add click-specific interactions with visual feedback
document.addEventListener('click', function(event) {
    handleTap(event.clientX, event.clientY);
});

// Function to create touch particle effect
function createTouchParticle(x, y) {
    const particles = [];
    const particleCount = 30;
    const colors = ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.3)'];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            radius: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            life: 100
        });
    }

    function animate() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        particles.forEach((particle, index) => {
            if (particle.life > 0) {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                particle.x += particle.dx;
                particle.y += particle.dy;
                particle.radius *= 0.96;
                particle.life -= 2;

                if (particle.radius < 0.5) {
                    particles.splice(index, 1);
                }
            }
        });

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

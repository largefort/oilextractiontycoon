document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('clouds');
    const ctx = canvas.getContext('2d');

    const clouds = [];
    const numClouds = 5;

    for (let i = 0; i < numClouds; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 0.5 + Math.random(),
            size: 50 + Math.random() * 100
        });
    }

    function drawCloud(cloud) {
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size / 2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    function updateCloud(cloud) {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.size > canvas.width) {
            cloud.x = -cloud.size;
            cloud.y = Math.random() * canvas.height;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        clouds.forEach(cloud => {
            drawCloud(cloud);
            updateCloud(cloud);
        });

        requestAnimationFrame(draw);
    }

    draw();
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let t = 0;
let trail = [];

function animate() {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  // Soft fade (don't clear completely)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, w, h);

  // Sun position (fixed at center)
  const sunX = cx;
  const sunY = cy;

  // Earth orbits Sun
  const earthDist = 100;
  const earthTheta = t * 0.01;
  const earthX = cx + earthDist * Math.cos(earthTheta);
  const earthY = cy + earthDist * Math.sin(earthTheta);

  // Moon orbits Earth
  const moonDist = 40;
  const moonTheta = t * 0.1;
  const moonX = earthX + moonDist * Math.cos(moonTheta);
  const moonY = earthY + moonDist * Math.sin(moonTheta);

  // Store Moon point for trail
  trail.push({ x: moonX, y: moonY });
  if (trail.length > 5000) trail.shift(); // Keep last 5000 points

  // Draw Moon trail
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < trail.length; i++) {
    if (i === 0) ctx.moveTo(trail[i].x, trail[i].y);
    else ctx.lineTo(trail[i].x, trail[i].y);
  }
  ctx.stroke();

  // Draw Sun-Earth line
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(earthX, earthY);
  ctx.stroke();

  // Draw Earth-Moon line
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  // Draw dots
  // Sun (yellow)
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Earth (blue)
  ctx.fillStyle = '#00aaff';
  ctx.beginPath();
  ctx.arc(earthX, earthY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Moon (white)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(moonX, moonY, 2, 0, Math.PI * 2);
  ctx.fill();

  t++;
  requestAnimationFrame(animate);
}

animate();

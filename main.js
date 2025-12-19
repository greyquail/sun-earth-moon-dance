const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let t = 0;
let lastMoonX = canvas.width / 2;
let lastMoonY = canvas.height / 2;

function animate() {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  // Fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, w, h);

  // Sun position (center)
  const sunX = cx;
  const sunY = cy;

  // Earth orbit around Sun
  const earthRadius = 120;
  const earthSpeed = 0.005;
  const earthAngle = t * earthSpeed;
  const earthX = cx + earthRadius * Math.cos(earthAngle);
  const earthY = cy + earthRadius * Math.sin(earthAngle);

  // Moon orbit around Earth
  const moonRadius = 35;
  const moonSpeed = 0.08;
  const moonAngle = t * moonSpeed;
  const moonX = earthX + moonRadius * Math.cos(moonAngle);
  const moonY = earthY + moonRadius * Math.sin(moonAngle);

  // Draw connecting lines
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(earthX, earthY);
  ctx.stroke();

  ctx.strokeStyle = '#666';
  ctx.beginPath();
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  // Draw Moon trail
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lastMoonX, lastMoonY);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  // Draw point dots
  // Sun
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Earth
  ctx.fillStyle = '#00aaff';
  ctx.beginPath();
  ctx.arc(earthX, earthY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Moon
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(moonX, moonY, 2, 0, Math.PI * 2);
  ctx.fill();

  lastMoonX = moonX;
  lastMoonY = moonY;

  t++;
  requestAnimationFrame(animate);
}

animate();

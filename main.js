const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', resize);
resize();

let t = 0;
let lastMoon = { x: 0, y: 0 };

function animate() {
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  const cx = w / 2;
  const cy = h / 2;

  // Fade slightly
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, w, h);

  // Sun
  const sunX = cx;
  const sunY = cy;

  // Earth orbit
  const earthR = Math.min(w, h) * 0.2;
  const earthAngle = t * 0.008;
  const earthX = sunX + earthR * Math.cos(earthAngle);
  const earthY = sunY + earthR * Math.sin(earthAngle);

  // Moon orbit
  const moonR = earthR * 0.3;
  const moonAngle = t * 0.12;
  const moonX = earthX + moonR * Math.cos(moonAngle);
  const moonY = earthY + moonR * Math.sin(moonAngle);

  // Lines
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(earthX, earthY);
  ctx.stroke();

  ctx.strokeStyle = '#555';
  ctx.beginPath();
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  // Moon trail
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lastMoon.x, lastMoon.y);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  lastMoon.x = moonX;
  lastMoon.y = moonY;

  // Dots
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#00aaff';
  ctx.beginPath();
  ctx.arc(earthX, earthY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(moonX, moonY, 1.5, 0, Math.PI * 2);
  ctx.fill();

  t++;
  requestAnimationFrame(animate);
}

animate();

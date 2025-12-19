const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;

  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

let t = 0;
const trail = [];

const YEAR_SPEED  = 0.02;              // much faster
const MONTH_SPEED = YEAR_SPEED * 12.37; // irrational ratio

function animate() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const cx = w / 2;
  const cy = h / 2;

  // very light fade -> keeps old lines, but slowly ghosts them
  ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
  ctx.fillRect(0, 0, w, h);

  // Sun at center
  const sunX = cx;
  const sunY = cy;

  // Big orbit radius so pattern fills screen
  const earthR = Math.min(w, h) * 0.35;
  const earthTheta = t * YEAR_SPEED;
  const earthX = sunX + earthR * Math.cos(earthTheta);
  const earthY = sunY + earthR * Math.sin(earthTheta);

  // Moon orbit
  const moonR = earthR * 0.35;
  const moonTheta = t * MONTH_SPEED;
  const moonX = earthX + moonR * Math.cos(moonTheta);
  const moonY = earthY + moonR * Math.sin(moonTheta);

  // store trail
  trail.push({ x: moonX, y: moonY });
  if (trail.length > 20000) trail.shift(); // long trail for dense pattern

  // draw trail as one continuous curve
  ctx.strokeStyle = 'rgba(210, 160, 255, 0.9)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < trail.length; i++) {
    const p = trail[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // rods
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(80, 80, 110, 0.8)';
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(earthX, earthY);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(140, 110, 180, 0.9)';
  ctx.beginPath();
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  // bodies
  dot(sunX,  sunY,  5, '#ffdd33');
  dot(earthX, earthY, 3.5, '#33ffd5');
  dot(moonX, moonY,  2.3, '#ffffff');

  t += 1;
  requestAnimationFrame(animate);
}

function dot(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

animate();

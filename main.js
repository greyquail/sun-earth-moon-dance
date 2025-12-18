const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize);
resize();

// distance ratios from real values: Sun–Earth ≈ 149,600,000 km,
// Earth–Moon ≈ 384,400 km → ~389:1 [web:59][web:10]
const EARTH_MOON = 1;
const SUN_EARTH  = 389;

function unitScale() {
  const minDim = Math.min(innerWidth, innerHeight);
  return (minDim * 0.35) / SUN_EARTH;
}

let t = 0;
let lastMoon = null;   // <-- start as null

function draw() {
  const w = innerWidth;
  const h = innerHeight;
  const s = unitScale();

  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;

  const sunX = cx;
  const sunY = cy;

  const yearSpeed  = 0.02;
  const monthSpeed = yearSpeed * 13;

  const thetaE = t * yearSpeed;
  const thetaM = t * monthSpeed;

  const earthR = SUN_EARTH * s;
  const moonR  = EARTH_MOON * s * 10;

  const earthX = sunX + earthR * Math.cos(thetaE);
  const earthY = sunY + earthR * Math.sin(thetaE);

  const moonX  = earthX + moonR * Math.cos(thetaM);
  const moonY  = earthY + moonR * Math.sin(thetaM);

  ctx.lineWidth = 1.2;

  // Sun → Earth
  ctx.strokeStyle = '#555';
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(earthX, earthY);
  ctx.stroke();

  // Earth → Moon
  ctx.strokeStyle = '#777';
  ctx.beginPath();
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  // Moon trail (only if we have a previous point)
  if (!lastMoon) {
    lastMoon = { x: moonX, y: moonY };
  }
  ctx.strokeStyle = '#ddd';
  ctx.beginPath();
  ctx.moveTo(lastMoon.x, lastMoon.y);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();
  lastMoon.x = moonX;
  lastMoon.y = moonY;

  drawDot(sunX,   sunY,   4, '#ffaa33');
  drawDot(earthX, earthY, 3, '#33aaff');
  drawDot(moonX,  moonY,  2, '#cccccc');

  t += 1;
  requestAnimationFrame(draw);
}

function drawDot(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

requestAnimationFrame(draw);

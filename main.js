const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

let t = 0;
let lastMoon = null;   // last point for trail

function animate() {
  const w = innerWidth;
  const h = innerHeight;
  const cx = w / 2;
  const cy = h / 2;

  // no fade: keep all lines → proper “drawing”
  // comment these two lines if you want soft fading instead
  // ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  // ctx.fillRect(0, 0, w, h);

  // Sun (center)
  const sunX = cx;
  const sunY = cy;

  // Earth orbit
  const earthR = Math.min(w, h) * 0.25;
  const earthSpeed = 0.01;
  const earthAngle = t * earthSpeed;
  const earthX = sunX + earthR * Math.cos(earthAngle);
  const earthY = sunY + earthR * Math.sin(earthAngle);

  // Moon orbit
  const moonR = earthR * 0.25;
  const moonSpeed = earthSpeed * 12;
  const moonAngle = t * moonSpeed;
  const moonX = earthX + moonR * Math.cos(moonAngle);
  const moonY = earthY + moonR * Math.sin(moonAngle);

  // sharp strokes
  ctx.lineWidth = 1.2;

  // Sun–Earth
  ctx.strokeStyle = '#444';
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(earthX, earthY);
  ctx.stroke();

  // Earth–Moon
  ctx.strokeStyle = '#777';
  ctx.beginPath();
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  // Moon trail: continuous curve (this is the “drawing”)
  if (!lastMoon) lastMoon = { x: moonX, y: moonY };
  ctx.strokeStyle = '#ddd';
  ctx.beginPath();
  ctx.moveTo(lastMoon.x, lastMoon.y);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();
  lastMoon.x = moonX;
  lastMoon.y = moonY;

  // dots
  dot(sunX,  sunY,  3.5, '#ffaa33'); // Sun
  dot(earthX,earthY,2.5, '#33aaff'); // Earth
  dot(moonX, moonY, 2.0, '#ffffff'); // Moon

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

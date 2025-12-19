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

// ----- logical coordinates (unit space, independent of pixels) -----
let t = 0;
const trail = []; // stores logical (x,y) in [-1,1] space

const YEAR_SPEED  = 0.02;
const MONTH_SPEED = YEAR_SPEED * 12.37;

function stepLogic() {
  // Sun at origin (0,0) in logical space
  const earthR = 0.6;          // large circle radius in logical units
  const moonR  = 0.3;          // moon radius in logical units

  const earthTheta = t * YEAR_SPEED;
  const moonTheta  = t * MONTH_SPEED;

  const earthX = earthR * Math.cos(earthTheta);
  const earthY = earthR * Math.sin(earthTheta);

  const moonX  = earthX + moonR * Math.cos(moonTheta);
  const moonY  = earthY + moonR * Math.sin(moonTheta);

  trail.push({ ex: earthX, ey: earthY, mx: moonX, my: moonY });
  if (trail.length > 20000) trail.shift();

  t += 1;
}

// map logical [-1,1] to screen pixels
function toScreen(x, y) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const s = Math.min(w, h) * 0.45; // scale
  const cx = w / 2;
  const cy = h / 2;
  return {
    x: cx + x * s,
    y: cy + y * s
  };
}

function render() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // gentle fade
  ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
  ctx.fillRect(0, 0, w, h);

  if (trail.length === 0) {
    requestAnimationFrame(loop);
    return;
  }

  // Sun at origin
  const sun = toScreen(0, 0);

  // draw trail of moon only
  ctx.strokeStyle = 'rgba(210,160,255,0.9)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  trail.forEach((p, i) => {
    const s = toScreen(p.mx, p.my);
    if (i === 0) ctx.moveTo(s.x, s.y);
    else ctx.lineTo(s.x, s.y);
  });
  ctx.stroke();

  // latest earth and moon for rods + dots
  const latest = trail[trail.length - 1];
  const earth = toScreen(latest.ex, latest.ey);
  const moon  = toScreen(latest.mx, latest.my);

  // rods
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(80,80,110,0.8)';
  ctx.beginPath();
  ctx.moveTo(sun.x, sun.y);
  ctx.lineTo(earth.x, earth.y);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(140,110,180,0.9)';
  ctx.beginPath();
  ctx.moveTo(earth.x, earth.y);
  ctx.lineTo(moon.x, moon.y);
  ctx.stroke();

  // dots
  dot(sun.x,  sun.y,  5, '#ffdd33');
  dot(earth.x, earth.y, 3.5, '#33ffd5');
  dot(moon.x,  moon.y,  2.3, '#ffffff');
}

function dot(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  stepLogic(); // update in logical space (zoom‑proof)
  render();    // draw to current screen size
  requestAnimationFrame(loop);
}

loop();

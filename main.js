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

// --- scale constants (true-ish ratios) ---
// Use Earth–Moon distance = 1 unit, Sun distance ≈ 389 units [web:59][web:10]
const EARTH_MOON = 1;
const SUN_EARTH  = 389;

// visual scale: how many pixels per unit (auto from screen)
function unitScale() {
  const minDim = Math.min(innerWidth, innerHeight);
  // keep whole system on screen: sun near center, earth + moon dancing around
  return (minDim * 0.35) / SUN_EARTH;
}

let t = 0;

function draw() {
  const w = innerWidth;
  const h = innerHeight;
  const s = unitScale();

  // soft fade so old paths stay but slowly ghost out
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;

  // center = Sun
  const sunX = cx;
  const sunY = cy;

  // Earth angle and Moon angle (period ratios ~ realistic: Moon ~13 orbits/year)
  const yearSpeed = 0.02;        // Earth around Sun (art speed)
  const monthSpeed = yearSpeed * 13; // Moon around Earth

  const thetaE = t * yearSpeed;
  const thetaM = t * monthSpeed;

  const earthR = SUN_EARTH * s;
  const moonR  = EARTH_MOON * s * 10; // boosted so it’s visible but keeps ratio in code

  // Earth position
  const earthX = sunX + earthR * Math.cos(thetaE);
  const earthY = sunY + earthR * Math.sin(thetaE);

  // Moon position (orbiting Earth)
  const moonX = earthX + moonR * Math.cos(thetaM);
  const moonY = earthY + moonR * Math.sin(thetaM);

  // --- geometry dance: just lines and points ---

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

  // trailing path of the Moon only
  ctx.strokeStyle = '#ddd';
  ctx.beginPath();
  ctx.moveTo(lastMoon.x, lastMoon.y);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  // points
  drawDot(sunX,   sunY,   4, '#ffaa33'); // Sun
  drawDot(earthX, earthY, 3, '#33aaff'); // Earth
  drawDot(moonX,  moonY,  2, '#cccccc'); // Moon

  // remember last Moon point
  lastMoon.x = moonX;
  lastMoon.y = moonY;

  t += 1;
  requestAnimationFrame(draw);
}

// init lastMoon at start
const lastMoon = { x: innerWidth / 2, y: innerHeight / 2 };

function drawDot(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

requestAnimationFrame(draw);

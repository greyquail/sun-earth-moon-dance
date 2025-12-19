const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let t = 0;
let trail = [];

// Irrational frequency ratio: creates patterns that never close
// Using √2 ≈ 1.414... so the pattern evolves infinitely
const YEAR_SPEED = 0.001;           // Earth around Sun (slow)
const MONTH_SPEED = YEAR_SPEED * 12.37;  // Moon around Earth (irrational multiple of year)

function animate() {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  // Very slow fade so pattern builds but old trails ghost out gradually
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  ctx.fillRect(0, 0, w, h);

  // Sun (fixed at center)
  const sunX = cx;
  const sunY = cy;

  // Earth orbits Sun with year period
  const earthR = Math.min(w, h) * 0.22;
  const earthTheta = t * YEAR_SPEED;
  const earthX = cx + earthR * Math.cos(earthTheta);
  const earthY = cy + earthR * Math.sin(earthTheta);

  // Moon orbits Earth with month period (irrational ratio means pattern never closes)
  const moonR = earthR * 0.28;
  const moonTheta = t * MONTH_SPEED;
  const moonX = earthX + moonR * Math.cos(moonTheta);
  const moonY = earthY + moonR * Math.sin(moonTheta);

  // Store Moon position for infinite trail
  trail.push({ x: moonX, y: moonY });
  // Keep only last 8000 points so animation stays smooth
  if (trail.length > 8000) trail.shift();

  // Draw the infinite trail (this creates the mesmerizing pattern)
  ctx.strokeStyle = 'rgba(200, 150, 255, 0.8)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  for (let i = 0; i < trail.length; i++) {
    const p = trail[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Draw connecting lines (the dancing mechanism)
  // Sun—Earth
  ctx.strokeStyle = 'rgba(100, 100, 120, 0.6)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(earthX, earthY);
  ctx.stroke();

  // Earth—Moon
  ctx.strokeStyle = 'rgba(150, 120, 180, 0.6)';
  ctx.beginPath();
  ctx.moveTo(earthX, earthY);
  ctx.lineTo(moonX, moonY);
  ctx.stroke();

  // Draw the three bodies
  // Sun (large golden)
  ctx.fillStyle = '#ffdd00';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Earth (medium cyan)
  ctx.fillStyle = '#00ffcc';
  ctx.beginPath();
  ctx.arc(earthX, earthY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Moon (small white, always draws at the tip)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(moonX, moonY, 2, 0, Math.PI * 2);
  ctx.fill();

  t++;
  requestAnimationFrame(animate);
}

animate();

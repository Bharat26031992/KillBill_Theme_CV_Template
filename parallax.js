document.addEventListener('DOMContentLoaded', () => {
  console.log("REVENGE SYSTEM ONLINE");

  // ─── CONFIGURATION & CINEMATIC CONSTANTS ───
  const maxTilt = 2; // Increased for more dramatic effect
  const transition = 'transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
  const gridSpacing = 80;      
  const slashRadius = 400;     
  const slashStrength = 60;    
  const gridOpacity = 1.0;     // Bold black lines

  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let drifters = [], splatters = [], deathNames = [];

  // ─── 1. SELF-INJECT KILL BILL STYLES ───
  const style = document.createElement('style');
  style.textContent = `
    #bg-canvas {
      position: fixed;
      top: -10%; left: -10%;
      width: 120%; height: 120%;
      z-index: -999;
      background: #fde000; /* Iconic Kill Bill Yellow */
      pointer-events: none;
    }
    body { background-color: #fde000 !important; }
  `;
  document.head.appendChild(style);

  // ─── 2. CANVAS INITIALIZATION ───
  let canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const initScene = () => {
    canvas.width = window.innerWidth * 1.2;
    canvas.height = window.innerHeight * 1.2;
    
    // Death List Five - Drifting Names
    const targets = ["O-REN ISHII", "VERNITA GREEN", "BUDD", "ELLE DRIVER", "BILL"];
    deathNames = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      text: targets[Math.floor(Math.random() * targets.length)],
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1
    }));

    // Floating Kanji/Petals (Samurai Aesthetic)
    drifters = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.8 + 0.2,
      type: Math.random() > 0.5 ? 'petal' : 'kanji'
    }));
  };

  // ─── 3. CORE DRAWING ───

  function drawKatanaGrid() {
    ctx.strokeStyle = `rgba(0, 0, 0, ${gridOpacity})`;
    ctx.lineWidth = 2;

    // The grid warps as if sliced by a katana (mouse)
    for (let x = 0; x <= canvas.width; x += gridSpacing) {
      ctx.beginPath();
      for (let y = 0; y <= canvas.height; y += 30) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const warp = dist < slashRadius ? (1 - dist / slashRadius) * slashStrength : 0;
        
        const moveX = (dx / dist || 0) * warp;
        ctx.lineTo(x + moveX, y + (dy / dist || 0) * warp);
      }
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSpacing) {
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += 30) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const warp = dist < slashRadius ? (1 - dist / slashRadius) * slashStrength : 0;

        ctx.lineTo(x + (dx / dist || 0) * warp, y + (dy / dist || 0) * warp);
      }
      ctx.stroke();
    }
  }

  function drawBloodSplatters() {
    // 0.5% chance to "spill blood" on the grid
    if (Math.random() < 0.005) { 
      splatters.push({ 
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height, 
        r: Math.random() * 30 + 10, 
        a: 0.8 
      });
    }
    
    splatters.forEach((s, i) => {
      s.a -= 0.005;
      if (s.a <= 0) splatters.splice(i, 1);
      
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(204, 0, 0, ${s.a})`; // Blood Red
      ctx.fill();
    });
  }

  function animate() {
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background remains solid yellow, grid warps over it
    drawKatanaGrid();
    drawBloodSplatters();

    // Drifting Death List Names
    ctx.font = "bold 14px 'Oswald', sans-serif";
    deathNames.forEach(n => {
      n.y -= n.speed;
      if (n.y < -20) n.y = canvas.height + 20;
      ctx.fillStyle = `rgba(0, 0, 0, ${n.opacity})`;
      ctx.fillText(n.text, n.x, n.y);
    });

    // Drifting Particles (Petals/Debris)
    drifters.forEach(p => {
      p.y += p.speed;
      p.x += Math.sin(p.y / 50);
      if (p.y > canvas.height) p.y = -10;
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  // ─── 4. PARALLAX & TILT ───
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;

    const xVal = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const yVal = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    const layers = [
      { el: document.querySelector('.lab-card'), depth: 1.0 },
      { el: document.querySelector('.module-title'), depth: 0.5 },
      { el: document.getElementById('jukebox-card'), depth: 1.2 }
    ];

    layers.forEach(({ el, depth }) => {
      if (!el) return;
      const rotX = yVal * maxTilt * depth;
      const rotY = -xVal * maxTilt * depth;
      const moveX = xVal * 30 * depth;
      const moveY = yVal * 30 * depth;

      el.style.transition = transition;
      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });

  window.addEventListener('resize', initScene);
  initScene();
  animate();
});
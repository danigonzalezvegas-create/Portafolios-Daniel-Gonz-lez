// ===== INTRO: solo la primera vez en la sesión =====
const intro = document.getElementById('wii-intro');
if (intro) {
  const yaVisto = sessionStorage.getItem('wii-intro-visto');
  if (yaVisto) {
    // Ya entró antes — quitamos la intro sin animación
    intro.style.display = 'none';
  } else {
    // Primera vez — la mostramos y marcamos
    sessionStorage.setItem('wii-intro-visto', 'true');
  }
}

// ===== RELOJ REAL =====
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const hStr = String(h).padStart(2, '0');

  const dias  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const dia   = dias[now.getDay()];
  const fecha = `${dia} ${now.getDate()}/${now.getMonth() + 1}`;

  const cl = document.getElementById('footer-clock');
  const ap = document.getElementById('footer-ampm');
  const dt = document.getElementById('footer-date');
  if (cl) cl.textContent = `${hStr}:${m}`;
  if (ap) ap.textContent = ampm;
  if (dt) dt.textContent = fecha;
}
updateClock();
setInterval(updateClock, 1000);

// ===== SONIDO HOVER =====
function playHover() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(680, ctx.currentTime);
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    o.start(); o.stop(ctx.currentTime + 0.08);
  } catch(e) {}
}

// ===== SONIDO CLICK =====
function playClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.14, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.start(); o.stop(ctx.currentTime + 0.2);
  } catch(e) {}
}

// ===== RIPPLE =====
function spawnRipple(btn, e) {
  const rect = btn.getBoundingClientRect();
  const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left;
  const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top;
  const r = document.createElement('span');
  r.style.cssText = `
    position:absolute;border-radius:50%;
    width:60px;height:60px;
    background:rgba(74,158,224,0.25);
    transform:translate(-50%,-50%) scale(0);
    animation:rippleAnim 0.45s ease-out forwards;
    left:${x}px;top:${y}px;
    pointer-events:none;z-index:10;
  `;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 460);
}

// ===== EVENTOS CELDAS =====
const cells = document.querySelectorAll('.wii-cell:not(.wii-cell--empty)');

cells.forEach(cell => {
  cell.addEventListener('mouseenter', playHover);
  cell.addEventListener('click', (e) => {
    playClick();
    spawnRipple(cell, e);
  });
});

// ===== NAVEGACIÓN TECLADO =====
const navCells = Array.from(cells);
let idx = -1;

document.addEventListener('keydown', (e) => {
  if (!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Enter'].includes(e.key)) return;
  e.preventDefault();

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    idx = (idx + 1) % navCells.length;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    idx = (idx - 1 + navCells.length) % navCells.length;
  } else if (e.key === 'Enter' && idx >= 0) {
    playClick();
    spawnRipple(navCells[idx], {});
    navCells[idx].click();
    return;
  }
  navCells[idx].focus();
  playHover();
});

// ===== CURSOR PERSONALIZADO CON IMAGEN =====
const cur = document.createElement('div');
cur.style.cssText = `
  position:fixed;pointer-events:none;z-index:9999;
  display:none;transform:translate(-4px, -4px);
`;
cur.innerHTML = `<img src="./imagenes/cursor.png" width="48" height="48" style="display:block;"/>`;
document.body.appendChild(cur);

document.addEventListener('mousemove', (e) => {
  cur.style.display = 'block';
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => { cur.style.display = 'none'; });

// SobreMi
// ===== NAVEGACIÓN CON TRANSICIÓN (solo al ir hacia adelante) =====
document.querySelectorAll('.wii-cell:not(.wii-cell--empty)').forEach(cell => {
  cell.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href !== '#') {
      e.preventDefault();
      // Marcamos que venimos de una navegación intencional
      sessionStorage.setItem('wii-nav', 'true');
      document.body.style.transition = 'opacity 0.35s ease';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 360);
    }
  });
});

// ===== MÚSICA AMBIENTE WII (suave, loop continuo) =====
let wiiCtx = null;
let wiiNodes = [];
let wiiPlaying = false;
let wiiMusicStarted = false;

function startWiiMusic() {
  if (wiiPlaying) return;
  wiiCtx = new (window.AudioContext || window.webkitAudioContext)();
  wiiPlaying = true;

  // Master gain con fade in
  const master = wiiCtx.createGain();
  master.gain.setValueAtTime(0, wiiCtx.currentTime);
  master.gain.linearRampToValueAtTime(0.10, wiiCtx.currentTime + 3);
  master.connect(wiiCtx.destination);
  wiiNodes.push(master);

  // --- PAD AMBIENTAL: acordes suaves que sostienen todo ---
  const padNotas = [
    { freq: 233.08, vol: 0.14 }, // Bb3
    { freq: 293.66, vol: 0.10 }, // D4
    { freq: 349.23, vol: 0.09 }, // F4
    { freq: 466.16, vol: 0.07 }, // Bb4
    { freq: 587.33, vol: 0.05 }, // D5
  ];

  padNotas.forEach(({ freq, vol }) => {
    const osc = wiiCtx.createOscillator();
    const g   = wiiCtx.createGain();
    // Vibrato muy suave
    const lfo = wiiCtx.createOscillator();
    const lfoG = wiiCtx.createGain();
    lfo.frequency.value = 0.3;
    lfoG.gain.value = 0.8;
    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);
    lfo.start();

    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = vol;
    osc.connect(g);
    g.connect(master);
    osc.start();
    wiiNodes.push(osc, g, lfo, lfoG);
  });

  // --- MELODÍA PRINCIPAL con loop automático ---
  // Escala: Bb mayor — Bb C D Eb F G A Bb
  // Frecuencias (Hz)
  const scale = {
    Bb3: 233.08, C4: 261.63, D4: 293.66, Eb4: 311.13,
    F4:  349.23, G4: 392.00, A4: 440.00, Bb4: 466.16,
    C5:  523.25, D5: 587.33, Eb5: 622.25, F5: 698.46,
    G5:  783.99, A5: 880.00, Bb5: 932.33,
  };

  // Melodía: [nota, inicio(s), duración(s), volumen]
  const melodia = [
    // Frase 1 — ascendente suave
    [scale.F4,  0.0,  0.4, 0.18],
    [scale.G4,  0.5,  0.4, 0.16],
    [scale.Bb4, 1.0,  0.5, 0.20],
    [scale.A4,  1.6,  0.3, 0.16],
    [scale.G4,  2.0,  0.3, 0.14],
    [scale.F4,  2.4,  0.7, 0.18],

    // Frase 2 — sube más
    [scale.G4,  3.3,  0.4, 0.16],
    [scale.Bb4, 3.8,  0.4, 0.18],
    [scale.C5,  4.3,  0.4, 0.20],
    [scale.D5,  4.8,  0.6, 0.22],
    [scale.C5,  5.5,  0.3, 0.18],
    [scale.Bb4, 5.9,  0.8, 0.20],

    // Frase 3 — cima melódica
    [scale.D5,  6.9,  0.4, 0.20],
    [scale.Eb5, 7.4,  0.4, 0.18],
    [scale.F5,  7.9,  0.5, 0.22],
    [scale.Eb5, 8.5,  0.3, 0.18],
    [scale.D5,  8.9,  0.4, 0.20],
    [scale.C5,  9.4,  0.8, 0.22],

    // Frase 4 — descenso y resolución
    [scale.Bb4, 10.4, 0.4, 0.18],
    [scale.A4,  10.9, 0.3, 0.16],
    [scale.G4,  11.3, 0.3, 0.14],
    [scale.F4,  11.7, 0.4, 0.16],
    [scale.Eb4, 12.2, 0.3, 0.14],
    [scale.D4,  12.6, 0.4, 0.16],
    [scale.C4,  13.1, 0.3, 0.14],
    [scale.Bb3, 13.5, 1.2, 0.18],

    // Frase 5 — eco suave antes del loop
    [scale.F4,  15.0, 0.3, 0.12],
    [scale.G4,  15.4, 0.3, 0.10],
    [scale.Bb4, 15.8, 0.5, 0.14],
    [scale.F4,  16.4, 1.0, 0.12],
  ];

  const LOOP = 17.8; // duración del loop en segundos

  function scheduleLoop(timeOffset) {
    if (!wiiPlaying) return;
    const now = wiiCtx.currentTime;

    melodia.forEach(([freq, t, dur, vol]) => {
      const osc = wiiCtx.createOscillator();
      const g   = wiiCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const s = now + timeOffset + t;
      const e = s + dur;

      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(vol, s + 0.06);
      g.gain.setValueAtTime(vol, e - 0.08);
      g.gain.linearRampToValueAtTime(0, e + 0.05);

      osc.connect(g);
      g.connect(master);
      osc.start(s);
      osc.stop(e + 0.1);
      wiiNodes.push(osc, g);
    });

    // Programa el siguiente loop con crossfade
    setTimeout(() => {
      if (wiiPlaying) scheduleLoop(0);
    }, (timeOffset + LOOP - 1.5) * 1000);
  }

  scheduleLoop(0);

  // --- ARPEGIO SUAVE de fondo (brillo) ---
  const arpegio = [
    scale.Bb4, scale.D5, scale.F5, scale.Bb5,
    scale.A5,  scale.F5, scale.D5, scale.Bb4,
  ];
  let arpIdx = 0;

  function tickArp() {
    if (!wiiPlaying) return;
    const osc = wiiCtx.createOscillator();
    const g   = wiiCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = arpegio[arpIdx % arpegio.length];
    g.gain.setValueAtTime(0.04, wiiCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, wiiCtx.currentTime + 0.5);
    osc.connect(g);
    g.connect(master);
    osc.start();
    osc.stop(wiiCtx.currentTime + 0.5);
    wiiNodes.push(osc, g);
    arpIdx++;
    setTimeout(tickArp, 620);
  }

  setTimeout(tickArp, 1200);
}

function stopWiiMusic() {
  wiiPlaying = false;
  wiiNodes.forEach(n => { try { n.disconnect(); } catch(e){} });
  wiiNodes = [];
  if (wiiCtx) { wiiCtx.close(); wiiCtx = null; }
}

// Arranca con el primer gesto (política del navegador)
function tryStartMusic() {
  if (!wiiMusicStarted) {
    wiiMusicStarted = true;
    const delay = sessionStorage.getItem('wii-intro-visto') ? 400 : 4600;
    setTimeout(startWiiMusic, delay);
  }
}

document.addEventListener('mousemove', tryStartMusic, { once: true });
document.addEventListener('click',     tryStartMusic, { once: true });
document.addEventListener('keydown',   tryStartMusic, { once: true });

// Pausa/reanuda al cambiar de pestaña
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopWiiMusic();
  else if (wiiMusicStarted) startWiiMusic();
});
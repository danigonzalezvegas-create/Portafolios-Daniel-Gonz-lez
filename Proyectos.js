// ===== TRANSICIÓN DE ENTRADA =====
const pryTrans = document.getElementById('pry-transition');
if (pryTrans) {
  const vieneDePagina = sessionStorage.getItem('wii-nav');
  if (vieneDePagina) {
    sessionStorage.removeItem('wii-nav');
  } else {
    pryTrans.style.display = 'none';
  }
}

// ===== RELOJ =====
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const hStr = String(h).padStart(2, '0');
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const dia = dias[now.getDay()];
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

// ===== FILTROS =====
const filters = document.querySelectorAll('.pry-filter');
const cards   = document.querySelectorAll('.pry-card');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    // Activo visual
    filters.forEach(b => b.classList.remove('pry-filter--active'));
    btn.classList.add('pry-filter--active');

    const cat = btn.dataset.filter;

    cards.forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.classList.remove('pry-card--hidden');
        // Reanimar
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'smCardIn 0.35s cubic-bezier(.34,1.56,.64,1) both';
      } else {
        card.classList.add('pry-card--hidden');
      }
    });

    // Sonido
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(520, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      o.start(); o.stop(ctx.currentTime + 0.15);
    } catch(e) {}
  });
});

// ===== HOVER SONIDO en tarjetas =====
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(680, ctx.currentTime);
      g.gain.setValueAtTime(0.04, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      o.start(); o.stop(ctx.currentTime + 0.08);
    } catch(e) {}
  });
});
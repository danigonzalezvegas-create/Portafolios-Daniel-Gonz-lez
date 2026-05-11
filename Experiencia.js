// ===== TRANSICIÓN DE ENTRADA =====
const expTrans = document.getElementById('exp-transition');
if (expTrans) {
  const vieneDePagina = sessionStorage.getItem('wii-nav');
  if (vieneDePagina) {
    sessionStorage.removeItem('wii-nav');
  } else {
    expTrans.style.display = 'none';
  }
}

// ===== ANIMAR BARRAS =====
const barDelay = (expTrans && expTrans.style.display !== 'none') ? 3000 : 50;

setTimeout(() => {
  document.querySelectorAll('.exp-comp-fill').forEach(bar => {
    const target = getComputedStyle(bar).getPropertyValue('--cw').trim();
    bar.style.width = target || '0%';
  });
}, barDelay);

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
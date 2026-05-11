// ===== TRANSICIÓN DE ENTRADA: solo si venimos de navegación =====
const smTrans = document.getElementById('sm-transition');
if (smTrans) {
  const vieneDePagina = sessionStorage.getItem('wii-nav');
  if (vieneDePagina) {
    // Venimos de click — mostramos animación y limpiamos el flag
    sessionStorage.removeItem('wii-nav');
  } else {
    // Refresh o botón atrás — quitamos la transición sin animación
    smTrans.style.display = 'none';
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

// ===== BARRAS DE IDIOMAS =====
document.querySelectorAll('.sm-lang-fill').forEach(bar => {
  const target = bar.style.width;
  bar.style.setProperty('--target-width', target);
  bar.style.width = '0%';
  const delay = smTrans && smTrans.style.display !== 'none' ? 3300 : 300;
  setTimeout(() => { bar.style.width = target; }, delay);
});
// ===== TRANSICIÓN DE ENTRADA =====
const skTrans = document.getElementById('sk-transition');
if (skTrans) {
  const vieneDePagina = sessionStorage.getItem('wii-nav');
  if (vieneDePagina) {
    sessionStorage.removeItem('wii-nav');
  } else {
    skTrans.style.display = 'none';
  }
}

// ===== ANIMAR BARRAS =====
const skDelay = (skTrans && skTrans.style.display !== 'none') ? 3000 : 100;

setTimeout(() => {
  document.querySelectorAll('.sk-bar-fill').forEach(bar => {
    const target = getComputedStyle(bar).getPropertyValue('--bw').trim();
    bar.style.width = target || '0%';
  });
}, skDelay);
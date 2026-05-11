// ===== TRANSICIÓN DE ENTRADA =====
const estTrans = document.getElementById('est-transition');
if (estTrans) {
  const vieneDePagina = sessionStorage.getItem('wii-nav');
  if (vieneDePagina) {
    sessionStorage.removeItem('wii-nav');
  } else {
    estTrans.style.display = 'none';
  }
}

// ===== ANIMAR BARRAS — sin esperar transición si no la hay =====
const barDelay = (estTrans && estTrans.style.display !== 'none') ? 3000 : 50;

setTimeout(() => {
  document.querySelectorAll('.est-skill-fill').forEach(bar => {
    const target = getComputedStyle(bar).getPropertyValue('--sw').trim();
    bar.style.width = target || '0%';
  });
  document.querySelectorAll('.est-progress-fill').forEach(bar => {
    const target = getComputedStyle(bar).getPropertyValue('--prog').trim();
    bar.style.width = target || '0%';
  });
}, barDelay);
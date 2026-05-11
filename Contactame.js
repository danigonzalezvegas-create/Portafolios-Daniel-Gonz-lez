// ===== TRANSICIÓN DE ENTRADA =====
const cntTrans = document.getElementById('cnt-transition');
if (cntTrans) {
  const vieneDePagina = sessionStorage.getItem('wii-nav');
  if (vieneDePagina) {
    sessionStorage.removeItem('wii-nav');
  } else {
    cntTrans.style.display = 'none';
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

// ===== SONIDO CLICK (de js.js, por si acaso) =====
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

// ===== FORMULARIO: hover en inputs =====
document.querySelectorAll('.cnt-input, .cnt-textarea').forEach(el => {
  el.addEventListener('focus', () => {
    el.parentElement.style.transition = 'transform 0.15s';
    el.parentElement.style.transform = 'scale(1.01)';
  });
  el.addEventListener('blur', () => {
    el.parentElement.style.transform = 'scale(1)';
  });
});

// ===== BOTÓN ENVIAR =====
const submitBtn = document.getElementById('cnt-submit');
const feedback  = document.getElementById('cnt-feedback');

if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    // Validación mínima
    const inputs = document.querySelectorAll('.cnt-input');
    let allOk = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        allOk = false;
        input.style.borderColor = 'rgba(220,80,80,0.6)';
        input.style.boxShadow = '0 0 0 3px rgba(220,80,80,0.12)';
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.boxShadow = '';
        }, 1800);
      }
    });

    if (!allOk) return;

    // Animación del botón
    playClick();
    submitBtn.style.transform = 'scale(0.96)';
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" class="cnt-spin">
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
      </svg>
      Enviando...
    `;

    setTimeout(() => {
      submitBtn.style.transform = '';
      if (feedback) {
        feedback.classList.add('visible');
      }
      submitBtn.style.display = 'none';

      // Limpiar campos
      document.querySelectorAll('.cnt-input').forEach(i => i.value = '');
      const ta = document.querySelector('.cnt-textarea');
      if (ta) ta.value = '';
    }, 1400);
  });
}
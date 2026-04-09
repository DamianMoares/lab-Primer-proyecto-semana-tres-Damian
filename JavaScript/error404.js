
// Configuración de página 404
class Error404Handler {
  constructor() {
    this.setupPageAnimation();
    this.setupInteractiveElements();
  }

  setupPageAnimation() {
    const content = document.getElementById('content');
    if (content) {
      content.style.animation = 'fadeIn 0.5s ease-out';
      const decoration = document.createElement('div');
      decoration.innerHTML = '🚀';
      decoration.style.cssText = 'position: fixed; font-size: 120px; opacity: 0.1; pointer-events: none; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: float 3s ease-in-out infinite;';
      document.body.appendChild(decoration);
    }
  }

  setupInteractiveElements() {
    const btn = document.querySelector('.btn');
    const heading = document.querySelector('h1');
    if (btn) {
      btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
      btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
      btn.addEventListener('click', () => this.playClickSound());
    }
    if (heading) heading.style.animation = 'pulse 1.5s ease-in-out infinite';
  }

  playClickSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 400;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }
}

// Cuenta regresiva y redirección
class CountdownRedirect {
  constructor(seconds = 20) {
    this.seconds = seconds;
    this.init();
  }

  init() {
    const content = document.getElementById('content');
    if (content && !document.querySelector('.countdown')) {
      const countdown = document.createElement('div');
      countdown.className = 'countdown';
      countdown.innerHTML = `<p>Redireccionando en: <span id="countdown">${this.seconds}</span>s</p>`;
      countdown.style.cssText = 'margin-top: 20px; font-size: 14px; color: rgba(255, 255, 255, 0.8); animation: slideInUp 0.8s ease-out 0.9s both;';
      content.appendChild(countdown);
      this.start();
    }
  }

  start() {
    let remaining = this.seconds;
    const timer = setInterval(() => {
      remaining--;
      const el = document.getElementById('countdown');
      if (el) el.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(timer);
        window.location.href = '../index.html';
      }
    }, 1000);
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  new Error404Handler();
  requestIdleCallback(() => new CountdownRedirect(20));
});

// Estilos
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
  @keyframes float { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(-20px); } }
  @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(style);

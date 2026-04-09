/**
 * ========================================
 * ERROR404.JS - Página de Error 404
 * ========================================
 * Funcionalidades de la página de error
 */

// ==================== GESTOR DE ERROR 404 ====================
class Error404Handler {
  constructor() {
    this.init();
  }

  init() {
    this.setupPageAnimation();
    this.setupInteractiveElements();
    this.logError();
  }

  /**
   * Animación de la página de error
   */
  setupPageAnimation() {
    const content = document.getElementById('content');
    
    if (content) {
      // Aplicar animación de entrada
      content.style.animation = 'fadeIn 0.5s ease-out';
      
      // Agregar elemento decorativo
      const decoration = document.createElement('div');
      decoration.className = 'error-decoration';
      decoration.innerHTML = '🚀';
      decoration.style.cssText = `
        position: fixed;
        font-size: 120px;
        opacity: 0.1;
        pointer-events: none;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: float 3s ease-in-out infinite;
      `;
      
      document.body.appendChild(decoration);
    }
  }

  /**
   * Configurar elementos interactivos
   */
  setupInteractiveElements() {
    const goHomeBtn = document.querySelector('.btn');
    const heading = document.querySelector('h1');
    const paragraph = document.querySelector('p');
    
    if (goHomeBtn) {
      // Agregar efecto hover
      goHomeBtn.addEventListener('mouseenter', () => {
        goHomeBtn.style.transform = 'scale(1.05)';
      });
      
      goHomeBtn.addEventListener('mouseleave', () => {
        goHomeBtn.style.transform = 'scale(1)';
      });

      // Agregar sonido (opcional)
      goHomeBtn.addEventListener('click', () => {
        this.playClickSound();
      });
    }

    // Agregar animación de parpadeo al título
    if (heading) {
      heading.style.animation = 'pulse 1.5s ease-in-out infinite';
    }

    // Mostrar alternativas
    this.showAlternativeLinks();
  }

  /**
   * Mostrar enlaces alternativos
   */
  showAlternativeLinks() {
    const content = document.getElementById('content');
    
    if (content && !document.querySelector('.alternative-links')) {
      const alternatives = document.createElement('div');
      alternatives.className = 'alternative-links';
      alternatives.innerHTML = `
        <h3>Otras opciones:</h3>
        <ul>
          <li><a href="../index.html">Inicio</a></li>
          <li><a href="../index.html#projects">Proyectos</a></li>
          <li><a href="../index.html#services">Servicios</a></li>
          <li><a href="../page/formulario.html">Contacto</a></li>
        </ul>
      `;
      alternatives.style.cssText = `
        margin-top: 40px;
        padding: 20px;
        background-color: var(--color-bg-light);
        border-radius: 8px;
      `;
      
      content.appendChild(alternatives);
    }
  }

  /**
   * Reproducir sonido de clic
   */
  playClickSound() {
    try {
      // Crear sonido simple con Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      
      oscillator.frequency.value = 400;
      oscillator.type = 'sine';
      
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Audio no soportado o permiso denegado:', error);
    }
  }

  /**
   * Registrar error en el servidor/localStorage
   */
  logError() {
    const referrer = document.referrer || 'Directo';
    const timestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;

    const errorLog = {
      page: '404',
      referrer: referrer,
      timestamp: timestamp,
      userAgent: userAgent
    };

    // Guardar en localStorage
    const logs = JSON.parse(localStorage.getItem('errorLogs')) || [];
    logs.push(errorLog);
    localStorage.setItem('errorLogs', JSON.stringify(logs));

    console.log('📊 Error 404 registrado:', errorLog);
  }
}

// ==================== BÚSQUEDA EN PÁGINA ====================
class ErrorPageSearch {
  constructor() {
    this.setupSearchBox();
  }

  setupSearchBox() {
    const content = document.getElementById('content');
    
    if (content && !document.querySelector('.search-box')) {
      const searchBox = document.createElement('div');
      searchBox.className = 'search-box';
      searchBox.innerHTML = `
        <input type="text" placeholder="¿Qué buscas?" id="searchInput">
        <button id="searchBtn">Buscar</button>
      `;
      searchBox.style.cssText = `
        margin-top: 30px;
        display: flex;
        gap: 10px;
      `;

      content.insertBefore(searchBox, content.querySelector('.btn'));

      document.getElementById('searchBtn').addEventListener('click', () => {
        this.performSearch();
      });

      document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }
  }

  performSearch() {
    const query = document.getElementById('searchInput').value;
    if (query) {
      window.location.href = `../index.html?search=${encodeURIComponent(query)}`;
    }
  }
}

// ==================== REDIRECCIÓN INTELIGENTE ====================
class SmartRedirect {
  constructor() {
    this.checkAndRedirect();
  }

  checkAndRedirect() {
    // Si viene de una ruta específica, redirigir inteligentemente
    const referrer = document.referrer;
    const currentPath = window.location.pathname;

    // Casos comunes de URLs incorrectas
    const redirectMap = {
      '/pages/': '/page/',
      '/project': '/page/projectPage.html',
      '/contact': '/page/formulario.html',
      '/projects': '/page/projectPage.html'
    };

    for (const [wrong, correct] of Object.entries(redirectMap)) {
      if (currentPath.includes(wrong)) {
        console.log(`🔄 Redirección inteligente: ${wrong} -> ${correct}`);
        // No redirigir automáticamente, solo sugerir
        this.suggestCorrectPage(correct);
        break;
      }
    }
  }

  suggestCorrectPage(correctPath) {
    const content = document.getElementById('content');
    
    if (content && !document.querySelector('.suggestion')) {
      const suggestion = document.createElement('div');
      suggestion.className = 'suggestion';
      suggestion.innerHTML = `
        <p>¿Quizás quisiste ir a: <a href="${correctPath}">→ ${correctPath}</a></p>
      `;
      suggestion.style.cssText = `
        margin-top: 20px;
        padding: 15px;
        background-color: #e3f2fd;
        border-left: 4px solid #2196F3;
        border-radius: 4px;
      `;

      content.appendChild(suggestion);
    }
  }
}

// ==================== CONTADOR REGRESIVO ====================
class CountdownRedirect {
  constructor(seconds = 10) {
    this.seconds = seconds;
    this.init();
  }

  init() {
    const content = document.getElementById('content');
    
    if (content && !document.querySelector('.countdown')) {
      const countdown = document.createElement('div');
      countdown.className = 'countdown';
      countdown.innerHTML = `<p>Redireccionando en: <span id="countdown">${this.seconds}</span>s</p>`;
      countdown.style.cssText = `
        margin-top: 20px;
        font-size: 14px;
        color: #666;
      `;

      content.appendChild(countdown);

      // Iniciar cuenta regresiva (comentado por defecto)
      // this.start();
    }
  }

  start() {
    let remaining = this.seconds;

    const timer = setInterval(() => {
      remaining--;
      document.getElementById('countdown').textContent = remaining;

      if (remaining <= 0) {
        clearInterval(timer);
        window.location.href = '../index.html';
      }
    }, 1000);
  }
}

// ==================== ENCUESTA DE SATISFACCIÓN ====================
class ErrorFeedback {
  constructor() {
    this.setupFeedback();
  }

  setupFeedback() {
    const content = document.getElementById('content');
    
    if (content && !document.querySelector('.feedback-section')) {
      const feedback = document.createElement('div');
      feedback.className = 'feedback-section';
      feedback.innerHTML = `
        <h3>¿Cómo podemos ayudarte?</h3>
        <div class="feedback-options">
          <button class="feedback-btn" data-type="bug">Reportar error</button>
          <button class="feedback-btn" data-type="suggestion">Sugerencia</button>
          <button class="feedback-btn" data-type="help">Necesito ayuda</button>
        </div>
      `;
      feedback.style.cssText = `
        margin-top: 40px;
        padding: 20px;
        background-color: var(--color-accent-light);
        border-radius: 8px;
      `;

      content.appendChild(feedback);

      document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.handleFeedback(btn.dataset.type);
        });
      });
    }
  }

  handleFeedback(type) {
    const message = {
      'bug': 'Formulario de reporte de errores debe abrir',
      'suggestion': 'Gracias por tu sugerencia, la enviaremos al equipo',
      'help': 'Redirigiendo a la página de contacto...'
    };

    alert(message[type] || 'Gracias por tu retroalimentación');

    if (type === 'help') {
      setTimeout(() => {
        window.location.href = '../page/formulario.html';
      }, 1000);
    }
  }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  // Log optimizado
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('✓ Error404.js cargado correctamente');
  }

  // Componentes críticos
  new Error404Handler();
  new ErrorPageSearch();
  new SmartRedirect();
  
  // Lazy load componentes secundarios
  requestIdleCallback(() => {
    new CountdownRedirect(10);
    new ErrorFeedback();
  });
});

// ==================== ANIMACIONES CSS ERROR 404 ====================
const errorStyle = document.createElement('style');
errorStyle.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @keyframes float {
    0%, 100% { transform: translate(-50%, -50%) translateY(0); }
    50% { transform: translate(-50%, -50%) translateY(-20px); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  #content {
    animation: fadeIn 0.5s ease-out;
  }

  .btn {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .btn:hover {
    transform: scale(1.05);
  }

  .btn:active {
    transform: scale(0.95);
  }

  .alternative-links {
    animation: slideInUp 0.5s ease-out 0.3s both;
  }

  .alternative-links a {
    color: var(--color-primary);
    text-decoration: none;
    display: inline-block;
    margin: 5px;
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.3s;
  }

  .alternative-links a:hover {
    background-color: var(--color-accent-light);
    transform: translateY(-2px);
  }

  .search-box {
    animation: slideInUp 0.5s ease-out 0.2s both;
  }

  .search-box input,
  .search-box button {
    padding: 10px 15px;
    border: 2px solid transparent;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s;
  }

  .search-box input {
    flex: 1;
    border-color: #ddd;
  }

  .search-box input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 8px rgba(7, 42, 200, 0.2);
  }

  .search-box button {
    background-color: var(--color-primary);
    color: white;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .search-box button:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .feedback-section {
    animation: slideInUp 0.5s ease-out 0.4s both;
  }

  .feedback-btn {
    padding: 10px 20px;
    margin: 5px;
    background-color: white;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
  }

  .feedback-btn:hover {
    background-color: var(--color-primary);
    color: white;
    transform: translateY(-2px);
  }

  .countdown {
    animation: slideInDown 0.5s ease-out;
  }

  .suggestion {
    animation: slideInLeft 0.5s ease-out;
  }
`;
document.head.appendChild(errorStyle);

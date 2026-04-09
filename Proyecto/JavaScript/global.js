/**
 * ========================================
 * GLOBAL.JS - Funcionalidades Compartidas
 * ========================================
 * Código reutilizable en todas las páginas
 */

// ==================== MENÚ HAMBURGUESA ====================
class MobileMenuToggle {
  constructor() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.menu = document.querySelector('.menu');
    this.hamburger = document.querySelector('.hamburger');
    this.menuLinks = document.querySelectorAll('.menu a');
    this.clickHandler = null;
    
    if (this.menuToggle) {
      this.init();
    }
  }

  init() {
    // Cerrar menú cuando se hace clic en un enlace
    this.menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Cerrar menú cuando se hace clic fuera (usar referencia para poder remover después)
    this.clickHandler = (event) => {
      const isClickInsideMenu = this.menu?.contains(event.target);
      const isClickOnHamburger = this.hamburger?.contains(event.target);
      
      if (!isClickInsideMenu && !isClickOnHamburger && this.menuToggle.checked) {
        this.closeMenu();
      }
    };
    
    document.addEventListener('click', this.clickHandler, true);
  }

  closeMenu() {
    if (this.menuToggle) {
      this.menuToggle.checked = false;
    }
  }

  destroy() {
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler, true);
    }
  }
}

// ==================== SCROLL SUAVE ====================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Optimización: usar event delegation en lugar de listener individual
    document.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      
      // Evitar scroll suave si es solo "#"
      if (href !== '#') {
        event.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          // Usar behavior: 'smooth' nativo (más rápido)
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }, false); // No usar captura
  }
}

// ==================== BOTÓN CONTACT US ====================
class ContactButtonHandler {
  constructor() {
    this.contactBtn = document.querySelector('.btn-contact');
    this.init();
  }

  init() {
    if (this.contactBtn) {
      this.contactBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('newsletter');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Alternativa: redirigir a formulario
          const isInPage = window.location.pathname.includes('/page/');
          const contactUrl = isInPage ? './formulario.html' : './page/formulario.html';
          window.location.href = contactUrl;
        }
      });
    }
  }
}

// ==================== ANIMACIÓN EN SCROLL ====================
class ScrollAnimation {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window && this.elements.length > 0) {
      // Optimización: usar rootMargin para cargar antes
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target); // Remover inmediatamente después
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px' // Pre-cargar 50px antes de que sea visible
      });

      this.elements.forEach(element => {
        observer.observe(element);
      });
    }
  }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar todas las funcionalidades globales con optimización
  new MobileMenuToggle();
  new SmoothScroll();
  new ContactButtonHandler();
  new ScrollAnimation();

  // Log optimizado - solo en dev
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('✓ Global.js cargado correctamente');
  }
});

// ==================== UTILIDADES ====================
const Utils = {
  /**
   * Detectar si es dispositivo móvil
   */
  isMobile() {
    return window.innerWidth <= 768;
  },

  /**
   * Validar email
   */
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).toLowerCase());
  },

  /**
   * Validar URL
   */
  validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Copiar al portapapeles
   */
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('✓ Texto copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  },

  /**
   * Obtener parámetro de URL
   */
  getQueryParam(name) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    } catch (error) {
      console.error('Error obteniendo parámetro:', error);
      return null;
    }
  },

  /**
   * Obtener todos los parámetros de URL
   */
  getAllQueryParams() {
    try {
      const params = {};
      new URLSearchParams(window.location.search).forEach((value, key) => {
        params[key] = value;
      });
      return params;
    } catch (error) {
      console.error('Error obteniendo parámetros:', error);
      return {};
    }
  },

  /**
   * Redirigir a URL
   */
  redirect(url) {
    if (this.validateURL(url)) {
      window.location.href = url;
    } else {
      console.error('URL inválida:', url);
    }
  },

  /**
   * Recargar página
   */
  reload() {
    window.location.reload();
  },

  /**
   * Debounce - ejecutar función con retraso
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle - limitar ejecución de función
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Formatear fecha
   */
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
  },

  /**
   * Local storage con expiración
   */
  setLocalStorage(key, value, expirationMinutes = null) {
    const item = {
      value: value,
      timestamp: Date.now()
    };
    if (expirationMinutes) {
      item.expiration = Date.now() + (expirationMinutes * 60 * 1000);
    }
    localStorage.setItem(key, JSON.stringify(item));
  },

  /**
   * Local storage recuperar con expiración
   */
  getLocalStorage(key) {
    const item = JSON.parse(localStorage.getItem(key));
    if (!item) return null;
    
    if (item.expiration && Date.now() > item.expiration) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  },

  /**
   * Obtener posición del ratón
   */
  getMousePosition(event) {
    return {
      x: event.clientX || event.pageX,
      y: event.clientY || event.pageY
    };
  },

  /**
   * Scroll a elemento
   */
  scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }
};

// Hacer Utils disponible globalmente
window.Utils = Utils;

// ==================== ESTILOS GLOBALES DINÁMICOS ====================
const globalStyle = document.createElement('style');
globalStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .notification {
    animation: slideIn 0.3s ease-out;
    font-weight: 500;
    border-radius: 8px;
  }

  .notification-success {
    background-color: #4CAF50 !important;
  }

  .notification-error {
    background-color: #f44336 !important;
  }

  .notification-info {
    background-color: #2196F3 !important;
  }
`;
document.head.appendChild(globalStyle);

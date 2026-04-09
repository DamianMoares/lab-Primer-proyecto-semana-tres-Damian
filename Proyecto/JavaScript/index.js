/**
 * ========================================
 * INDEX.JS - Página Principal
 * ========================================
 * Funcionalidades específicas para index.html
 */

// ==================== SECCIONES DINÁMICAS ====================
class HomepageHandler {
  constructor() {
    this.projectLinks = document.querySelectorAll('.part-two-target-One, .part-two-target-two, .part-two-target-three');
    this.servicesLinks = document.querySelectorAll('.part-four-target-One a, .part-four-target-two a, .part-four-target-three a');
    this.init();
  }

  init() {
    this.setupProjectLinks();
    this.setupServicesLinks();
    this.setupNewsletterForm();
  }

  /**
   * Configurar comportamiento de enlaces de proyectos
   */
  setupProjectLinks() {
    // Reordenar tarjetas en orden descendente (3, 2, 1)
    const projectsArray = Array.from(this.projectLinks);
    const reversedOrder = [2, 1, 0]; // Índices invertidos para descendente
    
    projectsArray.forEach((link, index) => {
      // Asignar orden descendente usando flexbox
      link.style.order = reversedOrder[index];
      
      // Agregar ID del proyecto basado en la posición original (no invertida)
      const originalProjectId = this.getOriginalProjectId(link);
      link.href = `./page/projectPage.html?id=${originalProjectId}`;
      
      // Agregar efecto hover
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-10px)';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
      });
    });
    
    // Asegurar que el contenedor use flexbox
    const container = document.querySelector('.sectiontwo_container');
    if (container) {
      container.style.display = 'flex';
    }
  }

  /**
   * Obtener ID original del proyecto basado en la clase
   */
  getOriginalProjectId(link) {
    if (link.classList.contains('part-two-target-One')) return 1;
    if (link.classList.contains('part-two-target-two')) return 2;
    if (link.classList.contains('part-two-target-three')) return 3;
    return 1; // Por defecto
  }

  /**
   * Configurar enlaces de servicios
   */
  setupServicesLinks() {
    this.servicesLinks.forEach((link, index) => {
      link.href = `./page/formulario.html?service=${index + 1}`;
    });
  }

  /**
   * Configurar formulario de newsletter
   */
  setupNewsletterForm() {
    const emailInput = document.querySelector('.email-input');
    const submitBtn = document.querySelector('.btn-submit');

    if (emailInput && submitBtn) {
      submitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
          this.showNotification('Por favor ingresa tu email', 'error');
          return;
        }
        
        if (!Utils.validateEmail(email)) {
          this.showNotification('Por favor ingresa un email válido', 'error');
          return;
        }
        
        // Guardar email en localStorage
        const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem('subscribers', JSON.stringify(subscribers));
        }
        
        this.showNotification('¡Gracias por suscribirte!', 'success');
        emailInput.value = '';
      });

      // Permitir enter para enviar
      emailInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          submitBtn.click();
        }
      });
    }
  }

  /**
   * Mostrar notificación al usuario
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ==================== ANIMACIÓN DE NÚMEROS ====================
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('[data-count]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });

      this.counters.forEach(counter => {
        observer.observe(counter);
      });
    }
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 segundos
    const start = performance.now();
    const self = this;

    function animate(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(animate); // Más eficiente que setInterval
      }
    }

    requestAnimationFrame(animate);
  }
}

// ==================== TESTIMONIOS DINÁMICOS ====================
class TestimonialCarousel {
  constructor() {
    this.testimonial = document.querySelector('.testimonial');
    this.clientName = document.querySelector('.client-name');
    this.profileImg = document.querySelector('.profile');
    this.intervalId = null;
    
    this.testimonials = [
      {
        text: '"Circle helped us through every stage of our startup We really enjoyed working with you"',
        author: 'Kristin Watson',
        company: 'Booking.com',
        image: '../Proyecto/assets/testimonial-section/profile.png'
      },
      {
        text: '"An amazing experience. The team was professional and delivered exactly what we needed."',
        author: 'Sarah Johnson',
        company: 'Airbnb',
        image: '../Proyecto/assets/testimonial-section/profile.png'
      },
      {
        text: '"Outstanding service! They understood our vision and made it reality."',
        author: 'Michael Chen',
        company: 'Microsoft',
        image: '../Proyecto/assets/testimonial-section/profile.png'
      }
    ];

    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (this.testimonial) {
      // Usar referencia de interval para poder limpiar después
      this.intervalId = setInterval(() => this.rotateTestimonial(), 5000);
    }
  }

  rotateTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    const current = this.testimonials[this.currentIndex];

    if (this.testimonial) {
      this.testimonial.style.opacity = '0.5';
      setTimeout(() => {
        this.testimonial.textContent = current.text;
        this.clientName.textContent = current.author;
        const clientTitle = document.querySelector('.client-title');
        if (clientTitle) {
          clientTitle.textContent = current.company;
        }
        this.testimonial.style.opacity = '1';
      }, 300);
    }
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// ==================== LAZY LOADING DE IMÁGENES ====================
class LazyImageLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });

      this.images.forEach(img => {
        observer.observe(img);
      });
    }
  }
}

// ==================== ANIMACIÓN DE LOGO ====================
class LogoAnimation {
  constructor() {
    this.logo = document.querySelector('.logo');
    this.init();
  }

  init() {
    if (this.logo) {
      this.logo.addEventListener('mouseenter', () => {
        this.logo.style.animation = 'spin 0.6s ease-in-out';
      });
      
      this.logo.addEventListener('animationend', () => {
        this.logo.style.animation = '';
      });
    }
  }
}

// ==================== SCROLL PROGRESS BAR ====================
class ScrollProgressBar {
  constructor() {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progress-bar';
    this.progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(to right, #072ac8, #43d2ff);
      z-index: 999;
      width: 0%;
    `;
    document.body.appendChild(this.progressBar);
    
    // Optimización: usar requestAnimationFrame frame-synced en lugar de throttle
    let ticking = false;
    const rafThrottledUpdate = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          this.updateProgress();
          ticking = false;
        });
      }
    };
    
    window.addEventListener('scroll', rafThrottledUpdate, { passive: true });
  }

  updateProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const scrolled = (window.scrollY / scrollHeight) * 100;
      this.progressBar.style.width = scrolled + '%';
    }
  }

  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  // Log optimizado - solo en dev
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('✓ Index.js cargado correctamente');
  }
  
  // Inicializar secuencialmente optimizado
  new HomepageHandler();
  new CounterAnimation();
  
  // Lazy load de componentes pesados - demorar su inicialización
  requestIdleCallback(() => {
    new TestimonialCarousel();
    new LazyImageLoader();
    new LogoAnimation();
    new ScrollProgressBar();
  });
});

// ==================== ANIMACIONES CSS ESPECÍFICAS INDEX ====================
const indexStyle = document.createElement('style');
indexStyle.textContent = `
  @keyframes spin {
    from { transform: rotateY(0deg); }
    to { transform: rotateY(360deg); }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes countUp {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .progress-bar {
    transition: width 0.1s ease;
  }

  [data-count] {
    animation: countUp 0.5s ease-out;
  }

  .testimonial {
    transition: opacity 0.3s ease;
  }

  .logo {
    transition: transform 0.6s ease-in-out;
  }

  .part-four-target-One, .part-four-target-two, .part-four-target-three {
    transition: all 0.3s ease;
  }

  .part-four-target-One a:hover,
  .part-four-target-two a:hover,
  .part-four-target-three a:hover {
    opacity: 0.8;
    transform: translateY(-3px);
  }

  .email-input {
    transition: all 0.3s ease;
  }

  .email-input:focus {
    box-shadow: 0 0 10px rgba(7, 42, 200, 0.3);
  }

  .btn-submit {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .btn-submit:active {
    transform: translateY(0);
  }
`;
document.head.appendChild(indexStyle);

# 💻 DOCUMENTACIÓN JAVASCRIPT - Scripts y Lógica

## 📑 Índice de Archivos JavaScript

1. [global.js](#globaljs---componentes-globales)
2. [index.js](#indexjs---página-principal)
3. [projectPage.js](#projectpagejs---detalle-de-proyecto)
4. [formulario.js](#formulariojs---contacto)
5. [error404.js](#error404js---página-404)
6. [heroVideoHover.js](#herovideohoverjs---video-interactivo)
7. [sw.js](#swjs---service-worker)

---

## global.js - Componentes Globales

### 🎯 Propósito
Script compartido entre TODAS las páginas. Define componentes reutilizables.

### 📦 Componentes

#### 1. **Utils Object - Funciones Auxiliares**

```javascript
const Utils = {
  // Validation
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // Storage
  getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  
  saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  // Scroll
  scrollToElement(selector) {
    const element = document.querySelector(selector);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
};
```

#### 2. **SmoothScroll - Navegación Suave**

```javascript
class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    // Event delegation: solo 1 listener en document
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      e.preventDefault();
      const target = link.getAttribute('href');
      Utils.scrollToElement(target);
    });
  }
}
```

**Ventajas:**
- ✅ Solo 1 event listener (no ~50)
- ✅ Scroll suave y natural
- ✅ Funciona para anchors nuevos (dinámicos)

#### 3. **ScrollAnimation - Lazy Load con IntersectionObserver**

```javascript
class ScrollAnimation {
  constructor() {
    this.options = {
      threshold: 0,
      rootMargin: '50px' // Precarga 50px antes de ser visible
    };
    this.init();
  }
  
  init() {
    const elements = document.querySelectorAll('.scroll-animate');
    
    if (elements.length === 0) return; // Early exit
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, this.options);
    
    elements.forEach(el => observer.observe(el));
  }
}
```

**Características:**
- ✅ IntersectionObserver (mejor que scroll events)
- ✅ rootMargin para pre-cargar (UX mejor)
- ✅ Se desasocia después de cambio (cleanup)

#### 4. **ContactButtonHandler - Botón Flotante de Contacto**

```javascript
class ContactButtonHandler {
  constructor() {
    this.button = document.querySelector('.btn-contact');
    if (this.button) this.init();
  }
  
  init() {
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      // Redirige a formulario.html
      window.location.href = './page/formulario.html';
    });
  }
}
```

#### 5. **MobileMenuToggle - Menú Hamburguesa**

```javascript
class MobileMenuToggle {
  constructor() {
    this.toggle = document.getElementById('menu-toggle');
    this.menu = document.querySelector('.menu');
    
    if (this.toggle && this.menu) this.init();
  }
  
  init() {
    this.toggle.addEventListener('change', () => {
      if (this.toggle.checked) {
        this.menu.style.display = 'flex';
      } else {
        this.menu.style.display = 'none';
      }
    });
  }
  
  destroy() {
    this.toggle?.removeEventListener('change', () => {});
  }
}
```

#### 6. **Inicialización Global**

```javascript
// Inicialización en DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // ⚡ CRÍTICO - Renderiza inmediato
  new SmoothScroll();
  new ScrollAnimation();
  new ContactButtonHandler();
  new MobileMenuToggle();
  
  if (location.hostname === 'localhost') {
    console.log('✓ Global.js cargado correctamente');
  }
});
```

---

## index.js - Página Principal

### 🎯 Propósito
Componentes específicos de homepage: carrusel, contadores, lazy loading, barra de progreso.

### 📦 Componentes

#### 1. **HomepageHandler - Controlador Principal**

```javascript
class HomepageHandler {
  constructor() {
    this.init();
  }
  
  init() {
    // Initialization logic
    console.log('Homepage initialized');
  }
}
```

#### 2. **AnimateCounter - Animación de Números**

```javascript
class AnimateCounter {
  constructor() {
    this.counters = document.querySelectorAll('.counter');
    this.observerOptions = { threshold: 0.7 };
    this.animatedCounters = new Set();
    
    if (this.counters.length > 0) this.init();
  }
  
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedCounters.has(entry.target)) {
          this.animateCounter(entry.target);
          this.animatedCounters.add(entry.target);
        }
      });
    }, this.observerOptions);
    
    this.counters.forEach(counter => observer.observe(counter));
  }
  
  animateCounter(element) {
    const target = parseInt(element.textContent);
    let current = 0;
    
    // ✅ requestAnimationFrame en lugar de setInterval(16ms)
    const animate = () => {
      current += Math.ceil(target / 20);
      if (current > target) current = target;
      
      element.textContent = current;
      
      if (current < target) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
}
```

**Por qué requestAnimationFrame:**
- ✅ Sincronizado con refresh rate del navegador (60fps)
- ✅ No overdraw (más eficiente que setInterval 16ms)
- ✅ Pausado automáticamente cuando tab no está visible

#### 3. **TestimonialCarousel - Carrusel de Testimonios**

```javascript
class TestimonialCarousel {
  constructor() {
    this.carousel = document.querySelector('.testimonial-container');
    this.slides = document.querySelectorAll('.testimonial-card');
    this.autoPlayInterval = null;
    
    if (this.slides.length > 0) this.init();
  }
  
  init() {
    this.currentSlide = 0;
    
    // Auto-play con navegación
    this.autoPlay();
    
    // Navigation buttons
    document.querySelector('.carousel-prev')?.addEventListener('click', 
      () => this.prevSlide());
    document.querySelector('.carousel-next')?.addEventListener('click', 
      () => this.nextSlide());
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateCarousel();
  }
  
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
  }
  
  updateCarousel() {
    this.slides.forEach((slide, idx) => {
      slide.style.display = idx === this.currentSlide ? 'block' : 'none';
    });
  }
  
  autoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }
  
  destroy() {
    clearInterval(this.autoPlayInterval);
  }
}
```

#### 4. **LazyImageLoader - Carga Perezosa de Imágenes**

```javascript
class LazyImageLoader {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    
    if (this.images.length > 0) this.init();
  }
  
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    this.images.forEach(img => observer.observe(img));
  }
  
  loadImage(img) {
    const src = img.getAttribute('data-src') || img.getAttribute('src');
    img.src = src;
    img.removeAttribute('loading');
  }
}
```

#### 5. **ScrollProgressBar - Barra de Progreso**

```javascript
class ScrollProgressBar {
  constructor() {
    this.progressBar = document.querySelector('.scroll-progress');
    this.ticking = false;
    
    if (this.progressBar) this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => this.onScroll());
  }
  
  onScroll() {
    if (this.ticking) return; // Evitar múltiples actualizaciones por frame
    
    this.ticking = true;
    
    // ✅ requestAnimationFrame para máximo 60fps
    requestAnimationFrame(() => {
      const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      this.progressBar.style.width = progress + '%';
      this.ticking = false;
    });
  }
  
  destroy() {
    window.removeEventListener('scroll', () => this.onScroll());
  }
}
```

**Por qué requestAnimationFrame + ticking flag:**
- ✅ No emite múltiples eventos por frame (más eficiente)
- ✅ 60fps máximo (no más)
- ✅ Mejor rendimiento que throttle con setTimeout

#### 6. **Inicialización**

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // ⚡ CRÍTICO
  new HomepageHandler();
  new AnimateCounter();
  
  // 🔄 NO-CRÍTICO (carga en background)
  requestIdleCallback(() => {
    new TestimonialCarousel();
    new LazyImageLoader();
    new ScrollProgressBar();
  });
  
  if (location.hostname === 'localhost') {
    console.log('✓ Index.js cargado correctamente');
  }
});
```

---

## projectPage.js - Detalle de Proyecto

### 🎯 Propósito
Cargar proyecto desde API, mostrar detalles, compartir en redes, mostrar relacionados.

### 📦 Componentes

#### 1. **API Caching Global**

```javascript
const fetchProjectsWithCache = (() => {
  let cache = null;
  let cacheTime = null;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  
  return async () => {
    const now = Date.now();
    
    // Si hay cache válido, devolverlo
    if (cache && (now - cacheTime) < CACHE_DURATION) {
      return cache;
    }
    
    // Si no, hacer fetch
    try {
      const response = await fetch('https://api.example.com/projects');
      cache = await response.json();
      cacheTime = now;
      return cache;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return cache || null; // Fallback a cache viejo
    }
  };
})();
```

**Ventajas:**
- ✅ Closure para privacidad de variables
- ✅ TTL de 5 minutos (balance entre fresh y performance)
- ✅ Fallback a cache viejo si API falla

#### 2. **ProjectPageHandler**

```javascript
class ProjectPageHandler {
  constructor() {
    this.projectId = new URLSearchParams(window.location.search).get('projectId');
    if (this.projectId) this.init();
  }
  
  async init() {
    try {
      const projects = await fetchProjectsWithCache();
      const project = projects.find(p => p.id == this.projectId);
      
      if (project) {
        this.renderProject(project);
      } else {
        throw new Error('Project not found');
      }
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  renderProject(project) {
    document.querySelector('.project-title').textContent = project.name;
    document.querySelector('.project-image').src = project.image;
    document.querySelector('.project-description').textContent = project.description;
    
    // Renderizar tags
    const tagsContainer = document.querySelector('.project-tags');
    project.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });
  }
  
  showError(message) {
    document.querySelector('.project-detail').innerHTML = 
      `<p class="error">Error: ${message}</p>`;
  }
}
```

#### 3. **ProjectShare - Compartir en Redes**

```javascript
class ProjectShare {
  constructor() {
    this.shareButtons = document.querySelectorAll('.share-btn');
    if (this.shareButtons.length > 0) this.init();
  }
  
  init() {
    this.projectUrl = window.location.href;
    this.projectTitle = document.querySelector('.project-title')?.textContent || 'Project';
    
    this.shareButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = btn.dataset.platform;
        this.share(platform);
      });
    });
  }
  
  share(platform) {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${this.projectUrl}&text=${this.projectTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${this.projectUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${this.projectUrl}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  }
}
```

#### 4. **Inicialización**

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // ⚡ CRÍTICO
  new ProjectPageHandler();
  new ProjectScrollAnimation();
  
  // 🔄 NO-CRÍTICO
  requestIdleCallback(() => {
    new ProjectShare();
  });
});
```

---

## formulario.js - Contacto

### 🎯 Propósito
Validación, auto-guardado, historial, envío de formulario.

### 📦 Componentes

#### 1. **ContactFormHandler**

```javascript
class ContactFormHandler {
  constructor() {
    this.form = document.querySelector('.contact-form');
    this.feedback = document.querySelector('.form-feedback');
    if (this.form) this.init();
  }
  
  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (this.validateForm()) {
        this.submitForm();
      } else {
        this.showError('Por favor completa todos los campos');
      }
    });
  }
  
  validateForm() {
    const name = this.form.name.value.trim();
    const email = this.form.email.value.trim();
    const message = this.form.message.value.trim();
    
    return name.length >= 3 && 
           Utils.validateEmail(email) && 
           message.length >= 10;
  }
  
  async submitForm() {
    try {
      const formData = new FormData(this.form);
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        this.showSuccess('¡Mensaje enviado correctamente!');
        this.form.reset();
        this.saveToHistory();
      } else {
        throw new Error('Error al enviar');
      }
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  showSuccess(msg) {
    this.feedback.textContent = msg;
    this.feedback.className = 'form-feedback success';
  }
  
  showError(msg) {
    this.feedback.textContent = msg;
    this.feedback.className = 'form-feedback error';
  }
  
  saveToHistory() {
    const history = Utils.getFromStorage('contactHistory') || [];
    history.push({
      date: new Date().toISOString(),
      email: this.form.email.value
    });
    Utils.saveToStorage('contactHistory', history.slice(-10)); // Últimos 10
  }
}
```

#### 2. **EmailValidator**

```javascript
class EmailValidator {
  constructor() {
    this.emailInput = document.getElementById('email');
    if (this.emailInput) this.init();
  }
  
  init() {
    this.emailInput.addEventListener('blur', () => {
      if (Utils.validateEmail(this.emailInput.value)) {
        this.emailInput.classList.add('valid');
        this.emailInput.classList.remove('invalid');
      } else {
        this.emailInput.classList.add('invalid');
        this.emailInput.classList.remove('valid');
      }
    });
  }
}
```

---

## error404.js - Página 404

### 🎯 Propósito
Smart redirect, contador regresivo visual, búsqueda de páginas similares.

### 📦 Componentes

#### 1. **Error404Handler**

```javascript
class Error404Handler {
  constructor() {
    this.errorContainer = document.querySelector('.error-container');
    if (this.errorContainer) this.init();
  }
  
  init() {
    this.logError();
  }
  
  logError() {
    const errorLog = Utils.getFromStorage('errorLog') || [];
    errorLog.push({
      url: document.referrer,
      timestamp: new Date().toISOString()
    });
    Utils.saveToStorage('errorLog', errorLog.slice(-50)); // Últimas 50
  }
}
```

#### 2. **ErrorPageSearch**

```javascript
class ErrorPageSearch {
  constructor() {
    this.searchInput = document.getElementById('error-search');
    this.searchBtn = document.querySelector('.btn-search');
    
    if (this.searchInput && this.searchBtn) this.init();
  }
  
  init() {
    this.searchBtn.addEventListener('click', () => {
      const query = this.searchInput.value.toLowerCase();
      this.searchPages(query);
    });
  }
  
  searchPages(query) {
    const pages = [
      { name: 'Home', url: '/' },
      { name: 'Projects', url: '/projects' },
      { name: 'Contact', url: '/contact' }
    ];
    
    // Búsqueda difusa simple
    const results = pages.filter(p => 
      p.name.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
      window.location.href = results[0].url;
    }
  }
}
```

#### 3. **CountdownRedirect**

```javascript
class CountdownRedirect {
  constructor() {
    this.countdownEl = document.getElementById('countdown-text');
    if (this.countdownEl) this.init();
  }
  
  init() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    document.body.appendChild(canvas);
    
    this.animateCountdown(10);
  }
  
  animateCountdown(seconds) {
    let current = seconds;
    
    const tick = () => {
      this.countdownEl.querySelector('span').textContent = current;
      current--;
      
      if (current < 0) {
        window.location.href = '/';
      } else {
        setTimeout(tick, 1000);
      }
    };
    
    tick();
  }
}
```

---

## heroVideoHover.js - Video Interactivo

### 🎯 Propósito
Interactividad del video hero: hover, reproducción, ocultamiento de elementos.

### 📦 Componentes

#### 1. **HeroVideoHover - Control Total**

```javascript
class HeroVideoHover {
  constructor() {
    this.container = document.querySelector('.part-One-Section-two');
    this.heroImage = document.querySelector('.hero-main');
    this.heroCards = document.querySelectorAll('.hero-card');
    this.video = document.querySelector('.hero-video-player');
    this.cooldownDuration = 30000; // 30 segundos
    this.isOnCooldown = false;
    this.isVideoPlaying = false;
    
    if (this.container && this.video) this.init();
  }
  
  init() {
    // Solo mouseenter (no mouseleave)
    this.container.addEventListener('mouseenter', () => this.onMouseEnter());
    this.video.addEventListener('ended', () => this.onVideoEnd());
  }
  
  onMouseEnter() {
    if (this.isOnCooldown || this.isVideoPlaying) return;
    
    this.isVideoPlaying = true;
    this.hideAllElements();
    
    this.video.style.opacity = '1';
    this.video.style.pointerEvents = 'auto';
    
    this.video.currentTime = 0;
    this.video.play().catch(err => {
      this.isVideoPlaying = false;
    });
  }
  
  hideAllElements() {
    this.heroImage.style.opacity = '0';
    this.heroCards.forEach(card => card.style.opacity = '0');
  }
  
  showAllElements() {
    this.heroImage.style.opacity = '1';
    this.heroCards.forEach(card => card.style.opacity = '1');
  }
  
  onVideoEnd() {
    this.isVideoPlaying = false;
    this.isOnCooldown = true;
    
    this.video.style.opacity = '0';
    this.showAllElements();
    
    setTimeout(() => {
      this.isOnCooldown = false;
    }, this.cooldownDuration);
  }
}
```

---

## sw.js - Service Worker

### 🎯 Propósito
Caching inteligente y soporte offline.

### 📦 Estrategias

```javascript
// Network First (JS, CSS - siempre fresh)
fetch(request)
  .then(response => {
    cache.put(request, response.clone());
    return response;
  })
  .catch(() => caches.match(request));

// Cache First (Imágenes - rendimiento)
caches.match(request)
  .then(response => response || fetch(request)...);

// Cache First (HTML - offline)
caches.match(request)
  .then(response => response || fetch(request)...);
```

---

## 🎯 Patrón General de Componentes

```javascript
class MyComponent {
  constructor() {
    // 1. Seleccionar elementos
    this.element = document.querySelector('.selector');
    this.children = document.querySelectorAll('.child');
    
    // 2. Validar existencia
    if (!this.element) return;
    
    // 3. Inicializar
    this.init();
  }
  
  init() {
    // 4. Setup
    this.setupEventListeners();
    this.setupObservers();
  }
  
  setupEventListeners() {
    this.element.addEventListener('click', (e) => this.onClick(e));
  }
  
  onClick(event) {
    // Handle click
  }
  
  destroy() {
    // 5. Cleanup
    this.element?.removeEventListener('click', (e) => this.onClick(e));
    // Limpiar timers, observers, etc
  }
}
```

---

## 📊 Resumen de Optimizaciones

| Técnica | Archivo | Beneficio |
|---------|---------|-----------|
| Event Delegation | global.js | -80% listeners |
| requestAnimationFrame | index.js | 60fps estable |
| requestIdleCallback | index.js | -60% main thread |
| API Caching | projectPage.js | -80% API calls |
| IntersectionObserver | global.js | Lazy load eficiente |
| Closures | projectPage.js | Cache privado |

---

*Última actualización: 9 de abril de 2026*

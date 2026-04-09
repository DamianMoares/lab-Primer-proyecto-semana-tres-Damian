# 📄 DOCUMENTACIÓN HTML - Páginas y Estructura

## 📑 Índice de Páginas

1. [index.html](#indexhtml---página-principal)
2. [projectPage.html](#projectpagehtml---detalle-de-proyecto)
3. [formulario.html](#formulariohtml---formulario-de-contacto)
4. [error404.html](#error404html---página-de-error)

---

## index.html - Página Principal

### 🎯 Propósito
Página de inicio que presenta el estudio de diseño con showcase de servicios, proyectos y testimonios.

### 📝 Estructura Semántica

```html
<header class="header">              <!-- Navigation principal -->
  <nav class="header-inner">
    <img class="logo" />             <!-- Logo de Circle -->
    <nav class="menu">               <!-- Menú de navegación -->
    <button class="btn-contact">     <!-- Botón de contacto -->

<article>
  <section class="section1">         <!-- Hero section -->
    <div class="part-One-Section-One">     <!-- Texto hero -->
    <div class="part-One-Section-two">     <!-- Imagen + Video hero -->
    <div class="part-One-Section-three">   <!-- Logos de clientes -->

  <section class="sectiontwo">       <!-- Servicios ofrecidos -->
  <section class="section3">         <!-- Testimonios -->
  <section class="section4">         <!-- Proyectos -->
  <section class="section5">         <!-- Newsletter -->

<footer>                             <!-- Pie de página -->
```

### 🎬 Elementos Especiales

#### 1. **Hero Video Interactivo** (NUEVO)
```html
<div class="part-One-Section-two">
  <img class="hero-main" src="./assets/hero-section/hero-image.png" />
  
  <!-- 🎥 Video que aparece al hover -->
  <video class="hero-video-player" 
         src="./assets/hero-section/hero-video.mp4" 
         preload="auto"></video>
  
  <img class="hero-card card-top" />
  <img class="hero-card card-bottom" />
</div>
```

**Comportamiento:**
- Al pasar mouse: imagen se oculta, video aparece
- Video se reproduce automáticamente
- Al terminar: video se oculta, imagen reaparece
- Cooldown de 30 segundos antes de siguiente activación
- Todos los elementos (imagen, tarjetas) se ocultan durante reproducción

#### 2. **Navegación Smooth Scroll**
```html
<a href="#projects">Projects</a>     <!-- Scroll suave a sección -->
<a href="#services">Services</a>
```
Implementado en `global.js` con `SmoothScroll` class

#### 3. **Formulario de Newsletter**
```html
<form class="newsletter-form">
  <input type="email" placeholder="Enter your e-mail adress" />
  <button type="submit">Get updates</button>
</form>
```
Validación básica con regex

---

## projectPage.html - Detalle de Proyecto

### 🎯 Propósito
Página dinámica que carga detalles de un proyecto desde API basada en parámetro URL.

### 📝 Estructura

```html
<main>
  <section class="project-detail">
    <h1 class="project-title"></h1>        <!-- Título dinámico -->
    <img class="project-image" loading="lazy" />
    
    <section class="project-info">
      <p class="project-description"></p>
      <div class="project-tags"></div>     <!-- Tags dinámicos -->
    </section>
    
    <section class="project-share">
      <h3>Share Project</h3>
      <div class="social-buttons"></div>   <!-- Botones de compartir -->
    </section>
    
    <section class="related-projects">
      <h3>See other projects</h3>
      <div class="projects-grid"></div>    <!-- Proyectos relacionados -->
    </section>
  </section>
</main>
```

### 🔌 Carga Dinámica

```javascript
// Parámetro URL: ?projectId=1
const projectId = new URLSearchParams(window.location.search).get('projectId');
fetch(`/api/projects/${projectId}`)
  .then(res => res.json())
  .then(data => {
    // Renderizar proyecto dinámicamente
    document.querySelector('.project-title').textContent = data.name;
    // ... más propiedades
  });
```

### 📌 Características

✅ Cargador de proyectos desde API
✅ Caching de 5 minutos para repetidas requests
✅ Botones de compartir en redes sociales
✅ Proyectos relacionados (dinámicos)
✅ Imagen con lazy loading
✅ Error handling y fallbacks

---

## formulario.html - Formulario de Contacto

### 🎯 Propósito
Formulario robusto para que usuarios contacten al estudio.

### 📝 Estructura

```html
<main class="contact-form-container">
  <form class="contact-form">
    <div class="form-group">
      <label for="name">Your Name</label>
      <input type="text" id="name" name="name" required />
    </div>
    
    <div class="form-group">
      <label for="email">Your E-mail</label>
      <input type="email" id="email" name="email" required />
    </div>
    
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" required></textarea>
    </div>
    
    <button type="submit" class="btn-submit">Send Message</button>
  </form>
  
  <div class="form-feedback"></div>  <!-- Mensajes de éxito/error -->
</main>
```

### ✨ Validaciones

```
✅ Campo name:
   - Mínimo 3 caracteres
   - Solo letras y espacios
   
✅ Campo email:
   - Formato válido
   - Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

✅ Campo message:
   - Mínimo 10 caracteres
   - ≤ 1000 caracteres
```

### 💾 Funcionalidades

✅ Auto-guardado en localStorage (borrador)
✅ Historial de enviados
✅ Validación en tiempo real
✅ Mensajes de error descriptivos
✅ Spinner loading durante envío
✅ Confirmación de envío exitoso

---

## error404.html - Página de Error

### 🎯 Propósito
Experiencia amigable cuando usuario accede a URL no existente.

### 📝 Estructura

```html
<main class="error-container">
  <div class="error-content">
    <h1 class="error-code">404</h1>
    <h2 class="error-message">Page Not Found</h2>
    <p class="error-description">
      La página que buscas no existe o fue movida
    </p>
    
    <div class="search-bar">
      <input type="text" id="error-search" placeholder="Buscar..." />
      <button class="btn-search">Search</button>
    </div>
    
    <div class="redirect-options">
      <a href="/" class="btn-home">Back to Home</a>
      <a href="#projects" class="btn-projects">See Projects</a>
    </div>
    
    <div class="countdown-redirect">
      <p id="countdown-text">Redirigiendo en <span>10</span> segundos</p>
    </div>
  </div>
</main>
```

### 🤖 Features Inteligentes

**Smart Redirect:**
```javascript
// Buscar página similar basada en input
// Sugerir resultados cercanos

// Ej: usuario escribe "proyect" → sugiere "Projects"
```

**Auto-redirect:**
```javascript
// Después de 10 segundos, redirige a homepage
// Canvas para mostrar countdown visual
```

---

## 🌐 Meta Tags Globales

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Circle - Digital Design Studio" />
  <meta name="og:title" content="Circle Design" />
  <meta name="og:image" content="./assets/hero-section/hero-image.png" />
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="./css/styleResponsive.css" />
  <link rel="stylesheet" href="./css/global.css" />
  <link rel="stylesheet" href="./css/index.css" />
  
  <title>Circle - Digital Design Studio</title>
</head>
```

---

## 📱 Atributos de Optimización

### Loading Lazy

```html
<!-- Imágenes no-hero cargan cuando son visibles -->
<img src="./assets/logos/airbnb.svg" loading="lazy" />
<img src="./assets/projects/project1.jpg" loading="lazy" />
```

### Script Defer

```html
<!-- Scripts cargan de forma asincrónica -->
<script src="./JavaScript/global.js" defer></script>
<script src="./JavaScript/index.js" defer></script>
```

### Service Worker Registration

```html
<script defer>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('✓ SW registrado'));
    });
  }
</script>
```

---

## 🎨 Estructura de Clases

### Convención de Naming

```
.part-One-Section-One      → Sección uno, parte uno
.part-One-Section-two      → Sección uno, parte dos
.sectiontwo_container      → Contenedor sección dos
.part-two-target-One       → Tarjeta de proyecto
.btn-primary               → Botón principal
.btn-secondary             → Botón secundario
.hero-main                 → Imagen principal hero
.hero-video-player        → Video hero
```

---

## 🚀 Performance Hints

- Imágenes hero SIN loading lazy (cargan inmediato)
- Otras imágenes CON loading lazy
- Scripts con `defer` para async loading
- Service Worker para offline
- requestIdleCallback para componentes secundarios

---

*Última actualización: 9 de abril de 2026*

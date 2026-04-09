# 🎨 DOCUMENTACIÓN CSS - Estilos y Diseño

## 📑 Índice de Archivos CSS

1. [global.css](#globalcss---estilos-globales)
2. [index.css](#indexcss---estilos-específicos)
3. [styleResponsive.css](#styleresponsivecss---media-queries)

---

## global.css - Estilos Globales

### 🎯 Propósito
Define estilos aplicables a todas las páginas: header, footer, variables globales, utilidades.

### 📦 Contenido Principal

#### 1. **Variables CSS (Custom Properties)**
```css
:root {
  /* Colores */
  --color-primary: #072ac8;
  --color-secondary: #a2d6f9;
  --color-accent: #43d2ff;
  --color-text-primary: #292e47;
  --color-text-secondary: #6b708d;
  --color-bg-light: #f2f4fc;
  
  /* Tipografía */
  --font-h1: Heading H1 60 Bold;
  --font-body: Body Intro Text 20 Regular;
}
```

**Uso en CSS:**
```css
button {
  color: var(--color-primary);
  background: var(--color-bg-light);
}
```

#### 2. **Reset Global**
```css
* {
  max-width: 1200px;
  background-color: var(--color-bg-light);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
}
```

⚠️ **Nota:** `max-width: 1200px` en `*` aplica a TODOS los elementos

#### 3. **Header & Navigation**

```css
.header {
  padding: 24px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  width: min(1200px, 90%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu {
  display: flex;
  gap: 32px;
  flex: 1;
  justify-content: center;
}

.menu a:hover {
  color: var(--color-primary);
  transition: color 0.3s ease;
}
```

**Características:**
- Header sticky (siempre visible)
- Menu centrado con flexbox
- Enlaces con transición de color suave

#### 4. **Botones Globales**

```css
.btn-primary {
  padding: 12px 32px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #054fa6;
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-secondary:hover {
  background-color: var(--color-primary);
  color: white;
}
```

**Variantes:**
- `.btn-primary` - Azul relleno
- `.btn-secondary` - Borde azul, fondo transparente
- `.btn-contact` - Botón en header

#### 5. **Footer**

```css
footer {
  background-color: var(--color-text-primary);
  padding: 60px 0;
  text-align: center;
}

footer a {
  color: var(--color-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

footer a:hover {
  color: var(--color-accent);
}
```

#### 6. **Menu Hamburguesa (Mobile)**

```css
.menu-toggle {
  display: none;
}

.hamburger {
  display: none;
  font-size: 24px;
  cursor: pointer;
}

/* En media query iPad >768px */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }
  
  .menu-toggle:checked ~ .menu {
    display: flex;
    flex-direction: column;
  }
}
```

#### 7. **Animaciones Globales**

```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: slideInUp 0.5s ease-out;
}
```

---

## index.css - Estilos Específicos Index

### 🎯 Propósito
Estilos únicos para la página de inicio: hero, secciones, proyectos, testimonios.

### 📦 Contenido Principal

#### 1. **Sección 1 - Hero**

```css
.section1 {
  display: flex;
  align-items: center;
  padding: 80px 0;
  gap: 40px;
}

.section1-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 40px;
}

.part-One-Section-One {
  flex: 1;
}

.part-One-Section-One h1 {
  font-size: 60px;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--color-text-primary);
}

.part-One-Section-One p {
  font-size: 18px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 30px;
}
```

#### 2. **Hero Image & Video Interactivo**

```css
.part-One-Section-two {
  flex: 1;
  position: relative;
  min-height: 620px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-main {
  position: relative;
  z-index: 1;
  max-width: 430px;
  width: 100%;
  height: auto;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  cursor: pointer;
}

.hero-video-player {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  max-width: 430px;
  width: 100%;
  height: auto;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease-in-out;
  border-radius: 4px;
  display: block;
}

.hero-card {
  position: absolute;
  z-index: 2;
  height: auto;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.card-top {
  width: 280px;
  top: 0;
  left: -50px;
}

.card-bottom {
  width: 280px;
  top: 60%;
  right: -70px;
}
```

**Transiciones:**
- Imagen hero ↔ Video (fade in/out 0.5s)
- Tarjetas de decoración (fade in/out)

#### 3. **Sección 2 - Servicios**

```css
.sectiontwo_container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.part-two-target-One,
.part-two-target-two,
.part-two-target-three {
  flex: 1;
  max-width: 360px;
  height: 480px;
  background: white;
  padding: 32px;
  box-shadow: 6px 12px 25px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.part-two-target-One:hover,
.part-two-target-two:hover,
.part-two-target-three:hover {
  transform: translateY(-10px);
  box-shadow: 8px 16px 35px rgba(0, 0, 0, 0.18);
}
```

**Efecto Hover:**
- Sube 10px
- Sombra más pronunciada
- Transición suave (0.3s)

#### 4. **Sección 3 - Testimonios**

```css
.section3 {
  background: var(--color-text-primary);
  background-image: url(../assets/testimonial-section/orbit.png);
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  padding: 80px 0;
  margin: 5%;
}

.testimonial-container {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}

.testimonial-card {
  flex: 1;
  max-width: 280px;
  background: rgba(255, 255, 255, 0.1);
  padding: 24px;
  border-radius: 4px;
  backdrop-filter: blur(10px);
}

.testimonial-card p {
  color: white;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
}
```

**Características:**
- Fondo oscuro con imagen orbit
- Tarjetas con efecto glassmorphism (blur)
- Testimonios con avatar y nombre

#### 5. **Sección 4 - Proyectos**

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.project-card {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
}

.project-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover img {
  transform: scale(1.1);
}

.project-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 16px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.project-card:hover .project-overlay {
  transform: translateY(0);
}
```

**Interactividad:**
- Hover: imagen se zoom
- Overlay desliza hacia arriba

#### 6. **Sección 5 - Newsletter**

```css
.newsletter-section {
  background: var(--color-secondary);
  padding: 80px 0;
  text-align: center;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

.newsletter-form button {
  padding: 12px 32px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}
```

---

## styleResponsive.css - Media Queries

### 📱 Breakpoints

```css
/* Mobile: 320px - 480px */
@media (max-width: 480px) {
  .section1-container {
    flex-direction: column;
  }
  
  .part-One-Section-One {
    text-align: center;
  }
  
  .part-One-Section-two {
    min-height: auto;
  }
  
  .hero-card {
    display: none;
  }
}

/* Tablet: 480px - 768px */
@media (max-width: 768px) {
  .section1 {
    padding: 40px 0;
  }
  
  .sectiontwo_container {
    flex-direction: column;
    align-items: center;
  }
  
  .part-two-target-One,
  .part-two-target-two,
  .part-two-target-three {
    max-width: 100%;
  }
  
  .hamburger {
    display: block;
  }
  
  .menu {
    display: none;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 🎯 Mobile-First Approach

```css
/* Base: Mobile (320px) */
.container {
  padding: 16px;
  font-size: 14px;
}

/* Tablet (768px) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    font-size: 16px;
  }
}

/* Desktop (1024px) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    font-size: 18px;
  }
}
```

---

## 🎨 Paleta de Colores en Uso

| Color | Código | Uso |
|-------|--------|-----|
| Azul Primario | #072ac8 | Botones, enlaces, highlights |
| Azul Secundario | #a2d6f9 | Fondos, acentos suaves |
| Cyan | #43d2ff | Hover states, accents |
| Texto Oscuro | #292e47 | Textos principales |
| Texto Gris | #6b708d | Textos secundarios |
| Fondo Claro | #f2f4fc | Fondos generales |
| Fondo Azul | #ecf7ff | Fondos alternativos |
| Amarillo | #ffc600 | Advertencias |

---

## ✨ Tipografía

```css
h1, h2, h3, h4 {
  line-height: 0.98;
  letter-spacing: -1.5px;
  font-weight: 800;
  color: var(--color-text-primary);
}

h1 { font-size: 60px; }
h2 { font-size: 50px; }
h3 { font-size: 40px; }
h4 { font-size: 24px; }

p {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
```

---

## 🎬 Transiciones Globales

```css
/* Transiciones predefinidas */
.fade-in {
  transition: opacity 0.3s ease;
}

.slide-up {
  transition: transform 0.3s ease;
}

.scale-hover {
  transition: transform 0.3s ease;
}

.shadow-hover {
  transition: box-shadow 0.3s ease;
}

.color-transition {
  transition: color 0.3s ease, background 0.3s ease;
}
```

---

## 📐 Unidades y Espaciado

```css
/* Espaciado estándar */
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;

/* Usadas en */
padding: var(--spacing-lg);      /* 24px */
margin-bottom: var(--spacing-md); /* 16px */
gap: var(--spacing-lg);           /* 24px */
```

---

*Última actualización: 9 de abril de 2026*

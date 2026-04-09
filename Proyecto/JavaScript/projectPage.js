/**
 * ========================================
 * PROJECTPAGE.JS - Página de Detalle de Proyecto
 * ========================================
 * Funcionalidades para mostrar proyectos dinámicamente desde API
 */

// ==================== API CONFIGURATION ====================
const API_BASE_URL = 'https://raw.githubusercontent.com/ironhack-jc/mid-term-api/main/projects';
let apiCache = null;
let apiCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtener proyectos desde API con cache
 */
async function fetchProjectsWithCache() {
  const now = Date.now();
  
  // Si el cache es valido, devolverlo
  if (apiCache && (now - apiCacheTime) < CACHE_DURATION) {
    console.log('✓ Usando cache de API');
    return apiCache;
  }

  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    apiCache = await response.json();
    apiCacheTime = now;
    console.log('✓ API data cacheada durante 5 minutos');
    return apiCache;
  } catch (error) {
    console.error('Error fetching API:', error);
    throw error;
  }
}

// ==================== GESTOR DE PROYECTOS ====================
class ProjectPageHandler {
  constructor() {
    this.projectId = Utils.getQueryParam('id');
    this.projectData = null;
    this.init();
  }

  async init() {
    console.log(`🔄 Cargando proyecto con ID: ${this.projectId}`);
    
    try {
      if (!this.projectId) {
        this.showError('ID de proyecto no proporcionado. Redirigiendo...');
        setTimeout(() => {
          window.location.href = '../index.html#projects';
        }, 2000);
        return;
      }

      // Obtener datos del proyecto
      await this.fetchProjectData();
      
      if (this.projectData) {
        this.renderProjectData();
        this.setupInteractiveElements();
      } else {
        this.showError('Proyecto no encontrado');
      }
    } catch (error) {
      console.error('Error cargando proyecto:', error);
      this.showError('Error al cargar el proyecto. Intenta de nuevo.');
    }
  }

  /**
   * Obtener datos del proyecto desde la API
   */
  async fetchProjectData() {
    try {
      // Obtener lista completa de proyectos (con cache)
      const projects = await fetchProjectsWithCache();
      
      // Mapeo de IDs a nombres de proyecto (basado en el orden del HTML)
      const projectNames = {
        1: 'Simplify',
        2: 'Dashcoin',
        3: 'Vectorify'
      };
      
      const targetName = projectNames[parseInt(this.projectId)];
      
      // Buscar el proyecto por nombre en la API
      this.projectData = projects.find(p => p.name === targetName);
      
      if (this.projectData) {
        console.log('✓ Proyecto encontrado:', this.projectData);
      } else {
        throw new Error(`Proyecto "${targetName}" no encontrado en la API`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  /**
   * Renderizar datos del proyecto en el HTML
   */
  renderProjectData() {
    const project = this.projectData;
    const projectElement = document.getElementById('project');
    
    if (!projectElement) {
      console.error('Elemento #project no encontrado en el HTML');
      return;
    }

    // Actualizar título
    const titleElement = projectElement.querySelector('.title');
    if (titleElement) {
      titleElement.textContent = project.name || 'Sin título';
    }

    // Actualizar subtítulo
    const subtitleTypeElement = projectElement.querySelector('.UI_Design_title');
    if (subtitleTypeElement) {
      subtitleTypeElement.textContent = project.description || 'Proyecto';
    }

    // Actualizar fecha
    const dateElement = projectElement.querySelector('.Complete_title_data');
    if (dateElement) {
      const date = project.completed_on || new Date().toLocaleDateString();
      dateElement.textContent = date;
    }

    // Actualizar imagen principal
    const projectImg = projectElement.querySelector('.Project-Image');
    if (projectImg && project.image) {
      projectImg.src = project.image;
      projectImg.alt = project.name || 'Imagen del proyecto';
      projectImg.onerror = () => {
        console.warn('Error cargando imagen:', project.image);
        projectImg.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
      };
    }

    // Actualizar descripción
    const descriptionElement = projectElement.querySelector('.proyectDescription');
    if (descriptionElement) {
      descriptionElement.innerHTML = project.description || 'Descripción no disponible';
    }

    // Cargar proyectos relacionados
    this.loadRelatedProjects();
  }

  /**
   * Cargar proyectos relacionados/recientes
   */
  async loadRelatedProjects() {
    try {
      const projects = await fetchProjectsWithCache();
      const container = document.querySelector('.projects-container');
      
      if (!container) return;

      // Obtener el índice del proyecto actual
      const currentProjectIndex = parseInt(this.projectId) - 1;
      
      // Filtrar proyectos (excluir el actual)
      let relatedProjects = projects
        .map((project, idx) => ({ project, originalIndex: idx }))
        .filter((item, idx) => item.originalIndex !== currentProjectIndex);

      // Ordenar descendentemente por índice original
      relatedProjects.sort((a, b) => b.originalIndex - a.originalIndex);
      
      // Tomar solo los primeros 3
      relatedProjects = relatedProjects.slice(0, 3);

      // Limpiar proyectos anteriores si existen
      container.innerHTML = '';

      relatedProjects.forEach((item, idx) => {
        const project = item.project;
        const realIndex = item.originalIndex + 1;
        
        const projectCard = document.createElement('section');
        projectCard.className = 'project-card';
        
        // Aplicar orden descendente (índices: 2, 1, 0)
        const orderValues = [2, 1, 0];
        projectCard.style.order = orderValues[idx];
        
        projectCard.innerHTML = `
          <a class="project-wrapper" href="./projectPage.html?id=${realIndex}">
            <img class="img-project" src="${project.image}" alt="${project.name}" 
                 onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(project.name)}'">
          </a>
          <div class="project-inner-card">
            <a class="project-wrapper" href="./projectPage.html?id=${realIndex}">
              <h4 class="project-title">${project.name}</h4>
              <p class="project-description capitalize">${project.description}</p>
            </a>
            <a class="learn-more" href="./projectPage.html?id=${realIndex}">Learn more</a>
          </div>
        `;
        container.appendChild(projectCard);
      });
      
      // Asegurar que el contenedor use flexbox
      container.style.display = 'flex';
      
    } catch (error) {
      console.error('Error cargando proyectos relacionados:', error);
    }
  }

  /**
   * Configurar elementos interactivos
   */
  setupInteractiveElements() {
    // Agregar efecto hover a tarjetas
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.transition = 'transform 0.3s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // Botón de volver
    this.setupBackButton();
  }

  /**
   * Setup botón de volver (si existe)
   */
  setupBackButton() {
    const backBtn = document.querySelector('.btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.history.back();
      });
    }
  }

  /**
   * Mostrar mensaje de error
   */
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-alert';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #f44336;
      color: white;
      padding: 20px 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
      font-size: 16px;
      text-align: center;
    `;
    document.body.appendChild(errorDiv);
  }
}

// ==================== ANIMACIÓN EN SCROLL ====================
class ProjectScrollAnimation {
  constructor() {
    this.projectElement = document.getElementById('project');
    this.init();
  }

  init() {
    if (!this.projectElement) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.8s ease-out';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(this.projectElement);
    }
  }
}

// ==================== COMPARTIR PROYECTO ====================
class ProjectShare {
  constructor() {
    this.setupShareButtons();
  }

  setupShareButtons() {
    const projectTitle = document.querySelector('.title')?.textContent || 'Un proyecto increíble';
    const projectUrl = window.location.href;

    // Crear botones de compartir si no existen
    const shareContainer = document.querySelector('.share-buttons');
    if (shareContainer) {
      this.addShareButton(shareContainer, 'twitter', () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(projectUrl)}&text=Mira este proyecto: ${projectTitle}`, '_blank');
      });

      this.addShareButton(shareContainer, 'linkedin', () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`, '_blank');
      });

      this.addShareButton(shareContainer, 'facebook', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`, '_blank');
      });
    }
  }

  addShareButton(container, platform, callback) {
    const btn = document.createElement('button');
    btn.className = `share-btn share-btn-${platform}`;
    btn.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
    btn.addEventListener('click', callback);
    container.appendChild(btn);
  }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  // Log optimizado
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('✓ ProjectPage.js cargado correctamente');
  }

  // Inicializar handler principal
  const projectPageHandler = new ProjectPageHandler();
  new ProjectScrollAnimation();
  
  // Lazy load compartir en redes
  requestIdleCallback(() => {
    new ProjectShare();
  });
});

// ==================== ESTILOS DINÁMICOS PROJECT PAGE ====================
const projectStyle = document.createElement('style');
projectStyle.textContent = `
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translate(-50%, -100px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  .project-card {
    transition: all 0.3s ease;
  }

  .project-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .error-alert {
    animation: slideInDown 0.3s ease-out;
  }

  .share-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .share-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .share-btn:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
  }
`;
document.head.appendChild(projectStyle);

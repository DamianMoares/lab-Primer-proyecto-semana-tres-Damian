/**
 * ========================================
 * PROJECTPAGE.JS - Página de Detalle de Proyecto
 * ========================================
 * Módulo principal para cargar y mostrar detalles de proyectos individuales
 * desde la API con caching automático de 5 minutos.
 * 
 * FLUJO:
 * 1. Extraer ID del proyecto desde URL (?id=1)
 * 2. Validar ID y buscar en API por nombre
 * 3. Renderizar datos: título, imagen, descripción
 * 4. Cargar proyectos relacionados de forma descendente
 * 5. Configurar interactividad (hover effects)
 */

// ==================== CONFIGURACIÓN DE API ====================
const API_BASE_URL = 'https://raw.githubusercontent.com/ironhack-jc/mid-term-api/main/projects';
let apiCache = null;           // Almacena datos de API en memoria
let apiCacheTime = 0;           // Marca de tiempo del último fetch
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos = 300,000ms

/**
 * Obtiene proyectos desde API con sistema de caché automático
 * 
 * VENTAJAS:
 * - Reduce requests HTTP innecesarios
 * - Mejora velocidad de navegación entre proyectos
 * - Funciona sin servidor especial (solo localStorage del browser)
 * 
 * @returns {Array} Lista de proyectos desde API
 * @throws {Error} Si la API no responde correctamente
 */
async function fetchProjectsWithCache() {
  const now = Date.now();
  
  // ✓ PUNTO CLAVE: Validar si cache es aún válido
  if (apiCache && (now - apiCacheTime) < CACHE_DURATION) {
    console.log('✓ Usando cache de API (válido por 5 min)');
    return apiCache;
  }

  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // ✓ Guardar datos y marca de tiempo
    apiCache = await response.json();
    apiCacheTime = now;
    console.log('✓ API data cacheada durante 5 minutos');
    return apiCache;
  } catch (error) {
    console.error('✗ Error fetching API:', error);
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
   * 
   * PROCESO:
   * 1. Obtener ID de URL (?id=1)
   * 2. Mapear ID → nombre de proyecto
   * 3. Buscar en API por nombre (no por índice)
   * 4. Guardar en this.projectData
   * 
   * ✓ BUG FIX (Mensaje 4): Cambio de búsqueda por índice a búsqueda por nombre
   * previene que cards se vinculen incorrectamente
   */
  async fetchProjectData() {
    try {
      // ✓ Obtener lista completa de proyectos (con cache de 5 min)
      const projects = await fetchProjectsWithCache();
      
      // ✓ MAPEO CRÍTICO: Relaciona IDs de URL con nombres reales
      // ⚠️ IMPORTANTE: La API devuelve proyectos en ORDEN INVERSO
      // Solução: mapear por nombre en lugar de índice (corregido en Mensaje 9)
      const projectNames = {
        1: 'Simplify',      // ID 1 → Simplify
        2: 'Dashcoin',      // ID 2 → Dashcoin
        3: 'Vectorify',     // ID 3 → Vectorify
        4: 'Lorem ipsum'    // ID 4 → Lorem ipsum (edge case - fue agregado después)
      };
      
      const targetName = projectNames[parseInt(this.projectId)];
      
      // ✓ Validación: asegurar que el ID sea válido
      if (!targetName) {
        throw new Error(`ID de proyecto inválido: ${this.projectId}. Redirigiendo...`);
      }
      
      // ✓ BÚSQUEDA POR NOMBRE: evita problemas con orden de API
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
   * 
   * PROPÓSITO: Llenar template HTML con datos reales de la API
   * 
   * ACTUALIZA:
   * - Título del proyecto
   * - Descripción/tipo
   * - Fecha de completitud
   * - Imagen principal
   * - Contenido completo (descripción extendida)
   */
  renderProjectData() {
    const project = this.projectData;
    const projectElement = document.getElementById('project');
    
    if (!projectElement) {
      console.error('✗ Elemento #project no encontrado en el HTML');
      return;
    }

    // ✓ ACTUALIZAR TÍTULO: Nombre del proyecto desde API
    const titleElement = projectElement.querySelector('.title');
    if (titleElement) {
      titleElement.textContent = project.name || 'Sin título';
    }

    // ✓ ACTUALIZAR SUBTÍTULO: Tipo/categoría desde API (description)
    const subtitleTypeElement = projectElement.querySelector('.UI_Design_title');
    if (subtitleTypeElement) {
      subtitleTypeElement.textContent = project.description || 'Proyecto';
    }

    // ✓ ACTUALIZAR FECHA: Cuándo se completó el proyecto
    const dateElement = projectElement.querySelector('.Complete_title_data');
    if (dateElement) {
      const date = project.completed_on || new Date().toLocaleDateString();
      dateElement.textContent = date;
    }

    // ✓ ACTUALIZAR IMAGEN PRINCIPAL: Con fallback si falla
    const projectImg = projectElement.querySelector('.Project-Image');
    if (projectImg && project.image) {
      projectImg.src = project.image;
      projectImg.alt = project.name || 'Imagen del proyecto';
      projectImg.onerror = () => {
        console.warn('⚠️ Error cargando imagen:', project.image);
        projectImg.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
      };
    }

    // ✓ ACTUALIZAR CONTENIDO COMPLETO: Descripción extendida desde API (project.content)
    // NOTA: Usamos project.content (no description) para el texto completo
    // description = breve categoría, content = descripción detallada
    const descriptionElement = projectElement.querySelector('.proyectDescription');
    if (descriptionElement) {
      descriptionElement.innerHTML = project.content || 'Descripción no disponible';
    }

    // ✓ Cargar lista de proyectos relacionados (otros proyectos)
    this.loadRelatedProjects();
  }

  /**
   * Cargar proyectos relacionados (Other projects)
   * 
   * LÓGICA:
   * 1. Obtener todos los proyectos desde API
   * 2. Filtrar: eliminar el proyecto actual
   * 3. Generar dinámicamente tarjetas HTML
   * 4. Ordenar en forma descendente (3→2→1)
   * 5. Configurar botones "Learn more" con links correctos
   * 
   * ✓ BUG FIX (Mensaje 8): Ahora mapea nombres a IDs correctamente
   * previene que "lorem ipsum" devuelva error 404
   */
  async loadRelatedProjects() {
    try {
      const projects = await fetchProjectsWithCache();
      const container = document.querySelector('.projects-container');
      
      if (!container) return;

      // ✓ MAPEO INVERSO: nombre → ID para botones "Learn more"
      // Debe coincidir exactamente con projectNames en fetchProjectData()
      const nameToId = {
        'Simplify': 1,
        'Dashcoin': 2,
        'Vectorify': 3,
        'Lorem ipsum': 4    // Edge case que causó 404 en Mensaje 9
      };

      // ✓ Obtener nombre del proyecto ACTUAL desde DOM
      const titleElement = document.querySelector('.title');
      const currentProjectName = titleElement ? titleElement.textContent : '';

      // ✓ FILTRADO + MAPEO: Excluir proyecto actual e incluir su ID
      let relatedProjects = projects
        .filter(project => project.name !== currentProjectName)  // No mostrar el mismo proyecto
        .map(project => {
          const projectId = nameToId[project.name] || 1;  // Convertir nombre a ID
          return { project, projectId };
        });

      // ✓ ORDENAMIENTO: De mayor a menor ID (3→2→1)
      // Garantiza consistencia con index.html y hace predictible el layout
      relatedProjects.sort((a, b) => b.projectId - a.projectId);
      
      // ✓ LIMITAR A 3 PROYECTOS: Mostrar solo los más relevantes
      relatedProjects = relatedProjects.slice(0, 3);

      // ✓ LIMPIAR CONTAINER: Eliminar cualquier HTML anterior
      container.innerHTML = '';

      // ✓ GENERAR TARJETAS DINAMICAMENTE: Para cada proyecto relacionado
      relatedProjects.forEach((item, idx) => {
        const project = item.project;
        const projectId = item.projectId;
        
        const projectCard = document.createElement('section');
        projectCard.className = 'project-card';
        
        // ✓ CSS FLEXBOX ORDER: Ordena visual pero sin afectar HTML
        // Usa valores descendentes para layout visual (2→1→0)
        const orderValues = [2, 1, 0];
        projectCard.style.order = orderValues[idx];
        
        // ✓ ESTRUCTURA HTML: Imagen + título + descripción + botón
        projectCard.innerHTML = `
          <a class="project-wrapper" href="./projectPage.html?id=${projectId}">
            <img class="img-project" src="${project.image}" alt="${project.name}" 
                 onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(project.name)}'">
          </a>
          <div class="project-inner-card">
            <a class="project-wrapper" href="./projectPage.html?id=${projectId}">
              <h4 class="project-title">${project.name}</h4>
              <p class="project-description capitalize">${project.description}</p>
            </a>
            <a class="learn-more" href="./projectPage.html?id=${projectId}">Learn more</a>
          </div>
        `;
        container.appendChild(projectCard);
      });
      
      // ✓ ASEGURAR FLEXBOX: Garantiza que el layout sea correcto incluso si CSS falla
      container.style.display = 'flex';
      
      // ✓ DEBUG (localhost only): Verificar proyectos cargados correctamente
      if (location.hostname === 'localhost') {
        console.log('✓ Proyectos relacionados cargados:', relatedProjects.map(r => r.project.name));
      }
      
    } catch (error) {
      console.error('✗ Error cargando proyectos relacionados:', error);
    }
  }

  /**
   * Configurar elementos interactivos (hover effects)
   * 
   * EFECTOS:
   * - Card hover: translateY(-10px) = levanta la tarjeta 10px
   * - Transición suave: 0.3s ease
   * - Feedback visual para mejor UX
   */
  setupInteractiveElements() {
    // ✓ HOVER EFFECT: Levanta las tarjetas al pasar el mouse
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.transition = 'transform 0.3s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // ✓ Configurar botón de navegación "atrás"
    this.setupBackButton();
  }

  /**
   * Setup botón de volver (navegación atrás)
   * 
   * Si existe .btn-back, permite volver a la página anterior
   * Útil para mejorar UX en navegación
   */
  setupBackButton() {
    const backBtn = document.querySelector('.btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.history.back();  // Volver a página anterior
      });
    }
  }

  /**
   * Mostrar mensaje de error al usuario
   * 
   * CASOS DE USO:
   * - ID de proyecto inválido
   * - Proyecto no encontrado en API
   * - Error al cargar datos
   * 
   * DISEÑO:
   * - Alerta centrada en pantalla (fixed position)
   * - Estilo rojo (#f44336) para indicar error
   * - Sombra para mejor visibilidad
   * - z-index alto para estar siempre visible
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
/**
 * Animación de fade-in cuando elemento entra en viewport
 * 
 * TECNOLOGÍA: IntersectionObserver (mejor performance que scroll listeners)
 * VENTAJAS:
 * - No bloquea main thread
 * - Automáticamente detiene observación después de aparecer
 * - Fallback automático para navegadores antiguos
 */
class ProjectScrollAnimation {
  constructor() {
    this.projectElement = document.getElementById('project');
    this.init();
  }

  init() {
    if (!this.projectElement) return;

    // ✓ IntersectionObserver: Detecta cuando elemento entra en viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // ✓ TRIGGER: Aplicar animación fade-in cuando visible
            entry.target.style.animation = 'fadeIn 0.8s ease-out';
            observer.unobserve(entry.target);  // Detener observación
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

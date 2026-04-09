/**
 * ========================================
 * HERO VIDEO HOVER - Interactive Video
 * ========================================
 * Al hacer hover en hero section:
 * 1. Todos los elementos se ocultan (imagen, tarjetas)
 * 2. Video se reproduce
 * 3. Al terminar video, elementos regresan
 * 4. Cooldown 30s antes de nuevo hover
 */

class HeroVideoHover {
  constructor() {
    this.container = document.querySelector('.part-One-Section-two');
    this.heroImage = document.querySelector('.hero-main');
    this.heroCards = document.querySelectorAll('.hero-card');
    this.video = document.querySelector('.hero-video-player');
    this.cooldownDuration = 30000; // 30 segundos
    this.isOnCooldown = false;
    this.isVideoPlaying = false;

    if (this.container && this.video) {
      this.init();
    }
  }

  init() {
    // Event listeners
    this.container.addEventListener('mouseenter', () => this.onMouseEnter());

    // Video event listeners
    this.video.addEventListener('ended', () => this.onVideoEnd());
    
    if (location.hostname === 'localhost') {
      console.log('✓ HeroVideoHover inicializado (mejorado)');
    }
  }

  onMouseEnter() {
    // Solo iniciar si NO está en cooldown y NO está reproduciéndose
    if (this.isOnCooldown || this.isVideoPlaying) {
      if (location.hostname === 'localhost') {
        console.log('⏳ Acción bloqueada:', this.isOnCooldown ? 'Cooldown activo' : 'Video en reproducción');
      }
      return;
    }

    if (location.hostname === 'localhost') {
      console.log('▶ Video iniciando - ocultando elementos...');
    }

    this.isVideoPlaying = true;

    // Ocultar TODOS los elementos
    this.hideAllElements();

    // Mostrar solo el video
    this.video.style.opacity = '1';
    this.video.style.pointerEvents = 'auto';

    // Reproducir video desde el principio
    this.video.currentTime = 0;
    this.video.play().catch(err => {
      if (location.hostname === 'localhost') {
        console.error('Error reproduciendo video:', err);
      }
      this.isVideoPlaying = false;
    });
  }

  hideAllElements() {
    // Ocultar imagen principal
    this.heroImage.style.opacity = '0';
    this.heroImage.style.pointerEvents = 'none';

    // Ocultar todas las tarjetas
    this.heroCards.forEach(card => {
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
    });
  }

  showAllElements() {
    // Mostrar imagen principal
    this.heroImage.style.opacity = '1';
    this.heroImage.style.pointerEvents = 'auto';

    // Mostrar todas las tarjetas
    this.heroCards.forEach(card => {
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
    });
  }

  onVideoEnd() {
    if (location.hostname === 'localhost') {
      console.log('✓ Video terminó - mostrando elementos y activando cooldown 30s');
    }

    this.isVideoPlaying = false;
    this.isOnCooldown = true;

    // Ocultar video
    this.video.style.opacity = '0';
    this.video.style.pointerEvents = 'none';

    // Mostrar elementos
    this.showAllElements();

    // Esperar 30 segundos antes de permitir hover nuevamente
    setTimeout(() => {
      this.isOnCooldown = false;
      if (location.hostname === 'localhost') {
        console.log('✓ Cooldown terminado - hover disponible nuevamente');
      }
    }, this.cooldownDuration);
  }

  destroy() {
    if (this.container) {
      this.container.removeEventListener('mouseenter', () => this.onMouseEnter());
    }
    if (this.video) {
      this.video.removeEventListener('ended', () => this.onVideoEnd());
    }
  }
}

// Inicializar cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new HeroVideoHover();
});

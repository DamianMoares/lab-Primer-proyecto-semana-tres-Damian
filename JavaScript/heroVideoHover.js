// Video reproductor interactivo en hero section
class HeroVideoHover {
  constructor() {
    this.container = document.querySelector('.part-One-Section-two');
    this.heroImage = document.querySelector('.hero-main');
    this.heroCards = document.querySelectorAll('.hero-card');
    this.video = document.querySelector('.hero-video-player');
    this.cooldownDuration = 10000;
    this.isOnCooldown = false;
    this.isVideoPlaying = false;

    if (this.container && this.video) {
      this.init();
    }
  }

  init() {
    this.container.addEventListener('mouseenter', (e) => this.onMouseEnter(e));
    this.video.addEventListener('ended', () => this.onVideoEnd());
    this.video.addEventListener('play', () => this.isVideoPlaying = true);
    this.video.addEventListener('pause', () => {
      if (!this.isOnCooldown) this.isVideoPlaying = false;
    });
    this.video.style.opacity = '0';
    this.video.style.pointerEvents = 'none';
  }

  onMouseEnter(e) {
    if (this.isOnCooldown || this.isVideoPlaying) return;
    this.isVideoPlaying = true;
    this.hideAllElements();
    this.video.style.transition = 'opacity 0.5s ease-in-out';
    this.video.style.opacity = '1';
    this.video.style.pointerEvents = 'auto';
    this.video.currentTime = 0;
    
    const playPromise = this.video.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        this.isVideoPlaying = false;
        this.showAllElements();
      });
    }
  }

  hideAllElements() {
    this.heroImage.style.transition = 'opacity 0.5s ease-in-out';
    this.heroImage.style.opacity = '0';
    this.heroImage.style.pointerEvents = 'none';
    this.heroCards.forEach(card => {
      card.style.transition = 'opacity 0.5s ease-in-out';
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
    });
  }

  showAllElements() {
    this.heroImage.style.transition = 'opacity 0.5s ease-in-out';
    this.heroImage.style.opacity = '1';
    this.heroImage.style.pointerEvents = 'auto';
    this.heroCards.forEach(card => {
      card.style.transition = 'opacity 0.5s ease-in-out';
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
    });
  }

  onVideoEnd() {
    this.isVideoPlaying = false;
    this.isOnCooldown = true;
    this.video.style.transition = 'opacity 0.5s ease-in-out';
    this.video.style.opacity = '0';
    this.video.style.pointerEvents = 'none';
    this.showAllElements();
    setTimeout(() => {
      this.isOnCooldown = false;
    }, this.cooldownDuration);
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  new HeroVideoHover();
});

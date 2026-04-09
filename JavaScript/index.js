/**
 * INDEX.JS - Homepage
 */

// Proyectos con navegación
class Homepage {
  constructor() {
    this.init();
  }

  init() {
    this.setupProjects();
    this.setupNewsletter();
  }

  // Configurar links de proyectos
  setupProjects() {
    const links = document.querySelectorAll('.part-two-target-One, .part-two-target-two, .part-two-target-three');
    let id = 1;
    links.forEach((link, idx) => {
      link.style.order = 2 - idx;
      link.href = `./page/projectPage.html?id=${id++}`;
      link.addEventListener('mouseenter', (e) => e.target.style.transform = 'translateY(-10px)');
      link.addEventListener('mouseleave', (e) => e.target.style.transform = 'translateY(0)');
    });
  }

  // Newsletter
  setupNewsletter() {
    const btn = document.querySelector('.btn-submit');
    const input = document.querySelector('.email-input');
    
    btn?.addEventListener('click', () => {
      if (input?.value && /^\S+@\S+\.\S+$/.test(input.value)) {
        this.showMsg('¡Suscrito!', 'success');
        input.value = '';
      } else {
        this.showMsg('Email inválido', 'error');
      }
    });
  }

  // Notificación flotante
  showMsg(text, type) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.cssText = `position:fixed;top:20px;right:20px;padding:12px 20px;background:${
      type==='success'?'#4CAF50':'#f44336'};color:white;border-radius:4px;z-index:9999;`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => new Homepage());

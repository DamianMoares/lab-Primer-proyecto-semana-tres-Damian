/**
 * ========================================
 * FORMULARIO.JS - Contacto (Versión Simplificada)
 * ========================================
 * Solo lo básico: validación y envío
 */

class ContactForm {
  constructor() {
    this.form = document.querySelector('form');
    this.inputs = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      phone: document.getElementById('phone'),
      message: document.getElementById('message')
    };
    this.submitBtn = document.querySelector('button[type="submit"]');
    
    if (this.form) this.init();
  }

  init() {
    // ✓ Solo validar on blur y submit
    Object.values(this.inputs).forEach(input => {
      if (input) {
        input.addEventListener('blur', (e) => this.validateField(e.target));
      }
    });

    // ✓ Manejar envío
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Validar campo individual
   */
  validateField(field) {
    const value = field.value.trim();
    const errorDiv = field.parentElement.querySelector('.error-message');
    const successDiv = field.parentElement.querySelector('.success-message');
    // Remover error anterior si existe
    if (errorDiv) errorDiv.remove();
    if (successDiv) successDiv.remove();
    field.style.borderColor = '';

    if (!value) return true; // Validar al enviar, no al escribir

    let isValid = false;
    let message = '';

    switch (field.id) {
      case 'name':
        isValid = value.length >= 3;
        message = 'Mín. 3 caracteres';
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        message = 'Email inválido';
        break;
      case 'phone':
        isValid = value.length >= 7;
        message = 'Teléfono inválido';
        break;
      case 'message':
        isValid = value.length >= 10;
        message = 'Mín. 10 caracteres';
        break;
      default:
        isValid = true;
        
    }

    if (!isValid) {
      const err = document.createElement('span');
      err.className = 'error-message';
      err.textContent = message;
      err.style.cssText = 'color:#f44336; font-size:12px; display:block; margin-top:4px;';
      field.style.borderColor = '#f44336';
      field.parentElement.appendChild(err);
    }else{
      const valida = document.createElement('span');
      valida.className = 'success-message';
      valida.textContent = 'Campo válido';
      valida.style.cssText = 'color:#4CAF50; font-size:12px; display:block; margin-top:4px;';
      field.style.borderColor = '#4CAF50';
      field.parentElement.appendChild(valida);
    }

    return isValid;
  }

  /**
   * Validar y enviar formulario
   */
  handleSubmit(e) {
    e.preventDefault();

    // ✓ Validar todos los campos
    let isValid = true;
    Object.values(this.inputs).forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showMessage('Por favor completa correctamente todos los campos', 'error');
      return;
    }

    // ✓ Enviar (simular)
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = 'Enviando...';

    setTimeout(() => {
      this.showMessage('¡Mensaje enviado! Te contactaremos pronto.', 'success');
      this.form.reset();
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Enviar';

      // ✓ Volver a home después de 2s
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000);
    }, 1000);
  }

  /**
   * Mostrar mensaje flotante
   */
  showMessage(text, type) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      border-radius: 4px;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
  }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
});

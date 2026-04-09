/**
 * ========================================
 * FORMULARIO.JS - Página de Contacto
 * ========================================
 * Funcionalidades del formulario de contacto
 */

// ==================== GESTOR DE FORMULARIO ====================
class ContactFormHandler {
  constructor() {
    this.form = document.querySelector('form');
    this.inputs = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      phone: document.getElementById('phone'),
      message: document.getElementById('message')
    };
    this.submitBtn = document.querySelector('button[type="submit"]');
    
    this.init();
  }

  init() {
    if (this.form) {
      this.setupFormValidation();
      this.setupFormSubmit();
      this.setupInputMasks();
      this.setupAutoSave();
      this.checkForServiceParam();
    }
  }

  /**
   * Validar formulario en tiempo real
   */
  setupFormValidation() {
    Object.values(this.inputs).forEach(input => {
      if (input) {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.removeErrorMessage(input));
      }
    });
  }

  /**
   * Validar campo individual
   */
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.id) {
      case 'name':
        isValid = value.length >= 3;
        errorMessage = 'El nombre debe tener al menos 3 caracteres';
        break;
      
      case 'email':
        isValid = Utils.validateEmail(value);
        errorMessage = 'Por favor ingresa un email válido';
        break;
      
      case 'phone':
        isValid = /^[0-9\s\-\+\(\)]{7,}$/.test(value);
        errorMessage = 'Por favor ingresa un teléfono válido';
        break;
      
      case 'message':
        isValid = value.length >= 10;
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
        break;
    }

    if (!isValid && value) {
      this.showErrorMessage(field, errorMessage);
    }

    return isValid;
  }

  /**
   * Mostrar mensaje de error
   */
  showErrorMessage(field, message) {
    this.removeErrorMessage(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #f44336;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    `;
    
    field.style.borderColor = '#f44336';
    field.parentElement.appendChild(errorDiv);
  }

  /**
   * Remover mensaje de error
   */
  removeErrorMessage(field) {
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
    field.style.borderColor = '';
  }

  /**
   * Máscaras de entrada (teléfono, etc.)
   */
  setupInputMasks() {
    if (this.inputs.phone) {
      this.inputs.phone.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        // Formato: +1 (123) 456-7890
        if (value.length > 0) {
          if (value.length <= 3) {
            value = value;
          } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
          } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
          }
        }
        e.target.value = value;
      });
    }
  }

  /**
   * Guardar formulario automáticamente en localStorage
   */
  setupAutoSave() {
    let saveTimeout;
    
    Object.values(this.inputs).forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          clearTimeout(saveTimeout);
          saveTimeout = setTimeout(() => {
            const formData = {
              name: this.inputs.name?.value || '',
              email: this.inputs.email?.value || '',
              phone: this.inputs.phone?.value || '',
              message: this.inputs.message?.value || '',
              timestamp: new Date().toISOString()
            };
            localStorage.setItem('contactFormDraft', JSON.stringify(formData));
            console.log('✓ Formulario guardado automáticamente');
          }, 500);
        });
      }
    });

    // Cargar datos guardados si existen
    this.loadSavedFormData();
  }

  /**
   * Cargar datos previamente guardados
   */
  loadSavedFormData() {
    const savedData = JSON.parse(localStorage.getItem('contactFormDraft'));
    if (savedData && confirm('¿Deseas cargar tu formulario anterior?')) {
      if (this.inputs.name) this.inputs.name.value = savedData.name || '';
      if (this.inputs.email) this.inputs.email.value = savedData.email || '';
      if (this.inputs.phone) this.inputs.phone.value = savedData.phone || '';
      if (this.inputs.message) this.inputs.message.value = savedData.message || '';
    }
  }

  /**
   * Verificar si vino desde un servicio específico
   */
  checkForServiceParam() {
    const serviceId = Utils.getQueryParam('service');
    const services = {
      '1': 'UI/UX Design',
      '2': 'User Experience Design',
      '3': 'Application Development'
    };

    if (serviceId && services[serviceId] && this.inputs.message) {
      const currentText = this.inputs.message.value;
      this.inputs.message.value = `Consulta sobre: ${services[serviceId]}\n\n${currentText}`;
    }
  }

  /**
   * Manejar envío del formulario
   */
  setupFormSubmit() {
    if (this.form) {
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar todos los campos
        let isFormValid = true;
        Object.values(this.inputs).forEach(input => {
          if (input && !this.validateField(input)) {
            isFormValid = false;
          }
        });

        if (!isFormValid) {
          this.showNotification('Por favor corrige los errores en el formulario', 'error');
          return;
        }

        // Preparar datos
        const formData = {
          name: this.inputs.name?.value,
          email: this.inputs.email?.value,
          phone: this.inputs.phone?.value,
          message: this.inputs.message?.value,
          timestamp: new Date().toISOString()
        };

        // Enviar formulario
        await this.submitForm(formData);
      });
    }
  }

  /**
   * Enviar formulario (simular envío)
   */
  async submitForm(formData) {
    try {
      this.submitBtn.disabled = true;
      this.submitBtn.textContent = 'Enviando...';

      // Simular envío (en producción, esto sería un fetch a un servidor)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Guardar en historial
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
      submissions.push(formData);
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

      // Limpiar formulario
      this.form.reset();
      localStorage.removeItem('contactFormDraft');

      // Mostrar éxito
      this.showNotification('¡Gracias por tu mensaje! Te responderemos pronto.', 'success');

      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000);

    } catch (error) {
      console.error('Error enviando formulario:', error);
      this.showNotification('Hubo un error al enviar el formulario. Intenta de nuevo.', 'error');
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Submit';
    }
  }

  /**
   * Mostrar notificación
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

// ==================== VALIDACIÓN DE EMAIL ====================
class EmailValidator {
  constructor() {
    this.emailInput = document.getElementById('email');
    this.init();
  }

  init() {
    if (this.emailInput) {
      this.emailInput.addEventListener('change', () => this.verifyEmail());
    }
  }

  verifyEmail() {
    const email = this.emailInput.value;
    // Simulación de verificación de email
    if (email.includes('@')) {
      this.emailInput.style.borderColor = '#4CAF50';
      console.log('✓ Email válido');
    }
  }
}

// ==================== GESTOR DE HISTORIAL ====================
class SubmissionHistory {
  constructor() {
    this.setupHistoryButton();
  }

  setupHistoryButton() {
    const history = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
    
    // Solo mostrar botón si hay historial
    if (history.length > 0) {
      this.createHistoryButton();
    }
  }

  createHistoryButton() {
    const historyBtn = document.createElement('button');
    historyBtn.className = 'view-history-btn';
    historyBtn.textContent = '📋 Ver Historial';
    historyBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 10px 20px;
      background-color: #072ac8;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      z-index: 1000;
      font-weight: 600;
      transition: all 0.3s ease;
    `;

    historyBtn.addEventListener('mouseenter', () => {
      historyBtn.style.transform = 'scale(1.05)';
    });

    historyBtn.addEventListener('mouseleave', () => {
      historyBtn.style.transform = 'scale(1)';
    });

    historyBtn.addEventListener('click', () => this.displayHistory());
    document.body.appendChild(historyBtn);
  }

  displayHistory() {
    const history = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
    
    // Evitar duplicados de modal
    if (document.querySelector('.history-modal')) {
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'history-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Historial de Envíos (${history.length})</h2>
        <div class="submissions-list">
          ${history.length > 0 ? history.map((sub, idx) => `
            <div class="submission-item">
              <p><strong>${idx + 1}. ${sub.name || 'Sin nombre'}</strong></p>
              <p>Email: ${sub.email || 'No disponible'}</p>
              <p>Fecha: ${new Date(sub.timestamp).toLocaleString('es-ES')}</p>
            </div>
          `).join('') : '<p style="text-align: center; color: #999;">Sin envíos</p>'}
        </div>
        <button class="close-btn">Cerrar</button>
      </div>
    `;

    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.remove();
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  // Log optimizado
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('✓ Formulario.js cargado correctamente');
  }

  // Inicializar formulario inmediatamente
  const contactFormHandler = new ContactFormHandler();
  
  // Lazy load componentes secundarios
  requestIdleCallback(() => {
    new EmailValidator();
    new SubmissionHistory();
  });
});

// ==================== ESTILOS DINÁMICOS FORMULARIO ====================
const formStyle = document.createElement('style');
formStyle.textContent = `
  .form-group {
    margin-bottom: 20px;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #072ac8;
    box-shadow: 0 0 5px rgba(7, 42, 200, 0.3);
  }

  .error-message {
    animation: shake 0.3s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .history-modal {
    animation: fadeIn 0.3s ease-out;
  }

  .modal-content {
    background-color: white;
    border-radius: 8px;
    padding: 30px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .submission-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
  }

  .close-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #072ac8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .close-btn:hover {
    background-color: #0a1e7a;
  }

  .view-history-btn {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .view-history-btn:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(formStyle);

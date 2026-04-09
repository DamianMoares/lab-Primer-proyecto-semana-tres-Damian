// Menú hamburguesa - cerrar al hacer clic fuera o en un link
const mobileMenuToggle = document.getElementById('menu-toggle');
if (mobileMenuToggle) {
  const menu = document.querySelector('.menu');
  
  // Cerrar al clickear fuera
  document.addEventListener('click', e => {
    const isMenu = menu?.contains(e.target);
    const isToggle = mobileMenuToggle?.contains(e.target);
    if (!isMenu && !isToggle && mobileMenuToggle.checked) {
      mobileMenuToggle.checked = false;
    }
  });
  
  // Cerrar al clickear un link
  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => mobileMenuToggle.checked = false);
  });
}

// Utilidades globales
window.Utils = {
  validateEmail: email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  getQueryParam: name => new URLSearchParams(window.location.search).get(name)
};

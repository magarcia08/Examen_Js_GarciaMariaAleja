// js/utils/ui.js

// Muestra notificaciones simples estilo Bootstrap
export function toast(msg, type = 'info') {
  const colors = {
    info: 'primary',
    success: 'success',
    warning: 'warning',
    danger: 'danger'
  };
  const alert = document.createElement('div');
  alert.className = `alert alert-${colors[type] || 'primary'} alert-dismissible fade show position-fixed top-0 end-0 m-3 shadow`;
  alert.style.zIndex = '9999';
  alert.innerHTML = `
    ${msg}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 4000);
}

// Efecto de scroll para el navbar (simple)
// Efecto de scroll para que la navbar se vuelva negra (como el footer)
export function navbarScrollEffect(selector = 'nav') {
  const nav = document.querySelector(selector);
  if (!nav) return;

  const applyEffect = () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  applyEffect();
  window.addEventListener('scroll', applyEffect);
}



// Muestra un modal de confirmación simple (PROMESA)
export function confirmModal(title = 'Confirmar', message = '¿Estás seguro?') {
  return new Promise((resolve) => {
    // crear modal dinámico
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="modal fade" id="confirmModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p>${message}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-primary" id="confirmOkBtn">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);

    const modal = new bootstrap.Modal(wrapper.querySelector('.modal'));
    const okBtn = wrapper.querySelector('#confirmOkBtn');

    okBtn.addEventListener('click', () => {
      resolve(true);
      modal.hide();
    });

    wrapper.querySelector('.modal').addEventListener('hidden.bs.modal', () => {
      wrapper.remove();
      resolve(false);
    });

    modal.show();
  });

  
}

// components/navbar.js
import { navbarScrollEffect } from '../utils/ui.js';
import { currentUser, logout } from '../services/authService.js';

function rootPrefix() {
  // Si la ruta incluye /admin/, sube un nivel para apuntar al root del proyecto
  return location.pathname.includes('/admin/') ? '../' : '';
}

class SiteNavbar extends HTMLElement {
  connectedCallback() {
    const me = currentUser();
    const isAdmin = me?.role === 'admin';
    const isClient = me?.role === 'user'; // ✅ corregido (antes usaba "user" undefined)

    const ROOT = rootPrefix();

    this.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top luxe">
      <div class="container">
        <a class="navbar-brand fw-bold" href="${ROOT}index.html">Rincón del Carmen</a>
        <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="nav" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link" href="${ROOT}index.html">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="${ROOT}rooms.html">Habitaciones</a></li>
            <li class="nav-item"><a class="nav-link" href="${ROOT}booking.html">Reservar</a></li>
            <li class="nav-item"><a class="nav-link" href="${ROOT}history.html">Historia</a></li>
            <li class="nav-item"><a class="nav-link" href="${ROOT}contact.html">Contacto</a></li>
            ${isClient ? `<li class="nav-item"><a class="nav-link" href="${ROOT}mis-reservas.html">Mis reservas</a></li>` : ''}
            ${isAdmin ? `<li class="nav-item"><a class="nav-link" href="${ROOT}admin/dashboard.html">Admin</a></li>` : ''}
          </ul>
          <div class="d-flex gap-2">
            ${
              me
                ? `<span class="navbar-text small text-white-50 me-2">Hola, ${me.name}</span>
                   <a class="btn btn-sm btn-outline-light" id="btnLogout">Salir</a>`
                : `<a href="${ROOT}auth.html" class="btn btn-sm btn-light">Ingresar / Registrarse</a>`
            }
          </div>
        </div>
      </div>
    </nav>`;

    navbarScrollEffect();

    // ✅ Cerrar sesión si está logueado
    this.querySelector('#btnLogout')?.addEventListener('click', () => {
      logout();
      location.href = `${ROOT}index.html`;
    });
  }
}

customElements.define('site-navbar', SiteNavbar);


import { navbarScrollEffect } from '../utils/ui.js';
import { currentUser, logout } from '../services/authService.js';
class SiteNavbar extends HTMLElement{
  connectedCallback(){
    const me=currentUser(); const isAdmin=me?.role==='admin';
    this.innerHTML=`
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top luxe">
      <div class="container">
        <a class="navbar-brand fw-bold" href="index.html">Hotel el Rincón del Carmen</a>
        <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav"><span class="navbar-toggler-icon"></span></button>
        <div id="nav" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto">
            <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="rooms.html">Habitaciones</a></li>
            <li class="nav-item"><a class="nav-link" href="booking.html">Reservar</a></li>
            <li class="nav-item"><a class="nav-link" href="history.html">Historia</a></li>
            <li class="nav-item"><a class="nav-link" href="contact.html">Contacto</a></li>
            <li class="nav-item"><a class="nav-link" href="mis-reservas.html">Mis reservas</a></li>

            ${isAdmin? `<li class="nav-item"><a class="nav-link" href="admin/dashboard.html">Admin</a></li>`:''}
          </ul>
          <div class="d-flex gap-2">
            ${me ? `<span class="navbar-text small text-white-50 me-2">Hola, ${me.name}</span>
                     <a class="btn btn-sm btn-outline-light" id="btnLogout">Salir</a>`
                : `<a href="auth.html" class="btn btn-sm btn-light">Ingresar / Registrarse</a>`}
          </div>
        </div>
      </div>
    </nav>`;
    navbarScrollEffect();
    this.querySelector('#btnLogout')?.addEventListener('click', ()=>{ logout(); location.href='index.html'; });
  }
}
customElements.define('site-navbar', SiteNavbar);

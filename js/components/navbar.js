// js/components/navbar.js
import { currentUser, logout } from '../services/authService.js';

class AppNavbar extends HTMLElement{
  connectedCallback(){
    const active = this.getAttribute('active')||'';
    const s = currentUser();

    this.innerHTML = /*html*/`
      <nav class="navbar navbar-expand-lg luxe fixed-top ${active==='home'?'':'scrolled'}">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center ${active==='home'?'text-white':'text-white'}" href="index.html">
            <i class="bi bi-gem me-2 text-warning"></i>
            <span class="fw-bold">Rincón del Carmen</span>
          </a>

          <button class="navbar-toggler bg-white" data-bs-toggle="collapse" data-bs-target="#nav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div id="nav" class="collapse navbar-collapse">
            <!-- Menú principal -->
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link ${active==='home'?'active':''}" href="index.html">Inicio</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${active==='reservas'?'active':''}" href="reservas.html">Reservas</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${active==='contacto'?'active':''}" href="contacto.html">Contacto</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${active==='admin'?'active':''}" href="admin.html">Administración</a>
              </li>
            </ul>

            <!-- CTA Reservar + Usuario -->
            <div class="d-flex ms-lg-3 gap-2 align-items-center">
              <a href="reservas.html" class="btn btn-light">
                <i class="bi bi-calendar2-week me-1"></i> Reservar
              </a>

              ${s ? `
                <div class="dropdown">
                  <button class="btn btn-outline-light dropdown-toggle" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${s.name}
                  </button>
                  <div class="dropdown-menu dropdown-menu-end">
                    <a class="dropdown-item" href="reservas.html#myBookingsSection">Mis reservas</a>
                    <button class="dropdown-item" id="btnLogout">Cerrar sesión</button>
                  </div>
                </div>
              ` : `
                <button class="btn btn-outline-light" data-bs-target="#loginModal" data-bs-toggle="modal">
                  <i class="bi bi-box-arrow-in-right me-1"></i> Ingresar
                </button>
              `}
            </div>
          </div>
        </div>
      </nav>
    `;

    // Logout
    const btn = this.querySelector('#btnLogout');
    if(btn) btn.addEventListener('click', ()=>{ logout(); location.reload(); });

    // Efecto on-scroll (home transparente)
    const nav = this.querySelector('.navbar');
    const onScroll = ()=> {
      if(window.scrollY > 10){ nav.classList.add('scrolled'); }
      else if(this.getAttribute('active')==='home'){ nav.classList.remove('scrolled'); }
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }
}
customElements.define('app-navbar', AppNavbar);

// components/footer.js
function rootPrefix() {
  return location.pathname.includes('/admin/') ? '../' : '';
}
class SiteFooter extends HTMLElement{
  connectedCallback(){
    const ROOT = rootPrefix();
    this.innerHTML = `
      <footer class="luxe mt-5 py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-12 col-md">
              <div class="brand h4">Hotel Rincón del Carmen</div>
              <p class="text-secondary"> La comodidad que buscabas</p>
            </div>
            <div class="col-6 col-md">
              <div class="fw-bold mb-2">Secciones</div>
              <ul class="list-unstyled">
                <li><a href="${ROOT}rooms.html">Habitaciones</a></li>
                <li><a href="${ROOT}booking.html">Reservar</a></li>
                <li><a href="${ROOT}history.html">Historia</a></li>
                <li><a href="${ROOT}contact.html">Contacto</a></li>
              </ul>
            </div>
             <div class="col-12 col-md">
            <div class="brand h4">Desarrollado por camper: </div>
            <p class="text-secondary">María Alejandra G.</p>
          </div>
          <hr class="border-secondary opacity-25 my-4"/>
          <small class="text-secondary">© 2025 Hotel El Rincón del Carmen</small>
        </div>
      </footer>`;
  }
}
customElements.define('site-footer', SiteFooter);

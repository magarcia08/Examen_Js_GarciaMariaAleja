
class SiteFooter extends HTMLElement{
  connectedCallback(){
    this.innerHTML = `
      <footer class="luxe mt-5 py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-12 col-md">
              <div class="brand h4">Hotel el Rincón del Carmen Hotel</div>
              <p class="text-secondary">Luxury · Wellness · Gastronomy</p>
            </div>
            <div class="col-6 col-md">
              <div class="fw-bold mb-2">Explora</div>
              <ul class="list-unstyled">
                <li><a href="rooms.html">Habitaciones</a></li>
                <li><a href="booking.html">Reservar</a></li>
                <li><a href="history.html">Historia</a></li>
                <li><a href="contact.html">Contacto</a></li>
              </ul>
            </div>
          </div>
          <hr class="border-secondary opacity-25 my-4"/>
          <small class="text-secondary">© 2025 Hotel el Rincón del Carmen</small>
        </div>
      </footer>`;
  }
}
customElements.define('site-footer', SiteFooter);

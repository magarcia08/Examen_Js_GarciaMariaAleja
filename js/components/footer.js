// js/components/footer.js
class AppFooter extends HTMLElement{
  connectedCallback(){
    const y = new Date().getFullYear();
    this.innerHTML = /*html*/`
      <footer class="luxe mt-5 py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-12 col-lg-4">
              <div class="brand h5 mb-2">Hotel El Rincón del Carmen</div>
              <p class="text-secondary mb-3">Un oasis boutique de descanso, sabor y bienestar.</p>
              <div class="d-flex gap-3">
                <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a href="#" aria-label="X"><i class="bi bi-twitter-x"></i></a>
              </div>
            </div>
            <div class="col-6 col-lg-4">
              <div class="fw-semibold mb-2">Explorar</div>
              <ul class="list-unstyled">
                <li><a href="index.html">Inicio</a></li>
                <li><a href="reservas.html">Reservas</a></li>
                <li><a href="contacto.html">Contacto</a></li>
              </ul>
            </div>
            <div class="col-6 col-lg-4">
              <div class="fw-semibold mb-2">Contacto</div>
              <ul class="list-unstyled">
                <li>Calle 123 #45-67, Bucaramanga</li>
                <li>+57 300 000 0000</li>
                <li><a href="mailto:contacto@rincondelcarmen.com">contacto@rincondelcarmen.com</a></li>
              </ul>
              <small class="text-secondary">© ${y} · Todos los derechos reservados</small>
            </div>
          </div>
        </div>
      </footer>`;
  }
}
customElements.define('app-footer', AppFooter);

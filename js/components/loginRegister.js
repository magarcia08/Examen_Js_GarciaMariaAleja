import { login, register } from '../services/authService.js';
import { toast } from '../utils/ui.js';

class LoginModal extends HTMLElement{
  connectedCallback(){
    this.innerHTML = /*html*/`
      <div class="modal fade" id="loginModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Ingresar o registrarse</h5>
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <ul class="nav nav-pills mb-3" id="pills" role="tablist">
                <li class="nav-item"><button class="nav-link active" data-bs-toggle="pill" data-bs-target="#pLogin">Ingresar</button></li>
                <li class="nav-item"><button class="nav-link" data-bs-toggle="pill" data-bs-target="#pReg">Registrarme</button></li>
              </ul>
              <div class="tab-content">
                <div class="tab-pane fade show active" id="pLogin">
                  <form id="loginForm" class="row g-3">
                    <div class="col-12"><label class="form-label">Email</label><input required name="email" type="email" class="form-control"></div>
                    <div class="col-12"><label class="form-label">Contraseña</label><input required name="password" type="password" class="form-control"></div>
                    <div class="col-12 d-grid"><button class="btn btn-dark">Ingresar</button></div>
                  </form>
                </div>
                <div class="tab-pane fade" id="pReg">
                  <form id="regForm" class="row g-2">
                    <div class="col-12 col-md-6"><label class="form-label">Identificación</label><input required name="nid" class="form-control"></div>
                    <div class="col-12 col-md-6"><label class="form-label">Nacionalidad</label><input required name="nationality" class="form-control"></div>
                    <div class="col-12"><label class="form-label">Nombre completo</label><input required name="name" class="form-control"></div>
                    <div class="col-12 col-md-6"><label class="form-label">Email</label><input required name="email" type="email" class="form-control"></div>
                    <div class="col-12 col-md-6"><label class="form-label">Teléfono</label><input required name="phone" class="form-control"></div>
                    <div class="col-12 col-md-6"><label class="form-label">Contraseña</label><input required name="password" type="password" class="form-control"></div>
                    <div class="col-12 d-grid mt-2"><button class="btn btn-primary">Crear cuenta</button></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    // handlers
    this.querySelector('#loginForm').addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      try{
        login({ email: fd.get('email'), password: fd.get('password') });
        toast('Sesión iniciada','success'); location.reload();
      }catch(err){ toast(err.message,'danger'); }
    });
    this.querySelector('#regForm').addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      try{
        register({
          nid: fd.get('nid'), name: fd.get('name'), nationality: fd.get('nationality'),
          email: fd.get('email'), phone: fd.get('phone'), password: fd.get('password')
        });
        toast('Cuenta creada, ¡bienvenida/o!','success'); location.reload();
      }catch(err){ toast(err.message,'danger'); }
    });
  }
}
customElements.define('login-modal', LoginModal);

import { currentUser } from '../services/authService.js';
import { createBooking } from '../services/reservationService.js';
import { toast } from '../utils/ui.js';

class ReservationModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /*html*/`
      <div class="modal fade" id="reservationModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmar reserva</h5>
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="resForm" class="row g-3">
                <input type="hidden" name="roomId">

                <div class="col-12 col-md-6">
                  <label class="form-label">Desde</label>
                  <input type="date" name="from" class="form-control" required>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Hasta</label>
                  <input type="date" name="to" class="form-control" required>
                </div>
                <div class="col-12">
                  <label class="form-label">Personas</label>
                  <input type="number" min="1" max="10" name="guests" class="form-control" required>
                </div>

                <!-- 📜 Checkbox de políticas -->
                <div class="form-check mt-3">
                  <input class="form-check-input" type="checkbox" id="acceptPolicies">
                  <label class="form-check-label" for="acceptPolicies">
                    Acepto las <a href="politicas.html" target="_blank" rel="noopener">políticas del hotel</a>
                    (check-in 14:00, liberación 16:00 si no me presento).
                  </label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button class="btn btn-primary" id="confirmBtn">Reservar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  open({ roomId, from, to, guests }) {
    const f = this.querySelector('#resForm');
    f.roomId.value = roomId;
    f.from.value = from || '';
    f.to.value = to || '';
    f.guests.value = guests || 1;

    const modal = new bootstrap.Modal(this.querySelector('#reservationModal'));
    modal.show();

    const btn = this.querySelector('#confirmBtn');
    btn.onclick = () => {
      try {
        const s = currentUser();
        if (!s) throw new Error('Debes iniciar sesión para reservar');

        const accept = this.querySelector('#acceptPolicies');
        if (!accept.checked) {
          toast('Debes aceptar las políticas antes de continuar', 'warning');
          return;
        }

        const fd = new FormData(f);
        createBooking({
          roomId: fd.get('roomId'),
          userId: s.id,
          from: fd.get('from'),
          to: fd.get('to'),
          guests: +fd.get('guests')
        });

        toast('Reserva creada con éxito', 'success');
        modal.hide();
        this.dispatchEvent(new CustomEvent('booked', { bubbles: true }));
      } catch (e) {
        toast(e.message, 'danger');
      }
    };
  }
}

customElements.define('reservation-modal', ReservationModal);

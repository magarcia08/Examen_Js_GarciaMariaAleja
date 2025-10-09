// ========= IMPORTS (unificados, sin duplicados) =========
import './components/navbar.js';
import './components/footer.js';
import './components/roomCard.js';        // por si lo usas en otras vistas
import './components/searchBar.js';
import './components/loginRegister.js';
import './components/reservationModal.js';

import { currentUser } from './services/authService.js';

import {
  // Rooms
  listRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from './services/roomService.js';

import {
  // Reservations
  searchAvailable,
  listMyBookings,
  listAllBookings,
  cancelBooking, // valida rol admin en el service
} from './services/reservationService.js';

import { toast, confirmModal } from './utils/ui.js';

// Expose bootstrap if needed
window.bootstrap = window.bootstrap || {};

// --- Helper local: normalizar query ---
function normalizeQuery(q) {
  if (!q) return q;
  return {
    ...q,
    guests: Number(q.guests), // fuerza number
  };
}

// ===================== INDEX (home) =====================
const homeRooms = document.querySelector('#homeRooms');
if (homeRooms) {
  const rooms = listRooms();
  const subset = rooms.slice(0, 3);
  subset.forEach((r) => {
    const el = document.createElement('room-card');
    el.data = r;
    homeRooms.appendChild(el);
  });
  homeRooms.addEventListener('reserve', () => (location.href = 'reservas.html'));
}

// ==================== RESERVAS PAGE =====================
const resultsWrap = document.querySelector('#results');
const resultsCount = document.querySelector('#resultsCount');
const searchBar = document.querySelector('search-bar');
const resModal = document.querySelector('reservation-modal');
const myBookingsWrap = document.querySelector('#myBookings');
const refreshBtn = document.querySelector('#refreshBookings');

let lastQuery = null;

// Render de resultados COMO CARDS grandes, en grilla
function renderResults(list) {
  if (!resultsWrap || !resultsCount) return;

  // Grilla responsive: 1/2/3 por fila
  resultsWrap.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'row-cols-lg-3', 'g-4');
  resultsWrap.innerHTML = '';

  list.forEach((r) => {
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${r.img}" class="card-img-top" alt="${r.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-1">${r.name}</h5>
          <div class="small text-muted mb-2">${r.beds} camas · Máx ${r.maxGuests} personas</div>
          <div class="mb-2 fw-bold">$${(r.price || 0).toLocaleString('es-CO')} <small>COP/noche</small></div>
          <div class="small text-muted">Servicios: ${Array.isArray(r.services) ? r.services.join(', ') : ''}</div>

          <div class="mt-3 d-flex align-items-center gap-2">
            <span class="badge text-bg-light">
              <i class="bi bi-cash-coin me-1"></i>
              Total $${(r.total || 0).toLocaleString('es-CO')}
            </span>
            <button class="btn btn-dark btn-sm ms-auto btn-reserve" data-roomid="${r.id}">
              <i class="bi bi-calendar2-check me-1"></i> Reservar
            </button>
          </div>
        </div>
      </div>
    `;

    resultsWrap.appendChild(col);
  });

  // Click en "Reservar" abre el modal con la última búsqueda
  resultsWrap.querySelectorAll('.btn-reserve').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = currentUser();
      if (!s) {
        document.querySelector('[data-bs-target="#loginModal"]')?.click();
        return;
      }
      resModal?.open({ roomId: btn.dataset.roomid, ...lastQuery });
    });
  });

  resultsCount.textContent = `${list.length} opción(es)`;
}

// Área "Mis reservas" SIN botón cancelar para cliente
function renderMyBookings() {
  if (!myBookingsWrap) return;
  const s = currentUser();
  if (!s) {
    myBookingsWrap.innerHTML =
      '<div class="text-muted small">Inicia sesión para ver tus reservas.</div>';
    return;
  }
  const items = listMyBookings(s.id);
  if (items.length === 0) {
    myBookingsWrap.innerHTML = '<div class="text-muted small">Aún no tienes reservas.</div>';
    return;
  }

  myBookingsWrap.innerHTML = items
    .map(
      (b) => `
    <div class="col-12 col-md-6">
      <div class="card shadow-sm border-0">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center">
            <strong>${b.room?.name || 'Habitación'}</strong>
            <span class="badge text-bg-light">
              <i class="bi bi-calendar2-week me-1"></i>${b.from} → ${b.to}
            </span>
          </div>
          <div class="small text-muted mt-2">
            ${b.guests} huésped(es) · Total $${(b.total || 0).toLocaleString('es-CO')} COP
          </div>
          <div class="alert alert-info mt-3 mb-0 p-2 small" role="alert">
            Para cambios o cancelaciones, por favor contacta al administrador.
          </div>
        </div>
      </div>
    </div>`
    )
    .join('');
}

if (searchBar) {
  // resultados emitidos por el componente de búsqueda
  searchBar.addEventListener('results', (e) => {
    lastQuery = normalizeQuery(e.detail.q);
    renderResults(e.detail.results || searchAvailable(lastQuery));
  });

  // consulta inicial (hoy/mañana, 2 huéspedes)
  const fd = new FormData(searchBar.querySelector('form'));
  lastQuery = normalizeQuery({
    from: fd.get('from'),
    to: fd.get('to'),
    guests: fd.get('guests'),
  });
  renderResults(searchAvailable(lastQuery));

  resModal?.addEventListener('booked', () => {
    renderMyBookings();
  });
  refreshBtn?.addEventListener('click', renderMyBookings);
  renderMyBookings();
}

// ====================== ADMIN PAGE ======================
const adminGuard = document.querySelector('#adminGuard');
const adminContent = document.querySelector('#adminContent');
const btnNewRoom = document.querySelector('#btnNewRoom');
const roomsAdmin = document.querySelector('#roomsAdmin');
const bookingsAdmin = document.querySelector('#bookingsAdmin');
const refreshAllBookings = document.querySelector('#refreshAllBookings');

function requireAdmin() {
  if (!adminGuard || !adminContent) return false;
  const s = currentUser();
  if (!s || s.role !== 'admin') {
    adminGuard.classList.remove('d-none');
    adminContent.classList.add('d-none');
    return false;
  }
  adminGuard.classList.add('d-none');
  adminContent.classList.remove('d-none');
  return true;
}

function renderRoomsAdmin() {
  if (!roomsAdmin) return;
  roomsAdmin.innerHTML = '';
  listRooms().forEach((r) => {
    const card = document.createElement('div');
    card.className = 'col-12 col-md-6 col-lg-4';
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${r.img}" class="card-img-top" alt="${r.name}">
        <div class="card-body">
          <h5 class="card-title">${r.name}</h5>
          <div class="small text-muted mb-2">${r.beds} camas · Máx ${r.maxGuests} personas</div>
          <div class="mb-2 fw-bold">$${r.price.toLocaleString('es-CO')} <small>COP/noche</small></div>
          <div class="small">Servicios: ${r.services.join(', ')}</div>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-outline-primary btn-sm" data-edit="${r.id}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger btn-sm" data-del="${r.id}"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>`;
    roomsAdmin.appendChild(card);
  });
  roomsAdmin.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ok = await confirmModal('Eliminar habitación', '¿Seguro deseas eliminarla?');
      if (!ok) return;
      deleteRoom(btn.dataset.del);
      toast('Habitación eliminada', 'warning');
      renderRoomsAdmin();
    });
  });
  roomsAdmin.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () =>
      openRoomForm(listRooms().find((x) => x.id === btn.dataset.edit))
    );
  });
}

function openRoomForm(room) {
  const wrapper = document.createElement('div');
  const isNew = !room;
  room =
    room || {
      name: '',
      beds: 1,
      maxGuests: 2,
      price: 100000,
      services: ['wifi'],
      img: 'https://picsum.photos/seed/new/800/600',
    };
  wrapper.innerHTML = `
    <div class="modal fade" id="roomForm" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">${isNew ? 'Nueva' : 'Editar'} habitación</h5><button class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <form class="row g-2">
            <div class="col-12"><label class="form-label">Nombre</label><input class="form-control" name="name" value="${room.name}"></div>
            <div class="col-6"><label class="form-label">Camas</label><input type="number" class="form-control" name="beds" value="${room.beds}"></div>
            <div class="col-6"><label class="form-label">Máx personas</label><input type="number" class="form-control" name="maxGuests" value="${room.maxGuests}"></div>
            <div class="col-12"><label class="form-label">Precio/noche (COP)</label><input type="number" class="form-control" name="price" value="${room.price}"></div>
            <div class="col-12"><label class="form-label">Servicios (coma)</label><input class="form-control" name="services" value="${room.services.join(', ')}"></div>
            <div class="col-12"><label class="form-label">Imagen URL</label><input class="form-control" name="img" value="${room.img}"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button class="btn btn-primary" id="saveRoom">Guardar</button>
        </div>
      </div></div>
    </div>`;
  document.body.appendChild(wrapper);
  const modal = new bootstrap.Modal(wrapper.querySelector('.modal'));
  modal.show();
  wrapper.querySelector('#saveRoom').addEventListener('click', () => {
    const fd = new FormData(wrapper.querySelector('form'));
    const data = {
      name: fd.get('name'),
      beds: Number(fd.get('beds')),
      maxGuests: Number(fd.get('maxGuests')),
      price: Number(fd.get('price')),
      services: fd
        .get('services')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      img: fd.get('img'),
    };
    if (isNew) {
      createRoom(data);
    } else {
      updateRoom(room.id, data);
    }
    toast('Guardado', 'success');
    modal.hide();
    renderRoomsAdmin();
  });
  wrapper.querySelector('.modal').addEventListener('hidden.bs.modal', () => wrapper.remove());
}

function renderBookingsAdmin() {
  if (!bookingsAdmin) return;
  bookingsAdmin.innerHTML = '';
  listAllBookings().forEach((b) => {
    const el = document.createElement('div');
    el.className = 'col-12';
    el.innerHTML = `
      <div class="card shadow-sm border-0">
        <div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <strong>${b.room?.name || 'Habitación'}</strong> · <span class="text-muted">${b.user?.name || 'Usuario'}</span>
            <div class="small text-muted">${b.from} → ${b.to} · ${b.guests} huésped(es)</div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-danger btn-sm" data-cancel="${b.id}">
              <i class="bi bi-x-circle"></i> Cancelar
            </button>
          </div>
        </div>
      </div>`;
    bookingsAdmin.appendChild(el);
  });

  bookingsAdmin.querySelectorAll('[data-cancel]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ok = await confirmModal('Cancelar reserva', '¿Confirmas la cancelación?');
      if (!ok) return;
      try {
        const removed = cancelBooking(btn.dataset.cancel);
        if (removed) {
          toast('Reserva cancelada', 'warning');
          renderBookingsAdmin();
          if (lastQuery && resultsWrap) renderResults(searchAvailable(lastQuery));
        } else {
          toast('No se encontró la reserva.', 'danger');
        }
      } catch (err) {
        toast(err.message || 'No autorizado', 'danger');
      }
    });
  });
}

if (requireAdmin()) {
  renderRoomsAdmin();
  renderBookingsAdmin();
  btnNewRoom?.addEventListener('click', () => openRoomForm(null));
  refreshAllBookings?.addEventListener('click', renderBookingsAdmin);
}

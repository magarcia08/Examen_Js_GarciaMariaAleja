// ========= INIT DB =========
import { db } from './storage/storage.js';
db.ensureVersion(); // si no usas versionado, cambia por db.seed()

// ========= UI / COMPONENTS =========
import './components/navbar.js';
import './components/footer.js';
import './components/roomCard.js';
import './components/searchBar.js';
import './components/loginRegister.js';
import './components/reservationModal.js';

// ========= SERVICES =========
import { currentUser } from './services/authService.js';
import { listRooms, createRoom, updateRoom, deleteRoom, getRoomById } from './services/roomService.js';
import { searchAvailable, listMyBookings, listAllBookings, cancelBooking } from './services/reservationService.js';
import { toast, confirmModal } from './utils/ui.js';

// ========= HELPERS =========
window.bootstrap = window.bootstrap || {};
const $ = (sel) => document.querySelector(sel);

// Normaliza objeto de búsqueda (huéspedes number)
function normalizeQuery(q) {
  if (!q) return q;
  return { ...q, guests: Number(q.guests) };
}

/* ================= HOME ================= */
const homeRooms = $('#homeRooms');
if (homeRooms) {
  const rooms = listRooms().slice(0, 3);
  rooms.forEach((r) => {
    const el = document.createElement('room-card');
    el.data = r;
    homeRooms.appendChild(el);
  });
  homeRooms.addEventListener('reserve', () => (location.href = 'booking.html'));
}

/* ============== RESERVAS (público) ============== */
const resultsWrap = $('#results');
const resultsCount = $('#resultsCount');
const searchBar = document.querySelector('search-bar');
const resModal = document.querySelector('reservation-modal');
const myBookingsWrap = $('#myBookings');
const refreshBtn = $('#refreshBookings');

let lastQuery = null;

function renderResults(list) {
  if (!resultsWrap || !resultsCount) return;
  resultsWrap.classList.add('row','row-cols-1','row-cols-md-2','row-cols-lg-3','g-4');
  resultsWrap.innerHTML = '';
  list.forEach((r) => {
    const col = document.createElement('div');
    col.className = 'col';
    const img = r.img || (r.photos?.[0]) || 'https://picsum.photos/seed/fallback/1200/800';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${img}" class="card-img-top" alt="${r.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-1">${r.name}</h5>
          <div class="small text-muted mb-2">${r.beds} camas · Máx ${r.maxGuests} personas</div>
          <div class="mb-2 fw-bold">$${(r.price || 0).toLocaleString('es-CO')} <small>COP/noche</small></div>
          <div class="small text-muted">Servicios: ${Array.isArray(r.services)?r.services.join(', '):(r.amenities||[]).join(', ')}</div>
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
      </div>`;
    resultsWrap.appendChild(col);
  });

  // abrir modal de reserva
  resultsWrap.querySelectorAll('.btn-reserve').forEach((btn) => {
    btn.addEventListener('click', () => {
      const s = currentUser();
      if (!s) { document.querySelector('[data-bs-target="#loginModal"]')?.click(); return; }
      resModal?.open({ roomId: btn.dataset.roomid, ...lastQuery });
    });
  });

  resultsCount.textContent = `${list.length} opción(es)`;
}

function renderMyBookings() {
  if (!myBookingsWrap) return;
  const s = currentUser();
  if (!s) { myBookingsWrap.innerHTML = '<div class="text-muted small">Inicia sesión para ver tus reservas.</div>'; return; }
  const items = listMyBookings(s.id);
  if (!items.length) { myBookingsWrap.innerHTML = '<div class="text-muted small">Aún no tienes reservas.</div>'; return; }
  myBookingsWrap.innerHTML = items.map((b) => `
    <div class="col-12 col-md-6">
      <div class="card shadow-sm border-0">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center">
            <strong>${b.room?.name || 'Habitación'}</strong>
            <span class="badge text-bg-light"><i class="bi bi-calendar2-week me-1"></i>${b.from} → ${b.to}</span>
          </div>
          <div class="small text-muted mt-2">
            ${b.guests} huésped(es) · Total $${(b.total || 0).toLocaleString('es-CO')} COP
          </div>
          <div class="alert alert-info mt-3 mb-0 p-2 small">Para cambios o cancelaciones, por favor contacta al administrador.</div>
        </div>
      </div>
    </div>`).join('');
}

if (searchBar) {
  searchBar.addEventListener('results', (e) => {
    lastQuery = normalizeQuery(e.detail.q);
    renderResults(e.detail.results || searchAvailable(lastQuery));
  });
  const fd = new FormData(searchBar.querySelector('form'));
  lastQuery = normalizeQuery({ from: fd.get('from'), to: fd.get('to'), guests: fd.get('guests') });
  renderResults(searchAvailable(lastQuery));

  resModal?.addEventListener('booked', renderMyBookings);
  refreshBtn?.addEventListener('click', renderMyBookings);
  renderMyBookings();
}

/* ================= ADMIN ================= */
const adminGuard = $('#adminGuard');
const adminContent = $('#adminContent');
const btnNewRoom = $('#btnNewRoom');
const tblRooms = $('#tblRooms');
const tblRes = $('#tblRes');
const refreshAllBookings = $('#refreshAllBookings');
const roomModalEl = $('#roomModal');
const roomForm = $('#roomForm');
let editingRoomId = null;

function requireAdmin() {
  if (!adminGuard || !adminContent) return false; // esta página no es admin
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

// KPIs simples
function renderAdminStats(){
  const st = db.read();
  const rooms = st.rooms?.length || 0;
  const bookings = st.reservations?.length || 0;
  const guests = st.reservations?.reduce((acc, r) => acc + Number(r.guests||0), 0) || 0;
  $('#statRooms') && ($('#statRooms').textContent = rooms);
  $('#statBookings') && ($('#statBookings').textContent = bookings);
  $('#statGuests') && ($('#statGuests').textContent = guests);
}

// Tabla de habitaciones
function renderRoomsTable(){
  if (!tblRooms) return;
  const rows = listRooms().map(r => `
    <tr>
      <td>${r.name}</td>
      <td>${r.maxGuests} pers · ${r.beds} camas</td>
      <td>$${Number(r.price||0).toLocaleString('es-CO')}</td>
      <td>${(r.services||r.amenities||[]).join(', ')}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-dark" data-edit="${r.id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger" data-del="${r.id}">Eliminar</button>
      </td>
    </tr>`).join('');
  tblRooms.innerHTML = rows || '<tr><td colspan="5" class="text-center text-muted">Sin habitaciones</td></tr>';
}

// Manejo modal habitación
function openRoomModal(room){
  const isNew = !room;
  $('#roomModalTitle').textContent = isNew ? 'Nueva habitación' : 'Editar habitación';
  roomForm.name.value = room?.name || '';
  roomForm.beds.value = room?.beds ?? 1;
  roomForm.maxGuests.value = room?.maxGuests ?? 2;
  roomForm.price.value = room?.price ?? 100000;
  roomForm.amenities.value = (room?.services || room?.amenities || []).join(', ');
  roomForm.imageUrl.value = (room?.photos?.[0]) || room?.img || 'https://picsum.photos/seed/new/1200/800';
  new bootstrap.Modal(roomModalEl).show();
}

btnNewRoom && btnNewRoom.addEventListener('click', () => {
  editingRoomId = null;
  openRoomModal(null);
});

tblRooms && tblRooms.addEventListener('click', (ev)=>{
  const id = ev.target?.dataset?.edit;
  const del = ev.target?.dataset?.del;
  if (id){
    editingRoomId = id;
    const r = getRoomById(id);
    openRoomModal(r);
  }
  if (del){
    confirmModal('Eliminar habitación','¿Seguro deseas eliminarla?').then(ok=>{
      if(!ok) return;
      try{ deleteRoom(del); toast('Habitación eliminada','warning'); renderRoomsTable(); renderAdminStats(); }
      catch(e){ toast(e.message || 'Error','danger'); }
    });
  }
});

$('#btnSaveRoom') && $('#btnSaveRoom').addEventListener('click', ()=>{
  const payload = {
    name: roomForm.name.value.trim(),
    beds: Number(roomForm.beds.value),
    maxGuests: Number(roomForm.maxGuests.value),
    price: Number(roomForm.price.value),
    amenities: roomForm.amenities.value.split(',').map(s=>s.trim()).filter(Boolean),
    photos: [ roomForm.imageUrl.value.trim() || 'https://picsum.photos/seed/new/1200/800' ],
  };
  try{
    if (editingRoomId) updateRoom(editingRoomId, payload);
    else createRoom(payload);
    toast('Guardado','success');
    bootstrap.Modal.getInstance(roomModalEl)?.hide();
    renderRoomsTable();
    renderAdminStats();
  }catch(e){
    toast(e.message || 'Error','danger');
  }
});

// Tabla de reservas
function renderBookingsAdmin(){
  if (!tblRes) return;
  const items = listAllBookings(); // con join (room, user)
  if (!items.length){
    tblRes.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Sin reservas</td></tr>';
    return;
  }
  tblRes.innerHTML = items.map(x => `
    <tr>
      <td>${x.room?.name ?? '-'}</td>
      <td>${x.user?.name ?? '-'}</td>
      <td>${x.from}</td>
      <td>${x.to}</td>
      <td>$${Number(x.total||0).toLocaleString('es-CO')}</td>
      <td>${x.guests}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-danger" data-cancel="${x.id}">Cancelar</button>
      </td>
    </tr>`).join('');
}

// Cancelar reserva (delegación)
document.addEventListener('click', async (e)=>{
  const id = e.target?.dataset?.cancel;
  if (!id) return;
  const ok = await confirmModal('Cancelar reserva','¿Confirmas la cancelación?');
  if (!ok) return;
  try{
    const removed = cancelBooking(id, currentUser()); // service valida admin
    if (removed){
      toast('Reserva cancelada','warning');
      renderBookingsAdmin();
      renderAdminStats();
      // si estás en página de búsqueda, refresca resultados
      if (lastQuery && resultsWrap) renderResults(searchAvailable(lastQuery));
    } else {
      toast('No se encontró la reserva','danger');
    }
  }catch(err){
    toast(err.message || 'No autorizado','danger');
  }
});

// Tabs: cuando abren "Reservas"
const tabResBtn = document.querySelector('button[data-bs-target="#tabRes"]');
tabResBtn && tabResBtn.addEventListener('shown.bs.tab', renderBookingsAdmin);
refreshAllBookings && refreshAllBookings.addEventListener('click', renderBookingsAdmin);

// Boot admin (si aplica esta página)
if (requireAdmin()){
  renderAdminStats();
  renderRoomsTable();
  // Si la URL llega con hash #tabRes, carga reservas de una vez
  if (location.hash === '#tabRes') renderBookingsAdmin();
}

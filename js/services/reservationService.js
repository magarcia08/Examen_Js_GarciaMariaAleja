// js/services/reservationService.js
import { db } from '../storage/storage.js';
import { overlaps, nights, combineDateTime } from '../utils/date.js';

// ===== Estados y horarios =====
export const BookingStatus = {
  CONFIRMED:  'CONFIRMED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT:'CHECKED_OUT',
  CANCELLED:  'CANCELLED',
  NO_SHOW:    'NO_SHOW',
};

export const DEFAULT_CHECKIN_TIME  = '14:00'; // 2pm
export const DEFAULT_CHECKOUT_TIME = '11:00';
export const NO_SHOW_CUTOFF_TIME   = '16:00'; // 4pm (2h después del check-in)

// --- helpers internos ---
function normalizeRoom(r){
  return {
    ...r,
    img: r.img || (r.photos?.[0]) || 'https://picsum.photos/seed/room/1200/800',
    services: r.services || r.amenities || [],
  };
}
function joinBooking(b, st){
  return {
    ...b,
    room: normalizeRoom(st.rooms.find(r => r.id === b.roomId) || {}),
    user: st.users.find(u => u.id === b.userId) || {},
  };
}

// =============== SEARCH ===============
export function searchAvailable({ from, to, guests }){
  const st = db.read(), g = Number(guests);

  const roomFree = (roomId) =>
    st.reservations
      // ignorar canceladas y no-show para disponibilidad
      .filter(r => r.roomId === roomId && ![BookingStatus.CANCELLED, BookingStatus.NO_SHOW].includes(r.status))
      .every(r => !overlaps(from, to, r.from, r.to));

  return st.rooms
    .map(normalizeRoom)
    .filter(r => Number(r.maxGuests) === g && roomFree(r.id)) // capacidad EXACTA
    .map(r => ({ ...r, total: nights(from, to) * Number(r.price || 0) }));
}

// =============== CREATE ===============
export function createReservation({ roomId, userId, from, to, guests }){
  const st = db.read();
  const room = st.rooms.find(r => r.id === roomId);
  if(!room) throw new Error('No existe habitación');

  const g = Number(guests);
  if(g !== Number(room.maxGuests)) throw new Error('Capacidad exacta requerida');

  const n = nights(from, to);
  if(n <= 0) throw new Error('Rango inválido');

  const disponible = st.reservations
    .filter(r => r.roomId === roomId && ![BookingStatus.CANCELLED, BookingStatus.NO_SHOW].includes(r.status))
    .every(r => !overlaps(from, to, r.from, r.to));
  if(!disponible) throw new Error('No disponible');

  st.reservations.push({
    id: crypto.randomUUID(),
    roomId, userId, from, to,
    fromTime: DEFAULT_CHECKIN_TIME,   // NUEVO
    toTime:   DEFAULT_CHECKOUT_TIME,  // NUEVO
    guests: room.maxGuests,
    total: n * Number(room.price || 0),
    status: BookingStatus.CONFIRMED,
    createdAt: new Date().toISOString(),
    checkInAt:  null,
    checkOutAt: null,
    updatedAt:  new Date().toISOString(),
  });
  db.write(st);
  return true;
}

// =============== AUTO NO-SHOW & CHECK-IN ===============

// Pasa a NO_SHOW toda reserva CONFIRMED cuyo día "from" ya pasó las 16:00
export function autoReleaseNoShows(now = new Date()) {
  const st = db.read();
  let changed = false;
  for (const r of st.reservations) {
    if (r.status === BookingStatus.CONFIRMED) {
      const cutoff = combineDateTime(r.from, NO_SHOW_CUTOFF_TIME);
      if (now >= cutoff) {
        r.status = BookingStatus.NO_SHOW;
        r.updatedAt = new Date().toISOString();
        changed = true;
      }
    }
  }
  if (changed) db.write(st);
  return changed;
}

export function canCheckIn(b, now = new Date()) {
  if (!b || b.status !== BookingStatus.CONFIRMED) return false;
  return now >= combineDateTime(b.from, DEFAULT_CHECKIN_TIME);
}

export function checkInReservation(id, me, when = new Date()) {
  if (me?.role !== 'admin') throw new Error('Solo admin');
  const st = db.read();
  const i = st.reservations.findIndex(r => r.id === id);
  if (i === -1) throw new Error('No existe');

  const b = st.reservations[i];
  if (!canCheckIn(b, when)) throw new Error('Aún no habilitado para check-in');

  st.reservations[i] = {
    ...b,
    status: BookingStatus.CHECKED_IN,
    checkInAt: new Date(when).toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.write(st);
  return true;
}

// =============== READ (JOIN) ===============
export function listAll(){            // RAW (compat)
  return db.read().reservations;
}
export function listByUser(uid){      // RAW (compat)
  return db.read().reservations.filter(r => r.userId === uid);
}

// Enriquecidos para UI
export function listAllBookings(){
  const st = db.read();
  return st.reservations.map(b => joinBooking(b, st));
}
export function listMyBookings(uid){
  const st = db.read();
  return st.reservations
    .filter(b => b.userId === uid)
    .map(b => joinBooking(b, st));
}

// =============== CANCEL (solo admin) ===============
export function cancelReservation(id, me){
  if(me?.role !== 'admin') throw new Error('Solo admin');
  const st = db.read();
  const i = st.reservations.findIndex(r => r.id === id);
  if(i === -1) throw new Error('No existe');
  st.reservations[i].status = BookingStatus.CANCELLED;
  st.reservations[i].updatedAt = new Date().toISOString();
  db.write(st);
  return true;
}

// Aliases (compat con app.js antiguo)
export const cancelBooking = (id, me) => cancelReservation(id, me);
export const createBooking  = (payload) => createReservation(payload);

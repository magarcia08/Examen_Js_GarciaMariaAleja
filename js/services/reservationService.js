// js/services/reservationService.js
import { db } from '../storage/storage.js';
import { overlaps, nights } from '../utils/date.js';

// --- helpers ---
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
    st.reservations.filter(r => r.roomId === roomId)
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
    .filter(r => r.roomId === roomId)
    .every(r => !overlaps(from, to, r.from, r.to));
  if(!disponible) throw new Error('No disponible');

  st.reservations.push({
    id: crypto.randomUUID(),
    roomId, userId, from, to,
    guests: room.maxGuests,
    total: n * Number(room.price || 0),
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  });
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

// Enriquecidos para UI (lo que espera tu app.js)
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
  st.reservations.splice(i,1);
  db.write(st);
  return true;
}

// Alias para que coincida con los imports de app.js
export const cancelBooking = (id, me) => cancelReservation(id, me);
export const createBooking  = (payload) => createReservation(payload);

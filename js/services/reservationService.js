import { db } from './storage.js';
import { overlaps, nights } from '../utils/date.js';

export function searchAvailable({from, to, guests}){
  const st = db.read();
  const inRange = (roomId)=> st.reservations
    .filter(b=>b.roomId===roomId)
    .every(b=> !overlaps(from, to, b.from, b.to));
  return st.rooms
    .filter(r=> r.maxGuests>=guests && inRange(r.id))
    .map(r=> ({ ...r, total: nights(from,to) * r.price }));
}

export function createBooking({roomId, userId, from, to, guests}){
  const st = db.read();
  // Verify still available
  const booked = st.reservations.filter(b=>b.roomId===roomId);
  if(booked.some(b=> overlaps(from, to, b.from, b.to))) throw new Error('La habitación ya no está disponible en ese rango');
  const room = st.rooms.find(r=>r.id===roomId);
  if(!room) throw new Error('Habitación no encontrada');
  const total = nights(from,to) * room.price;
  const id = 'b'+crypto.randomUUID().slice(0,8);
  st.reservations.push({ id, roomId, userId, from, to, guests, total, createdAt: Date.now() });
  db.setState(st);
  return id;
}

export function cancelBooking(id){
  const st = db.read();
  st.reservations = st.reservations.filter(b=>b.id!==id);
  db.setState(st);
}

export function listMyBookings(userId){
  const st = db.read();
  return st.reservations
    .filter(b=>b.userId===userId)
    .map(b=> ({ ...b, room: st.rooms.find(r=>r.id===b.roomId) }))
    .sort((a,b)=> b.createdAt - a.createdAt);
}

export function listAllBookings(){
  const st = db.read();
  return st.reservations.map(b=> ({ ...b, room: st.rooms.find(r=>r.id===b.roomId), user: st.users.find(u=>u.id===b.userId) }));
}

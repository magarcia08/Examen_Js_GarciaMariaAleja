
import { db } from '../storage/storage.js';
import { overlaps, nights } from '../utils/date.js';

export function searchAvailable({from,to,guests}){
  const st=db.read(), g=Number(guests);
  const inRange = (roomId)=>
    st.reservations.filter(r=>r.roomId===roomId).every(r=>!overlaps(from,to,r.from,r.to));
  return st.rooms
    .filter(r => Number(r.maxGuests)===g && inRange(r.id))
    .map(r => ({...r, total: nights(from,to)*r.price }));
}
export function createReservation({roomId,userId,from,to,guests}){
  const st=db.read();
  const room=st.rooms.find(r=>r.id===roomId); if(!room) throw new Error('No existe habitación');
  if(Number(guests)!==Number(room.maxGuests)) throw new Error('Capacidad exacta requerida');
  const n=nights(from,to); if(n<=0) throw new Error('Rango inválido');
  const ok=st.reservations.filter(r=>r.roomId===roomId).every(r=>!overlaps(from,to,r.from,r.to));
  if(!ok) throw new Error('No disponible');
  st.reservations.push({ id:crypto.randomUUID(), roomId, userId, from, to, guests:room.maxGuests, total:n*room.price, status:'CONFIRMED' });
  db.write(st);
}
export function listAll(){ return db.read().reservations; }
export function listByUser(uid){ return db.read().reservations.filter(r=>r.userId===uid); }
export function cancelReservation(id, me){
  if(me?.role!=='admin') throw new Error('Solo admin');
  const st=db.read(); const i=st.reservations.findIndex(r=>r.id===id); if(i===-1) throw new Error('No existe');
  st.reservations.splice(i,1); db.write(st);
}

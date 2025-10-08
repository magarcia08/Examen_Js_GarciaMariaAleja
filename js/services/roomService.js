import { db } from './storage.js';
export function listRooms(){ return db.read().rooms; }
export function createRoom(room){
  const st = db.read();
  const id = 'r'+(Math.random().toString(36).slice(2,7));
  st.rooms.push({ id, ...room });
  db.setState(st);
  return id;
}
export function updateRoom(id, patch){
  const st = db.read();
  const i = st.rooms.findIndex(r=>r.id===id);
  if(i<0) throw new Error('No existe');
  st.rooms[i] = { ...st.rooms[i], ...patch };
  db.setState(st);
}
export function deleteRoom(id){
  const st = db.read();
  st.rooms = st.rooms.filter(r=>r.id!==id);
  // Remove future reservations of deleted room
  st.reservations = st.reservations.filter(b=>b.roomId!==id);
  db.setState(st);
}

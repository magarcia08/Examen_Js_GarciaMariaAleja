
import { db } from '../storage/storage.js';
function slugify(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
export function listRooms(){ return db.read().rooms; }
export function getRoomBySlug(slug){ return db.read().rooms.find(r=>r.slug===slug) || null; }
export function getRoomById(id){ return db.read().rooms.find(r=>r.id===id) || null; }
export function createRoom(payload, me){
  if(me?.role!=='admin') throw new Error('Solo admin');
  const st=db.read();
  const id=crypto.randomUUID();
  st.rooms.push({
    id,
    name: payload.name||'Nueva',
    maxGuests: Number(payload.maxGuests)||2,
    beds: Number(payload.beds)||1,
    price: Number(payload.price)||100000,
    amenities: payload.amenities||[],
    photos: payload.photos||['https://picsum.photos/seed/new/1200/800'],
    slug: slugify(payload.name||id),
    short: payload.short||'Nueva habitación',
    desc: payload.desc||'Descripción pendiente.'
  });
  db.write(st);
}
export function updateRoom(id,payload,me){
  if(me?.role!=='admin') throw new Error('Solo admin');
  const st=db.read(); const r=st.rooms.find(x=>x.id===id); if(!r) throw new Error('No existe');
  r.name=payload.name??r.name;
  r.maxGuests=Number(payload.maxGuests??r.maxGuests);
  r.beds=Number(payload.beds??r.beds);
  r.price=Number(payload.price??r.price);
  r.amenities=payload.amenities??r.amenities;
  if(payload.photos?.length) r.photos=payload.photos;
  db.write(st);
}
export function deleteRoom(id,me){
  if(me?.role!=='admin') throw new Error('Solo admin');
  const st=db.read(); const i=st.rooms.findIndex(x=>x.id===id); if(i===-1) throw new Error('No existe');
  st.rooms.splice(i,1); db.write(st);
}

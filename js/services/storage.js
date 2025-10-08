const KEY = 'hrc-state-v1';
const DEFAULT = {
  users: [
    { id:'u-admin', nid:'999', name:'Admin', nationality:'CO', email:'admin@hotel.com', phone:'', password:'admin123', role:'admin' }
  ],
  rooms: [
    { id:'r1', name:'Deluxe King', beds:1, maxGuests:2, price:280000, services:['wifi','minibar','jacuzzi'], img:'https://picsum.photos/seed/r1/800/600' },
    { id:'r2', name:'Twin Comfort', beds:2, maxGuests:3, price:220000, services:['wifi','minibar'], img:'https://picsum.photos/seed/r2/800/600' },
    { id:'r3', name:'Suite Familiar', beds:3, maxGuests:5, price:420000, services:['wifi','minibar','jacuzzi'], img:'https://picsum.photos/seed/r3/800/600' }
  ],
  reservations: [
    // sample: { id, roomId, userId, from, to, guests, total }
  ],
  session: null
};
function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw){ localStorage.setItem(KEY, JSON.stringify(DEFAULT)); return structuredClone(DEFAULT); }
    return JSON.parse(raw);
  }catch(e){ console.warn('bad state, resetting', e); localStorage.setItem(KEY, JSON.stringify(DEFAULT)); return structuredClone(DEFAULT); }
}
function save(state){ localStorage.setItem(KEY, JSON.stringify(state)); }
export const db = {
  read(){ return load(); },
  write(patch){ const s = load(); const next = { ...s, ...patch }; save(next); return next; },
  setState(next){ save(next); },
  reset(){ save(DEFAULT); }
};

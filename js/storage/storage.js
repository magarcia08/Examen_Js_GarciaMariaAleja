// storage/storage.js — Con control de versión y fusión no destructiva
const KEY      = 'aurum-hotel-db';
const VER_KEY  = 'aurum-hotel-db-version';
const DB_VERSION = '1.1.0'; 

function defaultDB(){
  return {
    users:[
      { id:'u-1', dni:'100', name:'Admin', email:'admin@aurum.com', phone:'3000000000', password:'admin', role:'admin' },
      { id:'u-2', dni:'200', name:'María', email:'maria@mail.com', phone:'3010000000', password:'123456', role:'user' }
    ],
    rooms:[
      {
        id:'r-01',
        name:'Suite Imperial',
        maxGuests:2,
        beds:1,
        price:420000,
        amenities:['wifi','jacuzzi','desayuno'],
        photos:['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'suite-imperial',
        short:'Elegancia con jacuzzi',
        desc:'Amplia suite con jacuzzi y vista panorámica. Ideal para parejas que buscan lujo y privacidad.'
      },
      {
        id:'r-02',
        name:'Doble Premium',
        maxGuests:2,
        beds:2,
        price:260000,
        amenities:['wifi','tv'],
        photos:['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'doble-premium',
        short:'Confort para dos',
        desc:'Habitación doble con acabados premium y una decoración moderna y elegante.'
      },
      {
        id:'r-03',
        name:'Triple Vista Parque',
        maxGuests:3,
        beds:3,
        price:300000,
        amenities:['wifi','balcón'],
        photos:['https://images.pexels.com/photos/189293/pexels-photo-189293.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'triple-vista-parque',
        short:'Ideal para tres',
        desc:'Perfecta para familias pequeñas o grupos, con vista al parque central.'
      },
      {
        id:'r-04',
        name:'Familiar Conectada',
        maxGuests:5,
        beds:4,
        price:520000,
        amenities:['wifi','conectada'],
        photos:['https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'familiar-conectada',
        short:'Perfecta para familias',
        desc:'Dos ambientes conectados que brindan amplitud y comodidad para toda la familia.'
      },
      {
        id:'r-05',
        name:'Loft Panorámico',
        maxGuests:2,
        beds:1,
        price:340000,
        amenities:['wifi','balcón'],
        photos:['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'loft-panoramico',
        short:'Vista 180°',
        desc:'Loft moderno con vistas espectaculares y un ambiente relajante.'
      },
      {
        id:'r-06',
        name:'Ático Familiar',
        maxGuests:4,
        beds:3,
        price:410000,
        amenities:['wifi','cocina'],
        photos:['https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'atico-familiar',
        short:'Espacio y confort',
        desc:'Ático amplio con cocina equipada y espacios ideales para compartir en familia.'
      },
      {
        id:'r-07',
        name:'Doble Económica',
        maxGuests:2,
        beds:2,
        price:180000,
        amenities:['wifi'],
        photos:['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'doble-economica',
        short:'Funcional y cómoda',
        desc:'Opción accesible sin sacrificar calidad ni comodidad.'
      },
      {
        id:'r-08',
        name:'Suite Spa',
        maxGuests:2,
        beds:1,
        price:480000,
        amenities:['wifi','spa','jacuzzi'],
        photos:['https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'suite-spa',
        short:'Wellness total',
        desc:'Suite con spa privado y jacuzzi. Ideal para escapadas románticas.'
      },
      {
        id:'r-09',
        name:'King Balcony',
        maxGuests:2,
        beds:1,
        price:310000,
        amenities:['wifi','balcón'],
        photos:['https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'king-balcony',
        short:'King con balcón',
        desc:'Balcón amplio con vista urbana y una cama king size para máximo confort.'
      },
      {
        id:'r-10',
        name:'Familiar Terraza',
        maxGuests:4,
        beds:3,
        price:390000,
        amenities:['wifi','terraza'],
        photos:['https://images.pexels.com/photos/276671/pexels-photo-276671.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'],
        slug:'familiar-terraza',
        short:'Terraza privada',
        desc:'Terraza para compartir en familia con una experiencia acogedora y relajante.'
      }
    ],
    reservations:[],
    session:{ currentUserId:null }
  };
}

/** Fusiona datos existentes con el seed nuevo:
 *  - Conserva users, reservations, session
 *  - Actualiza habitaciones base por ID con fotos/textos/amenities nuevas
 *  - Mantiene habitaciones extras creadas por admin
 */
function mergePreservingUserData(oldSt, fresh){
  const old = oldSt || { users:[], rooms:[], reservations:[], session:{currentUserId:null} };
  const freshRoomsById = new Map(fresh.rooms.map(r => [r.id, r]));
  const oldRoomsById   = new Map(old.rooms.map(r => [r.id, r]));

  // 1) Para cada habitación del seed, actualizamos manteniendo campos variables del admin si aplica
  const mergedRooms = fresh.rooms.map(seedRoom => {
    const existing = oldRoomsById.get(seedRoom.id);
    if(!existing) return seedRoom;
    // Mantener precio/camas/capacidad si el admin los cambió, pero tomar nuevas fotos + textos del seed
    return {
      ...existing,
      name: seedRoom.name,
      slug: seedRoom.slug,
      short: seedRoom.short,
      desc: seedRoom.desc,
      amenities: seedRoom.amenities,
      photos: seedRoom.photos
    };
  });

  // 2) Agregar habitaciones “extras” que no existen en el seed (creadas por admin)
  for(const r of old.rooms){
    if(!freshRoomsById.has(r.id)){
      mergedRooms.push(r);
    }
  }

  return {
    users: old.users,
    rooms: mergedRooms,
    reservations: old.reservations,
    session: old.session
  };
}

export const db = {
  read(){
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultDB();
  },
  write(data){
    localStorage.setItem(KEY, JSON.stringify(data));
  },
  seed(){
    if(!localStorage.getItem(KEY)){
      this.write(defaultDB());
      localStorage.setItem(VER_KEY, DB_VERSION);
    }
  },
  reset(){
    localStorage.removeItem(KEY);
    localStorage.removeItem(VER_KEY);
    this.seed();
  },
  /**  fusiona conservando usuarios/reservas y actualiza fotos/textos/amenities de rooms seed.
   *   - Si no hay data: siembra seed nuevo.
   */
  ensureVersion(){
    const currentVer = localStorage.getItem(VER_KEY);
    if(currentVer === DB_VERSION){
      // Ya está actualizado
      if(!localStorage.getItem(KEY)) this.seed();
      return;
    }

    const hadData = !!localStorage.getItem(KEY);
    if(hadData){
      try{
        const oldState = this.read();
        const fresh = defaultDB();
        const merged = mergePreservingUserData(oldState, fresh);
        this.write(merged);
      }catch(e){
        // Si algo falla, hacemos reset completo como fallback
        console.warn('Fallo merge de versión, reseteando DB:', e);
        this.reset();
      }
    }else{
      this.seed();
    }
    localStorage.setItem(VER_KEY, DB_VERSION);
  }
};

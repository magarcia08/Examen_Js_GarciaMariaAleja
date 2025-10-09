
const KEY='aurum-hotel-db';
function defaultDB(){
  return {
    users:[
      { id:'u-1', dni:'100', name:'Admin', email:'admin@aurum.com', phone:'3000000000', password:'admin', role:'admin' },
      { id:'u-2', dni:'200', name:'María', email:'maria@mail.com', phone:'3010000000', password:'123456', role:'user' }
    ],
    rooms:[
      { id:'r-01', name:'Suite Imperial', maxGuests:2, beds:1, price:420000, amenities:['wifi','jacuzzi','desayuno'], photos:['https://picsum.photos/seed/a01/1200/800'], slug:'suite-imperial', short:'Elegancia con jacuzzi', desc:'Amplia suite con jacuzzi y vista.' },
      { id:'r-02', name:'Doble Premium', maxGuests:2, beds:2, price:260000, amenities:['wifi','tv'], photos:['https://picsum.photos/seed/a02/1200/800'], slug:'doble-premium', short:'Confort para dos', desc:'Habitación doble con acabados premium.' },
      { id:'r-03', name:'Triple Vista Parque', maxGuests:3, beds:3, price:300000, amenities:['wifi','balcón'], photos:['https://picsum.photos/seed/a03/1200/800'], slug:'triple-vista-parque', short:'Ideal para tres', desc:'Vista al parque central.' },
      { id:'r-04', name:'Familiar Conectada', maxGuests:5, beds:4, price:520000, amenities:['wifi','conectada'], photos:['https://picsum.photos/seed/a04/1200/800'], slug:'familiar-conectada', short:'Perfecta para familias', desc:'Dos ambientes conectados.' },
      { id:'r-05', name:'Loft Panorámico', maxGuests:2, beds:1, price:340000, amenities:['wifi','balcón'], photos:['https://picsum.photos/seed/a05/1200/800'], slug:'loft-panoramico', short:'Vista 180°', desc:'Loft moderno con vista.' },
      { id:'r-06', name:'Ático Familiar', maxGuests:4, beds:3, price:410000, amenities:['wifi','cocina'], photos:['https://picsum.photos/seed/a06/1200/800'], slug:'atico-familiar', short:'Espacio y confort', desc:'Ático con cocina equipada.' },
      { id:'r-07', name:'Doble Económica', maxGuests:2, beds:2, price:180000, amenities:['wifi'], photos:['https://picsum.photos/seed/a07/1200/800'], slug:'doble-economica', short:'Funcional y cómoda', desc:'Opción accesible sin sacrificar calidad.' },
      { id:'r-08', name:'Suite Spa', maxGuests:2, beds:1, price:480000, amenities:['wifi','spa','jacuzzi'], photos:['https://picsum.photos/seed/a08/1200/800'], slug:'suite-spa', short:'Wellness total', desc:'Spa privado en la suite.' },
      { id:'r-09', name:'King Balcony', maxGuests:2, beds:1, price:310000, amenities:['wifi','balcón'], photos:['https://picsum.photos/seed/a09/1200/800'], slug:'king-balcony', short:'King con balcón', desc:'Balcón amplio con vista urbana.' },
      { id:'r-10', name:'Familiar Terraza', maxGuests:4, beds:3, price:390000, amenities:['wifi','terraza'], photos:['https://picsum.photos/seed/a10/1200/800'], slug:'familiar-terraza', short:'Terraza privada', desc:'Terraza para compartir en familia.' }
    ],
    reservations:[],
    session:{ currentUserId:null }
  };
}
export const db = {
  read(){ return JSON.parse(localStorage.getItem(KEY) || JSON.stringify(defaultDB())); },
  write(d){ localStorage.setItem(KEY, JSON.stringify(d)); },
  seed(){ if(!localStorage.getItem(KEY)) this.write(defaultDB()); },
  reset(){ localStorage.removeItem(KEY); this.seed(); }
};

// js/utils/date.js

// Convierte a 'YYYY-MM-DD' (zona local, sin hora)
export function toISO(input = new Date()){
  const d = new Date(input);
  d.setHours(0,0,0,0);
  // slice(0,10) -> 'YYYY-MM-DD'
  return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10);
}

// Suma días a una fecha (acepta Date o string)
export function addDays(input, days = 1){
  const d = new Date(input);
  d.setDate(d.getDate() + Number(days || 0));
  return d;
}

// Hoy en 'YYYY-MM-DD'
export function today(){
  return toISO(new Date());
}

// Noches entre dos fechas (ceil por si cruza medianoche)
export function nights(from, to){
  const A = new Date(from);
  const B = new Date(to);
  const ms = B - A;
  return ms > 0 ? Math.ceil(ms / 86400000) : 0;
}

// ¿Rangos se solapan? (A: from->to, B: from->to)
export function overlaps(aFrom, aTo, bFrom, bTo){
  const A = new Date(aFrom).getTime();
  const B = new Date(aTo).getTime();
  const C = new Date(bFrom).getTime();
  const D = new Date(bTo).getTime();
  // Intersección abierta: [A,B) con [C,D)
  return A < D && C < B;
}

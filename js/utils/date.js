export function toISO(date){
  const d = new Date(date);
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}
export function nights(from,to){
  const a = new Date(toISO(from));
  const b = new Date(toISO(to));
  return Math.max(0, Math.ceil((b-a)/(1000*60*60*24)));
}
export function overlaps(aStart,aEnd,bStart,bEnd){
  // [start, end) convention
  const A1 = new Date(aStart), A2 = new Date(aEnd);
  const B1 = new Date(bStart), B2 = new Date(bEnd);
  return A1 < B2 && B1 < A2;
}

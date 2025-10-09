
export function overlaps(aFrom, aTo, bFrom, bTo){
  const A = new Date(aFrom).getTime();
  const B = new Date(aTo).getTime();
  const C = new Date(bFrom).getTime();
  const D = new Date(bTo).getTime();
  return A < D && C < B;
}
export function nights(from,to){
  const ms = new Date(to) - new Date(from);
  return ms > 0 ? Math.ceil(ms / (1000*60*60*24)) : 0;
}

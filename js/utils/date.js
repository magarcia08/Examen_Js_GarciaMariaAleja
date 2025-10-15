// js/utils/date.js — versión final limpia
export function toISO(input = new Date()){
  const d = new Date(input);
  d.setHours(0,0,0,0);
  return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10);
}

export function addDays(input, days = 1){
  const d = new Date(input);
  d.setDate(d.getDate() + Number(days || 0));
  return d;
}

export function today(){
  return toISO(new Date());
}

export function atMidnight(d) {
  const x = new Date(d);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate());
}

export function nights(from, to) {
  const A = atMidnight(from), B = atMidnight(to);
  return Math.floor((B - A) / 86400000);
}

export function overlaps(aFrom, aTo, bFrom, bTo) {
  const A1 = atMidnight(aFrom), A2 = atMidnight(aTo);
  const B1 = atMidnight(bFrom), B2 = atMidnight(bTo);
  return (A1 < B2) && (B1 < A2);
}

// Para gestionar horarios (check-in y no-show)
export function combineDateTime(dateStr, timeStr = '00:00') {
  return new Date(`${dateStr}T${timeStr}`);
}

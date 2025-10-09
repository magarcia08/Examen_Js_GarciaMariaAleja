
export function bookingBar(){
  const today=new Date().toISOString().slice(0,10);
  const tomorrow=new Date(Date.now()+86400000).toISOString().slice(0,10);
  return `
  <div class="booking-sticky p-3">
    <div class="row g-2 align-items-end">
      <div class="col-12 col-sm-4"><label class="form-label">Desde</label><input id="bkFrom" class="form-control" type="date" value="${today}"></div>
      <div class="col-12 col-sm-4"><label class="form-label">Hasta</label><input id="bkTo" class="form-control" type="date" value="${tomorrow}"></div>
      <div class="col-12 col-sm-2"><label class="form-label">Máx personas</label>
        <select id="bkGuests" class="form-select">
          <option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
        </select>
      </div>
      <div class="col-12 col-sm-2"><button id="btnSearch" class="btn btn-primary w-100">Buscar</button></div>
    </div>
  </div>`;
}

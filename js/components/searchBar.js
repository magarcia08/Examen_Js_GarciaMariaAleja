import { searchAvailable } from '../services/reservationService.js';
import { toISO } from '../utils/date.js';

class SearchBar extends HTMLElement{
  connectedCallback(){
    const today = toISO(new Date());
    const tomorrow = toISO(Date.now()+86400000);
    this.innerHTML = /*html*/`
      <form class="row g-3 bg-white rounded-4 shadow-sm p-3 align-items-end" id="searchForm">
        <div class="col-12 col-md-4">
          <label class="form-label">Desde</label>
          <input required type="date" min="${today}" class="form-control" name="from" value="${today}">
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Hasta</label>
          <input required type="date" min="${tomorrow}" class="form-control" name="to" value="${tomorrow}">
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label">Personas</label>
          <input required type="number" min="1" max="10" class="form-control" name="guests" value="2">
        </div>
        <div class="col-12 col-md-1 d-grid">
          <button class="btn btn-dark">Buscar</button>
        </div>
      </form>`;
    this.querySelector('#searchForm').addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const q = {
        from: fd.get('from'),
        to: fd.get('to'),
        guests: +fd.get('guests')
      };
      const results = searchAvailable(q);
      const ev = new CustomEvent('results', { detail: { q, results }, bubbles:true });
      this.dispatchEvent(ev);
    });
  }
}
customElements.define('search-bar', SearchBar);

// js/components/roomCard.js
class RoomCard extends HTMLElement{
  set data(v){ this._data=v; this.render(); }
  render(){
    const r = this._data; if(!r){ this.innerHTML=''; return; }
    this.innerHTML = /*html*/`
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card room-card h-100">
          <img src="${r.img}" class="card-img-top" alt="${r.name}">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title mb-1">${r.name}</h5>
              <span class="badge badge-soft"><i class="bi bi-people me-1"></i>${r.maxGuests}</span>
            </div>
            <p class="small text-muted mb-2">
              <i class="bi bi-moon-stars-fill me-1"></i>${r.beds} camas ·
              ${r.services.map(s=>`<span class="me-2"><i class="bi bi-check2-circle"></i> ${s}</span>`).join('')}
            </p>
            ${r.total!==undefined? `
              <div class="mb-2">
                <span class="price h5">$${r.total.toLocaleString('es-CO')}</span>
                <small class="text-muted"> COP · total</small>
              </div>` : ''
            }
            <div class="mt-auto d-grid">
              <button class="btn btn-primary" data-room="${r.id}">Reservar</button>
            </div>
          </div>
        </div>
      </div>`;
    this.querySelector('button')?.addEventListener('click', ()=>{
      this.dispatchEvent(new CustomEvent('reserve',{ detail:{ roomId:r.id }, bubbles:true }));
    });
  }
}
customElements.define('room-card', RoomCard);

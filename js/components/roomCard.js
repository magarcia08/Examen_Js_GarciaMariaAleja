
export function roomCard(r){
  const photo=(r.photos&&r.photos[0])||'https://picsum.photos/seed/fallback/1200/800';
  const amenities=(r.amenities||[]).slice(0,3).map(a=>`<span class="badge badge-soft me-1">${a}</span>`).join('');
  return `
    <div class="col">
      <div class="card room-card h-100">
        <img src="${photo}" class="card-img-top" alt="${r.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${r.name}</h5>
          <p class="mb-1"><i class="bi bi-people me-1"></i> ${r.maxGuests} huéspedes · ${r.beds} camas</p>
          <div class="mb-2">${amenities}</div>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="price">$${r.price.toLocaleString('es-CO')}</span>
            <a href="room.html?slug=${encodeURIComponent(r.slug)}" class="btn btn-sm btn-outline-dark">Ver más</a>
          </div>
        </div>
      </div>
    </div>`;
}

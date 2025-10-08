export function toast(msg,type='primary'){
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
  el.role='alert'; el.ariaLive='assertive'; el.ariaAtomic='true';
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  document.body.appendChild(el);
  const t = new bootstrap.Toast(el, { delay: 3000 });
  t.show();
  el.addEventListener('hidden.bs.toast', ()=> el.remove());
}
export function confirmModal(title,body){
  return new Promise((resolve)=>{
    const id = 'confirm-'+Math.random().toString(36).slice(2);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="modal fade" tabindex="-1" id="${id}">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">${title}</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body"><p>${body}</p></div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" id="${id}-ok">Confirmar</button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.appendChild(wrapper);
    const modal = new bootstrap.Modal(wrapper.querySelector('.modal'));
    modal.show();
    wrapper.querySelector('#'+id+'-ok').addEventListener('click', ()=>{ resolve(true); modal.hide(); });
    wrapper.querySelector('.btn-close').addEventListener('click', ()=> resolve(false));
    wrapper.querySelector('[data-bs-dismiss="modal"]').addEventListener('click', ()=> resolve(false));
    wrapper.querySelector('.modal').addEventListener('hidden.bs.modal', ()=> wrapper.remove());
  });
}

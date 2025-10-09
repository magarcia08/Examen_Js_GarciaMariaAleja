
export function toast(msg, type='info'){
  const box = document.createElement('div');
  box.className = `position-fixed top-0 end-0 p-3`;
  box.style.zIndex = 2000;
  box.innerHTML = `
    <div class="toast align-items-center text-bg-${type} border-0 show" role="alert">
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`;
  document.body.appendChild(box);
  setTimeout(()=> box.remove(), 2500);
}
export function navbarScrollEffect(){
  const nav = document.querySelector('.navbar.luxe');
  if(!nav) return;
  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  document.addEventListener('scroll', toggle);
  toggle();
}

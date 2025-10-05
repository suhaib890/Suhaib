(function(){
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));

  const overlay = qs('.overlay');
  const drawer = qs('.drawer');
  const search = qs('.search');

  function openDrawer(){
    drawer.setAttribute('aria-hidden','false');
    overlay.hidden = false;
  }
  function closeDrawer(){
    drawer.setAttribute('aria-hidden','true');
    overlay.hidden = true;
  }
  function openSearch(){
    search.setAttribute('aria-hidden','false');
  }
  function closeSearch(){
    search.setAttribute('aria-hidden','true');
  }

  // Topbar actions
  qsa('.topbar__actions .icon-btn').forEach(btn => {
    const action = btn.getAttribute('data-action');
    if(action === 'menu') btn.addEventListener('click', openDrawer);
    if(action === 'search') btn.addEventListener('click', openSearch);
    if(action === 'account') btn.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
    if(action === 'cart') btn.addEventListener('click', () => {
      const badge = btn.querySelector('.badge');
      const val = parseInt(badge.textContent || '0', 10) + 1;
      badge.textContent = String(val);
      badge.classList.remove('pulse');
      // trigger reflow for animation restart
      void badge.offsetWidth;
      badge.classList.add('pulse');
    });
  });

  // Drawer controls
  qs('.drawer__close')?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', () => {
    closeDrawer();
  });

  // Smooth scroll links from drawer
  qsa('.drawer__list a[data-scroll]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('data-scroll');
      const el = id ? document.getElementById(id) : null;
      if(el){
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }
      closeDrawer();
    });
  });

  // Search form handlers
  qs('.search__close')?.addEventListener('click', closeSearch);
  qs('.search__form')?.addEventListener('submit', e => {
    e.preventDefault();
    const term = qs('.search__input')?.value?.trim();
    if(term){
      alert('Searching for: ' + term);
    }
    closeSearch();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      closeDrawer();
      closeSearch();
    }
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      openSearch();
    }
  });

  // Products fetch + render
  async function loadProducts(){
    try{
      const res = await fetch('products.json', {cache:'no-cache'});
      const products = await res.json();
      const grid = qs('#productsGrid');
      if(!grid) return;
      grid.innerHTML = products.map(p => `
        <div class="card">
          <img src="${p.image}" alt="${p.name}">
          <div class="card__body">
            <h3 class="card__name">${p.name}</h3>
            <div class="card__row">
              <span class="price">₹${p.price}</span>
              <button class="add-btn" data-id="${p.id}">Add</button>
            </div>
          </div>
        </div>
      `).join('');

      grid.addEventListener('click', e => {
        const btn = e.target.closest('.add-btn');
        if(!btn) return;
        // Simulate add to cart by bumping header badge
        const cartBtn = qs('.topbar__actions [data-action="cart"]');
        cartBtn?.click();
      });
    }catch(err){
      console.error('Failed to load products', err);
    }
  }
  loadProducts();

  // Footer year
  const y = document.getElementById('year');
  if(y) y.textContent = String(new Date().getFullYear());

  // Dev modal open/close
  const devBtn = document.getElementById('devBtn');
  const devModal = document.getElementById('devModal');
  devBtn?.addEventListener('click', ()=>{
    if(devModal){ devModal.hidden = false; }
  });
  devModal?.addEventListener('click', (e)=>{
    if(e.target === devModal || e.target.closest('.dev-modal__close')){
      devModal.hidden = true;
    }
  });
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && devModal && !devModal.hidden){ devModal.hidden = true; }
  });
})();

(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Drawer logic
  const drawer = $('.drawer');
  const overlay = $('.overlay');
  const openMenuBtn = document.querySelector('[data-action="menu"]');
  const closeBtn = $('.drawer__close');

  function openDrawer(){
    drawer.setAttribute('aria-hidden','false');
    overlay.hidden = false;
  }
  function closeDrawer(){
    drawer.setAttribute('aria-hidden','true');
    overlay.hidden = true;
  }
  openMenuBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  // Smooth scroll for drawer links
  $$('.drawer__list a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = a.getAttribute('data-scroll');
      if(id){
        document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
      }
      closeDrawer();
    });
  });

  // Cart badge increment with pulse animation
  const cartBtn = document.querySelector('[data-action="cart"]');
  const badge = cartBtn?.querySelector('.badge');
  cartBtn?.addEventListener('click', ()=>{
    const current = parseInt(badge?.textContent||'0',10) || 0;
    if(badge){
      badge.textContent = String(current + 1);
      badge.classList.remove('pulse');
      // force reflow to restart animation
      void badge.offsetWidth;
      badge.classList.add('pulse');
    }
  });

  // Bottom bar actions
  const bb = document.querySelector('.bottom-bar');
  bb?.addEventListener('click', (e)=>{
    const target = e.target.closest('button');
    if(!target) return;
    const label = target.getAttribute('aria-label');
    switch(label){
      case 'Back':
        history.length > 1 ? history.back() : window.scrollTo({top:0,behavior:'smooth'});
        break;
      case 'Forward':
        history.forward();
        break;
      case 'Home':
        window.scrollTo({top:0,behavior:'smooth'});
        break;
      default:
        break;
    }
  });
})();



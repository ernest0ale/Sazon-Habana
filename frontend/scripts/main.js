// ============================================
// MAIN.JS - FUNCIONES GLOBALES
// ============================================

let listadoCurrentPage = 1;
let itemsPerPage = 9;
let listadoQuery = '';

// ===== FUNCIÓN PARA ACTUALIZAR LOGO SEGÚN TEMA =====
function updateHeaderLogo() {
  const isDark = document.documentElement.classList.contains('dark');
  const logo = document.getElementById('headerLogo');
  if (logo) {
    logo.src = isDark ? 'resources/sazonHabana_darkLogo.png' : 'resources/sazonHabana_lightLogo.png';
  }
}

// ===== CREAR TARJETA DE RESTAURANTE =====
function createRestaurantCard(rest) {
  const isOpen = isRestaurantOpen(rest);
  const statusText = isOpen ? 'Abierto' : 'Cerrado';
  const statusClass = isOpen ? 'open' : 'closed';

  const card = document.createElement('div');
  card.className = 'restaurant-card';
  card.setAttribute('onclick', `window.location.href='detalles.html?id=${rest.id}'`);

  card.innerHTML = `
    <div class="card-image-wrapper">
      <img src="${rest.img}" alt="${rest.nombre}" class="card-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600'">
    </div>
    <div class="card-body">
      <div class="card-name">${rest.nombre}</div>
      <div class="card-meta">
        <span class="status-text ${statusClass}"><span class="status-dot ${statusClass}"></span>${statusText}</span>
        <span class="divider">·</span>
        <span class="rating"><i class="fa-solid fa-star"></i> ★</span>
      </div>
      <div class="card-category">
        <i class="fa-regular fa-compass"></i> ${rest.tipo.charAt(0).toUpperCase() + rest.tipo.slice(1)} · ${rest.municipio}
      </div>
      <div class="card-footer">
        <div>
          <div class="star-dish-label">Plato estrella</div>
          <div class="star-dish-name">${rest.platosPopulares[0]?.nombre || 'Especialidad de la Casa'}</div>
        </div>
        <i class="fa-solid fa-chevron-right arrow-icon"></i>
      </div>
    </div>
  `;

  return card;
}

// ===== RENDERIZAR CARRUSELES =====
function renderHomeCarruseles() {
  let rest = getRestaurantes();
  if (!rest || rest.length === 0) return;
  
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const nuevos = rest.filter(r => {
    const createdAt = new Date(r.createdAt);
    return createdAt >= oneMonthAgo;
  });

  const populares = [...rest].slice(0, 10);
  const mejorValorados = [...rest].slice(0, 10);

  ['carrusel-populares', 'carrusel-nuevos', 'carrusel-mejor-valorados'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });

  const nuevosContainer = document.getElementById('home-nuevos-container');
  const popularesContainer = document.getElementById('home-populares-container');
  const mejoresContainer = document.getElementById('home-mejores-container');

  if (nuevos.length === 0 && nuevosContainer) {
    nuevosContainer.style.display = 'none';
  } else if (nuevosContainer) {
    nuevosContainer.style.display = 'block';
    nuevos.forEach(r => {
      const card = createRestaurantCard(r);
      card.classList.add('carrusel-card');
      const container = document.getElementById('carrusel-nuevos');
      if (container) container.appendChild(card);
    });
  }

  if (populares.length === 0 && popularesContainer) {
    popularesContainer.style.display = 'none';
  } else if (popularesContainer) {
    popularesContainer.style.display = 'block';
    populares.slice(0, 10).forEach(r => {
      const card = createRestaurantCard(r);
      card.classList.add('carrusel-card');
      const container = document.getElementById('carrusel-populares');
      if (container) container.appendChild(card);
    });
  }

  if (mejorValorados.length === 0 && mejoresContainer) {
    mejoresContainer.style.display = 'none';
  } else if (mejoresContainer) {
    mejoresContainer.style.display = 'block';
    mejorValorados.slice(0, 10).forEach(r => {
      const card = createRestaurantCard(r);
      card.classList.add('carrusel-card');
      const container = document.getElementById('carrusel-mejor-valorados');
      if (container) container.appendChild(card);
    });
  }
}

// ===== ACTUALIZAR FILTROS =====
function updateMunicipioFilters() {
  let municipios = getMunicipiosConRestaurantes();
  
  ['filter-municipio', 'm-filter-municipio', 'map-select-municipio'].forEach(id => {
    let select = document.getElementById(id);
    if(select) {
      let current = select.value;
      select.innerHTML = '<option value="todos">' + (id.includes('map') ? 'Todos los Municipios' : 'Cualquier Municipio') + '</option>';
      municipios.forEach(m => select.innerHTML += `<option value="${m}">${m}</option>`);
      select.value = current;
    }
  });
}

// ===== APLICAR FILTROS =====
function applyFiltersAndRender() {
  let rest = getRestaurantes();
  if (!rest || rest.length === 0) return;
  
  let filtrados = [...rest];
  
  let municipio = document.getElementById('filter-municipio')?.value || 'todos';
  let tipo = document.getElementById('filter-tipo')?.value || 'todos';
  let precio = document.getElementById('filter-precio')?.value || 'todos';
  let chkAire = document.getElementById('filter-aire')?.checked || false;
  let chkClima = document.getElementById('filter-clima')?.checked || false;
  let chkParqueo = document.getElementById('filter-parqueo')?.checked || false;

  if (listadoQuery) {
    const q = listadoQuery.toLowerCase().trim();
    filtrados = rest.filter(r => {
      if (r.nombre.toLowerCase().includes(q) ||
          r.descripcion.toLowerCase().includes(q) ||
          r.tipo.toLowerCase().includes(q) ||
          r.municipio.toLowerCase().includes(q)) return true;
      if (r.platosPopulares?.some(p => p.nombre.toLowerCase().includes(q) || (p.descripcion && p.descripcion.toLowerCase().includes(q)))) return true;
      if (r.seccionesCarta?.some(sec => 
        sec.platos.some(p => p.nombre.toLowerCase().includes(q))
      )) return true;
      return false;
    });
  } else {
    filtrados = [...rest];
  }

  filtrados = filtrados.filter(r => {
    if (municipio !== 'todos' && r.municipio !== municipio) return false;
    if (tipo !== 'todos' && r.tipo !== tipo) return false;
    if (precio !== 'todos' && r.precio !== precio) return false;
    if (chkAire && !r.aire) return false;
    if (chkClima && !r.clima) return false;
    if (chkParqueo && !r.parqueo) return false;
    return true;
  });

  let sortVal = document.getElementById('sort-select')?.value || 'pop';
  if (sortVal === 'name') filtrados.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  else if (sortVal === 'p-low') filtrados.sort((a,b)=>parseInt(a.precio)-parseInt(b.precio));
  else if (sortVal === 'p-high') filtrados.sort((a,b)=>parseInt(b.precio)-parseInt(a.precio));
  else if (sortVal === 'pop') filtrados.sort((a,b)=>{
    return a.nombre.localeCompare(b.nombre);
  });

  let totalSpan = document.getElementById('total-resultados-count');
  if (totalSpan) {
    if (listadoQuery) {
      totalSpan.innerHTML = `Resultados para "<strong>${listadoQuery}</strong>"`;
    } else {
      totalSpan.innerHTML = `Se encontraron ${filtrados.length} establecimientos`;
    }
  }

  let grid = document.getElementById('grid-resultados-listado');
  let emptyState = document.getElementById('listado-empty-state');
  if (!grid) return;
  
  grid.innerHTML = '';

  if (filtrados.length === 0) {
    grid.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
    document.getElementById('pagination-listado').innerHTML = '';
    return;
  }
  grid.classList.remove('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  let totalPages = Math.ceil(filtrados.length / itemsPerPage);
  if (listadoCurrentPage > totalPages) listadoCurrentPage = 1;
  let start = (listadoCurrentPage - 1) * itemsPerPage;
  let paginados = filtrados.slice(start, start + itemsPerPage);
  paginados.forEach(r => {
    const card = createRestaurantCard(r);
    card.classList.add('grid-card');
    grid.appendChild(card);
  });

  renderPagination('pagination-listado', listadoCurrentPage, totalPages);
}

// ===== PAGINACIÓN =====
function renderPagination(containerId, currentPage, totalPages) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
  prevBtn.disabled = currentPage <= 1;
  prevBtn.onclick = () => {
    listadoCurrentPage = Math.max(1, currentPage - 1);
    applyFiltersAndRender();
  };
  container.appendChild(prevBtn);

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'page-input';
  input.min = 1;
  input.max = totalPages;
  input.value = currentPage;
  input.onchange = () => {
    let val = parseInt(input.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    input.value = val;
    listadoCurrentPage = val;
    applyFiltersAndRender();
  };
  container.appendChild(input);

  const totalLabel = document.createElement('span');
  totalLabel.className = 'page-total';
  totalLabel.innerHTML = `de <span>${totalPages}</span>`;
  container.appendChild(totalLabel);

  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
  nextBtn.disabled = currentPage >= totalPages;
  nextBtn.onclick = () => {
    listadoCurrentPage = Math.min(totalPages, currentPage + 1);
    applyFiltersAndRender();
  };
  container.appendChild(nextBtn);
}

// ===== RESET FILTROS =====
function resetAllFilters() {
  if (document.getElementById('filter-municipio')) document.getElementById('filter-municipio').value = 'todos';
  if (document.getElementById('filter-tipo')) document.getElementById('filter-tipo').value = 'todos';
  if (document.getElementById('filter-precio')) document.getElementById('filter-precio').value = 'todos';
  if (document.getElementById('filter-aire')) document.getElementById('filter-aire').checked = false;
  if (document.getElementById('filter-clima')) document.getElementById('filter-clima').checked = false;
  if (document.getElementById('filter-parqueo')) document.getElementById('filter-parqueo').checked = false;
  listadoQuery = '';
  listadoCurrentPage = 1;
  applyFiltersAndRender();
}

// ===== BÚSQUEDA =====
function openSearchOverlay() { 
  const overlay = document.getElementById('search-overlay');
  if (overlay) {
    overlay.classList.add('active'); 
    overlay.style.display = 'flex';
    const input = document.getElementById('search-overlay-input');
    if (input) {
      input.focus(); 
      input.value = '';
    }
    const suggestions = document.getElementById('search-suggestions');
    if (suggestions) suggestions.innerHTML = ''; 
  }
}

function closeSearchOverlay() { 
  const overlay = document.getElementById('search-overlay');
  if (overlay) {
    overlay.classList.remove('active'); 
    overlay.style.display = 'none';
  }
  const suggestions = document.getElementById('search-suggestions');
  if (suggestions) suggestions.innerHTML = ''; 
}

function executeSearch() {
  let q = document.getElementById('search-overlay-input')?.value.trim();
  if(q) {
    listadoQuery = q;
    closeSearchOverlay();
    window.location.href = `espacios.html?q=${encodeURIComponent(q)}`;
  }
}

function handleSearchSuggestions() {
  const query = document.getElementById('search-overlay-input')?.value.trim();
  const container = document.getElementById('search-suggestions');
  if (!container) return;
  container.innerHTML = '';
  if (!query || query.length < 1) return;

  const rest = getRestaurantes();
  if (!rest || rest.length === 0) return;
  
  const q = query.toLowerCase();
  const results = rest.filter(r => {
    if (r.nombre.toLowerCase().includes(q) ||
        r.descripcion.toLowerCase().includes(q) ||
        r.tipo.toLowerCase().includes(q) ||
        r.municipio.toLowerCase().includes(q)) return true;
    if (r.platosPopulares?.some(p => p.nombre.toLowerCase().includes(q) || (p.descripcion && p.descripcion.toLowerCase().includes(q)))) return true;
    if (r.seccionesCarta?.some(sec => 
      sec.platos.some(p => p.nombre.toLowerCase().includes(q))
    )) return true;
    return false;
  }).slice(0, 6);

  if (results.length === 0) {
    container.innerHTML = `<div style="padding:0.8rem 0.8rem;color:var(--brand-text);opacity:0.5;font-size:0.85rem;text-align:center;">No se encontraron resultados</div>`;
    return;
  }

  results.forEach(r => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    const tipoIcon = getTipoIcon(r.tipo);
    item.innerHTML = `
      <div class="sug-icon"><i class="fa-solid ${tipoIcon.icon}"></i></div>
      <div class="sug-info">
        <div class="sug-name">${r.nombre}</div>
        <div class="sug-desc">${r.tipo} · ${r.municipio}</div>
      </div>
      <span class="sug-badge">${r.tipo}</span>
    `;
    item.onclick = () => {
      listadoQuery = r.nombre;
      closeSearchOverlay();
      window.location.href = `espacios.html?q=${encodeURIComponent(r.nombre)}`;
    };
    container.appendChild(item);
  });

  if (results.length > 0) {
    const seeAll = document.createElement('div');
    seeAll.className = 'suggestion-item';
    seeAll.style.borderTop = '1px solid var(--brand-border)';
    seeAll.style.marginTop = '4px';
    seeAll.style.paddingTop = '10px';
    seeAll.innerHTML = `
      <div style="flex:1;font-weight:600;color:var(--brand-primary);font-size:0.85rem;text-align:center;">
        Ver todos los resultados para "<span style="font-weight:700;">${query}</span>"
      </div>
    `;
    seeAll.onclick = () => {
      listadoQuery = query;
      closeSearchOverlay();
      window.location.href = `espacios.html?q=${encodeURIComponent(query)}`;
    };
    container.appendChild(seeAll);
  }
}

function handleHeroSearch(e) {
  e.preventDefault();
  let q = document.getElementById('hero-search-input')?.value.trim();
  if(q) {
    listadoQuery = q;
    window.location.href = `espacios.html?q=${encodeURIComponent(q)}`;
  }
}

// ===== FILTROS MÓVIL =====
function openFilterOverlay() {
  document.getElementById('mobile-filter-overlay').classList.remove('hidden');
}

function closeFilterOverlay() {
  document.getElementById('mobile-filter-overlay').classList.add('hidden');
}

function applyMobileFilters() {
  document.getElementById('filter-municipio').value = document.getElementById('m-filter-municipio').value;
  document.getElementById('filter-tipo').value = document.getElementById('m-filter-tipo').value;
  document.getElementById('filter-precio').value = document.getElementById('m-filter-precio').value;
  document.getElementById('filter-aire').checked = document.getElementById('m-filter-aire').checked;
  document.getElementById('filter-clima').checked = document.getElementById('m-filter-clima').checked;
  document.getElementById('filter-parqueo').checked = document.getElementById('m-filter-parqueo').checked;
  closeFilterOverlay();
  listadoCurrentPage = 1;
  applyFiltersAndRender();
}

function resetMobileFilters() {
  document.getElementById('m-filter-municipio').value = 'todos';
  document.getElementById('m-filter-tipo').value = 'todos';
  document.getElementById('m-filter-precio').value = 'todos';
  document.getElementById('m-filter-aire').checked = false;
  document.getElementById('m-filter-clima').checked = false;
  document.getElementById('m-filter-parqueo').checked = false;
}

// ===== TOGGLE PASSWORD =====
function togglePasswordVisibility(inputId, btn) {
  let input = document.getElementById(inputId);
  if (!input) return;
  let icon = btn?.querySelector('i');
  if(input.type === 'password') {
    input.type = 'text';
    if (icon) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  } else {
    input.type = 'password';
    if (icon) {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  }
}

// ===== TOGGLE MOBILE MENU =====
function toggleMobileMenu() { 
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden'); 
}

// ===== TOGGLE DARK MODE =====
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  let isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('sh_dark_mode', isDark);
  let icon = document.getElementById('theme-icon');
  if(icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  // Actualizar logo
  updateHeaderLogo();
}

function loadSavedTheme() {
  if(localStorage.getItem('sh_dark_mode') === 'true') {
    document.documentElement.classList.add('dark');
    const icon = document.getElementById('theme-icon');
    if(icon) icon.className = 'fa-solid fa-sun';
  }
  // Actualizar logo al cargar
  updateHeaderLogo();
}
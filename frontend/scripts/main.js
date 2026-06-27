// ============================================
// MAIN.JS - FUNCIONES GLOBALES
// ============================================

let activePage = 'home';
let listadoCurrentPage = 1;
let itemsPerPage = 9;
let listadoQuery = '';

// ===== NAVEGACIÓN (para SPA) =====
function navigate(pageId, param = null) {
  if (pageId === 'detalle' && param) {
    window.location.href = `detalles.html?id=${param}`;
    return;
  }
  if (pageId === 'resenas' && param) {
    window.location.href = `detalles.html?id=${param}&tab=resenas`;
    return;
  }
  const pages = {
    'home': 'index.html',
    'listado': 'espacios.html',
    'mapa': 'mapa.html',
    'perfil': 'perfil.html',
    'admin': 'admin.html',
    'solicitar-espacio': 'solicitarEspacio.html',
    'mi-espacio': 'miEspacio.html',
    'login': 'login.html',
    'registro': 'registro.html',
    'politica-privacidad': 'privacidad.html',
    'terminos-servicio': 'terminos.html',
    'politica-cookies': 'cookies.html'
  };
  if (pages[pageId]) {
    window.location.href = pages[pageId];
  }
}

// ===== FUNCIÓN PARA CREAR TARJETA DE RESTAURANTE =====
function createRestaurantCard(rest) {
  let resenas = getResenasByRestauranteId(rest.id);
  let promedio = resenas.length ? (resenas.reduce((a,b)=>a+b.puntuacion,0)/resenas.length).toFixed(1) : "Nuevo";
  let isOpen = isRestaurantOpen(rest);
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
        <span class="rating"><i class="fa-solid fa-star"></i> ${promedio}</span>
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

// ===== FUNCIÓN PARA RENDERIZAR CARRUSELES =====
function renderHomeCarruseles() {
  let rest = getRestaurantes();
  if (!rest || rest.length === 0) return;
  
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const nuevos = rest.filter(r => {
    const createdAt = new Date(r.createdAt);
    const resenas = getResenasByRestauranteId(r.id);
    return resenas.length === 0 && createdAt >= oneMonthAgo;
  });

  const populares = [...rest].sort((a,b) => {
    const rA = getResenasByRestauranteId(a.id).length;
    const rB = getResenasByRestauranteId(b.id).length;
    return rB - rA;
  });

  const mejorValorados = [...rest].filter(r => {
    const resenas = getResenasByRestauranteId(r.id);
    if (resenas.length === 0) return false;
    const avg = resenas.reduce((s,c) => s + c.puntuacion, 0) / resenas.length;
    return avg >= 4;
  }).sort((a,b) => {
    const rA = getResenasByRestauranteId(a.id);
    const rB = getResenasByRestauranteId(b.id);
    const pA = rA.reduce((s,c) => s + c.puntuacion, 0) / rA.length;
    const pB = rB.reduce((s,c) => s + c.puntuacion, 0) / rB.length;
    return pB - pA;
  });

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

// ===== FUNCIÓN PARA ACTUALIZAR FILTROS DE MUNICIPIO =====
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

// ===== FUNCIÓN PARA APLICAR FILTROS EN LISTADO =====
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
    let rA=getResenasByRestauranteId(a.id);
    let rB=getResenasByRestauranteId(b.id);
    let pA=rA.length?rA.reduce((s,c)=>s+c.puntuacion,0)/rA.length:0;
    let pB=rB.length?rB.reduce((s,c)=>s+c.puntuacion,0)/rB.length:0;
    return pB-pA;
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

  renderPagination('pagination-listado', listadoCurrentPage, totalPages, 'listado');
}

// ===== FUNCIÓN DE PAGINACIÓN =====
function renderPagination(containerId, currentPage, totalPages, pageType) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
  prevBtn.disabled = currentPage <= 1;
  prevBtn.onclick = () => {
    if (pageType === 'listado') {
      listadoCurrentPage = Math.max(1, currentPage - 1);
      applyFiltersAndRender();
    }
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
    if (pageType === 'listado') {
      listadoCurrentPage = val;
      applyFiltersAndRender();
    }
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
    if (pageType === 'listado') {
      listadoCurrentPage = Math.min(totalPages, currentPage + 1);
      applyFiltersAndRender();
    }
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

// ===== BÚSQUEDA EN OVERLAY (CORREGIDO) =====
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

// ===== BÚSQUEDA EN HERO =====
function handleHeroSearch(e) {
  e.preventDefault();
  let q = document.getElementById('hero-search-input')?.value.trim();
  if(q) {
    listadoQuery = q;
    window.location.href = `espacios.html?q=${encodeURIComponent(q)}`;
  }
}

// ===== TOAST =====
function showToast(title, desc, type="success") {
  let toast = document.getElementById('toast-notification');
  let iconWrapper = document.getElementById('toast-icon-wrapper');
  document.getElementById('toast-title').innerText = title;
  document.getElementById('toast-desc').innerText = desc;
  
  iconWrapper.className = "w-10 h-10 rounded-full flex items-center justify-center text-white";
  if(type === "success") { 
    iconWrapper.classList.add("bg-green-500"); 
    iconWrapper.innerHTML = '<i class="fa-solid fa-circle-check"></i>'; 
  } else if(type === "error") { 
    iconWrapper.classList.add("bg-red-500"); 
    iconWrapper.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>'; 
  } else { 
    iconWrapper.classList.add("bg-brand-primary"); 
    iconWrapper.innerHTML = '<i class="fa-solid fa-circle-info"></i>'; 
  }
  
  if (toast) {
    toast.classList.remove('translate-x-96','opacity-0');
    toast.classList.add('translate-x-0','opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-x-0','opacity-100');
      toast.classList.add('translate-x-96','opacity-0');
    }, 4000);
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
}

function loadSavedTheme() {
  if(localStorage.getItem('sh_dark_mode') === 'true') {
    document.documentElement.classList.add('dark');
    const icon = document.getElementById('theme-icon');
    if(icon) icon.className = 'fa-solid fa-sun';
  }
  let color = localStorage.getItem('sh_theme_color') || '#5B8A72';
  document.documentElement.style.setProperty('--brand-primary', color);
}

// ===== AVATAR DROPDOWN =====
function toggleAvatarDropdown() {
  const menu = document.getElementById('avatar-dropdown-menu');
  if (menu) menu.classList.toggle('show');
}

function renderAuthNavs() {
  let user = getUsuarioActual();
  let container = document.getElementById('auth-buttons-container');
  let mobileContainer = document.getElementById('auth-buttons-container-mobile');
  
  // Elementos de navegación
  let solicitarNav = document.getElementById('nav-solicitar');
  let mobileSolicitarNav = document.getElementById('mobile-nav-solicitar');
  let miEspacioNav = document.getElementById('nav-mi-espacio');
  let mobileMiEspacioNav = document.getElementById('mobile-nav-mi-espacio');
  let adminNav = document.getElementById('nav-admin');
  let mobileAdminNav = document.getElementById('mobile-nav-admin');
  
  // Elementos del footer
  let footerSolicitar = document.getElementById('footer-solicitar-link');
  let footerMiEspacio = document.getElementById('footer-mi-espacio-link');
  let footerAdmin = document.getElementById('footer-admin-link');

  // Mostrar/ocultar Admin Panel (siempre visible para admin)
  if(user && user.rol === 'admin') {
    if (adminNav) adminNav.classList.remove('hidden');
    if (mobileAdminNav) mobileAdminNav.classList.remove('hidden');
    if (footerAdmin) footerAdmin.classList.remove('hidden');
  } else {
    if (adminNav) adminNav.classList.add('hidden');
    if (mobileAdminNav) mobileAdminNav.classList.add('hidden');
    if (footerAdmin) footerAdmin.classList.add('hidden');
  }

  if(user) {
    // Avatar del usuario
    if (container) {
      container.innerHTML = `
        <div class="avatar-dropdown">
          <button onclick="toggleAvatarDropdown()" class="flex items-center hover:text-brand-primary">
            <div class="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold font-serif text-sm">${user.nombre.substring(0,2).toUpperCase()}</div>
            <i class="fa-solid fa-chevron-down text-xs text-brand-text/50 ml-1 hidden md:block"></i>
          </button>
          <div id="avatar-dropdown-menu" class="avatar-dropdown-menu">
            <a href="perfil.html" class="avatar-dropdown-item">
              <i class="fa-regular fa-user"></i> Configuración
            </a>
            <button onclick="cerrarSesion();" class="avatar-dropdown-item">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión
            </button>
          </div>
        </div>
      `;
    }
    if (mobileContainer) mobileContainer.innerHTML = '';

    // Lógica para mostrar/ocultar según rol
    if(user.rol === 'gestor' && user.restauranteId) {
      // Gestor: ocultar "Solicitar espacio", mostrar "Mi espacio"
      if (solicitarNav) solicitarNav.classList.add('hidden');
      if (mobileSolicitarNav) mobileSolicitarNav.classList.add('hidden');
      if (footerSolicitar) footerSolicitar.classList.add('hidden');
      
      if (miEspacioNav) miEspacioNav.classList.remove('hidden');
      if (mobileMiEspacioNav) mobileMiEspacioNav.classList.remove('hidden');
      if (footerMiEspacio) footerMiEspacio.classList.remove('hidden');
      
      // Admin ya está oculto por la lógica anterior (si no es admin)
    } else if(user.rol === 'admin') {
      // Admin: mostrar "Solicitar espacio", ocultar "Mi espacio"
      if (solicitarNav) solicitarNav.classList.remove('hidden');
      if (mobileSolicitarNav) mobileSolicitarNav.classList.remove('hidden');
      if (footerSolicitar) footerSolicitar.classList.remove('hidden');
      
      if (miEspacioNav) miEspacioNav.classList.add('hidden');
      if (mobileMiEspacioNav) mobileMiEspacioNav.classList.add('hidden');
      if (footerMiEspacio) footerMiEspacio.classList.add('hidden');
      
      // Admin ya está visible por la lógica anterior
    } else {
      // Usuario normal: mostrar "Solicitar espacio", ocultar "Mi espacio"
      if (solicitarNav) solicitarNav.classList.remove('hidden');
      if (mobileSolicitarNav) mobileSolicitarNav.classList.remove('hidden');
      if (footerSolicitar) footerSolicitar.classList.remove('hidden');
      
      if (miEspacioNav) miEspacioNav.classList.add('hidden');
      if (mobileMiEspacioNav) mobileMiEspacioNav.classList.add('hidden');
      if (footerMiEspacio) footerMiEspacio.classList.add('hidden');
    }
  } else {
    // Usuario NO logueado
    if (solicitarNav) solicitarNav.classList.add('hidden');
    if (mobileSolicitarNav) mobileSolicitarNav.classList.add('hidden');
    if (footerSolicitar) footerSolicitar.classList.add('hidden');
    
    if (miEspacioNav) miEspacioNav.classList.add('hidden');
    if (mobileMiEspacioNav) mobileMiEspacioNav.classList.add('hidden');
    if (footerMiEspacio) footerMiEspacio.classList.add('hidden');
    
    if (adminNav) adminNav.classList.add('hidden');
    if (mobileAdminNav) mobileAdminNav.classList.add('hidden');
    if (footerAdmin) footerAdmin.classList.add('hidden');

    // Botón de "Iniciar Sesión"
    if (container) {
      container.innerHTML = `
        <a href="login.html" class="bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold text-sm px-5 py-2 rounded-full transition-all">
          Iniciar Sesión
        </a>
      `;
    }
    if (mobileContainer) mobileContainer.innerHTML = '';
  }
  
  // Cerrar dropdown
  const dropdown = document.getElementById('avatar-dropdown-menu');
  if (dropdown) dropdown.classList.remove('show');
}

// ===== CERRAR SESIÓN =====
function cerrarSesion() {
  localStorage.removeItem("sh_usuario_actual");
  document.documentElement.style.setProperty('--brand-primary', '#5B8A72');
  localStorage.setItem('sh_theme_color', '#5B8A72');
  showToast("Sesión Cerrada", "Vuelve pronto.", "info");
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

// ===== SET THEME COLOR =====
function setThemeColor(color) {
  document.documentElement.style.setProperty('--brand-primary', color);
  localStorage.setItem('sh_theme_color', color);
  let user = getUsuarioActual();
  if(user) {
    let usuarios = JSON.parse(localStorage.getItem("sh_usuarios"));
    let idx = usuarios.findIndex(u => u.id === user.id);
    if(idx !== -1) {
      usuarios[idx].colorPrimario = color;
      localStorage.setItem("sh_usuarios", JSON.stringify(usuarios));
      user.colorPrimario = color;
      localStorage.setItem("sh_usuario_actual", JSON.stringify(user));
    }
  }
  showToast("Color Actualizado", "La identidad de la aplicación ha cambiado.", "success");
}

// ===== QUICK FILTER =====
function quickFilterTipo(tipo) {
  window.location.href = `espacios.html?tipo=${tipo}`;
}

// ===== EVENTO PARA CERRAR DROPDOWN =====
document.addEventListener('click', function(e) {
  if(!e.target.closest('.avatar-dropdown')) {
    const dropdown = document.getElementById('avatar-dropdown-menu');
    if (dropdown) dropdown.classList.remove('show');
  }
});
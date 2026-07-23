// ============================================
// DETALLE.JS - FUNCIONES DE DETALLE
// ============================================

let currentDetailRestId = null;
let detailResizeTimeout = null;

// ========== FUNCIÓN CÓMO LLEGAR ==========
function abrirRutaConGeolocalizacion(lat, lng, nombre) {
    if (!lat || !lng) {
        showToast('❌ Error', 'No hay coordenadas disponibles para este restaurante', 'error');
        return;
    }
    
    if ('geolocation' in navigator) {
        showToast('📍 Obteniendo tu ubicación...', 'Por favor espera', 'info');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const destino = `${lat},${lng}`;
                const origen = `${userLat},${userLng}`;
                const url = `https://www.google.com/maps/dir/?api=1&origin=${origen}&destination=${destino}`;
                window.open(url, '_blank');
                showToast('🗺️ Abriendo Google Maps', 
                          `Desde tu ubicación hasta: ${nombre || 'el restaurante'}`, 
                          'success');
            },
            (error) => {
                console.warn('No se pudo obtener la ubicación:', error.message);
                const destino = `${lat},${lng}`;
                const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
                window.open(url, '_blank');
                showToast('🗺️ Abriendo Google Maps', 
                          `Ruta hacia: ${nombre || 'el restaurante'}`, 
                          'info');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        const destino = `${lat},${lng}`;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
        window.open(url, '_blank');
        showToast('🗺️ Abriendo Google Maps', 
                  `Ruta hacia: ${nombre || 'el restaurante'}`, 
                  'success');
    }
}

// ========== FUNCIÓN COMPARTIR ==========
function getIconoCompartir(categoria) {
    const iconos = {
        'criolla': '🍛',
        'rápida': '🍔',
        'italiana': '🍕',
        'mariscos': '🦞',
        'cafetería': '☕',
        'heladería': '🍦',
        'dulcería': '🍰'
    };
    return iconos[categoria] || '🍽️';
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Error al copiar:', err);
        return false;
    }
}

function generarTextoCompartir(restaurante) {
    const lines = [];
    const emoji = getIconoCompartir(restaurante.tipo);
    lines.push(`${emoji} ${restaurante.nombre}`);
    lines.push('');
    if (restaurante.descripcion) {
        lines.push(restaurante.descripcion);
        lines.push('');
    }
    lines.push(`📍 ${restaurante.direccion}`);
    lines.push(`📆 ${restaurante.municipio}`);
    lines.push(`🕐 ${restaurante.horario}`);
    lines.push(`📞 ${restaurante.telefono}`);
    if (restaurante.aire) lines.push(`🌳 Terraza disponible`);
    if (restaurante.clima) lines.push(`❄️ Climatizado`);
    if (restaurante.parqueo) lines.push(`🅿️ Parqueo privado`);
    if (restaurante.platosPopulares && restaurante.platosPopulares.length > 0) {
        lines.push('');
        lines.push(`🌟 Especialidades: ${restaurante.platosPopulares.map(p => p.nombre).join(', ')}`);
    }
    lines.push(`\n🔗 Más información: ${window.location.href}`);
    return lines.join('\n');
}

function compartirEnRed(red, contenido) {
    const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(contenido.substring(0, 500))}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(contenido.substring(0, 200))}`,
        copy: null
    };
    if (red === 'copy') {
        copyToClipboard(contenido);
        showToast('✅ Copiado', 'Contenido copiado al portapapeles', 'success');
    } else if (urls[red]) {
        window.open(urls[red], '_blank', 'width=600,height=400');
    }
}

function mostrarMenuCompartir(restaurante) {
    const shareText = generarTextoCompartir(restaurante);
    const modal = document.getElementById('compartir-modal-overlay');
    const content = document.getElementById('compartir-modal-content');
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div class="text-center">
            <h3 class="font-serif font-bold text-xl text-brand-text mb-1">
                <i class="fa-regular fa-share-from-square text-brand-primary"></i> Compartir
            </h3>
            <p class="text-xs text-brand-text/60 mb-4">${restaurante.nombre}</p>
            
            <div class="flex justify-center gap-3 mb-4">
                <button onclick="compartirEnRed('facebook', '${shareText.replace(/'/g, "\\'")}')" 
                        class="w-12 h-12 rounded-full bg-[#1877f2] text-white text-xl hover:scale-110 transition-transform">
                    <i class="fa-brands fa-facebook-f"></i>
                </button>
                <button onclick="compartirEnRed('whatsapp', '${shareText.replace(/'/g, "\\'")}')" 
                        class="w-12 h-12 rounded-full bg-[#25d366] text-white text-xl hover:scale-110 transition-transform">
                    <i class="fa-brands fa-whatsapp"></i>
                </button>
                <button onclick="compartirEnRed('telegram', '${shareText.replace(/'/g, "\\'")}')" 
                        class="w-12 h-12 rounded-full bg-[#0088cc] text-white text-xl hover:scale-110 transition-transform">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
                <button onclick="compartirEnRed('copy', '${shareText.replace(/'/g, "\\'")}')" 
                        class="w-12 h-12 rounded-full bg-[#3498db] text-white text-xl hover:scale-110 transition-transform">
                    <i class="fa-regular fa-clipboard"></i>
                </button>
            </div>
            
            <button onclick="closeCompartirModal()" 
                    class="w-full py-2 bg-brand-bg border border-brand-border rounded-xl text-sm font-semibold text-brand-text hover:bg-brand-border/30 transition-colors">
                Cancelar
            </button>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeCompartirModal() {
    const modal = document.getElementById('compartir-modal-overlay');
    if (modal) modal.classList.add('hidden');
}

// ========== FUNCIÓN TOAST (si no existe en main.js) ==========
function showToast(title, desc, type) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        // Crear toast si no existe
        const toastDiv = document.createElement('div');
        toastDiv.id = 'toast-notification';
        toastDiv.className = 'fixed top-24 right-6 z-50 transform translate-x-96 opacity-0 transition-all duration-300 flex items-center gap-3 bg-brand-card border border-brand-border px-5 py-4 rounded-2xl shadow-xl max-w-sm';
        toastDiv.innerHTML = `
            <div id="toast-icon-wrapper" class="w-10 h-10 rounded-full flex items-center justify-center text-white"></div>
            <div><h4 id="toast-title" class="font-bold text-sm"></h4><p id="toast-desc" class="text-xs opacity-80"></p></div>
        `;
        document.body.appendChild(toastDiv);
        toast = toastDiv;
    }
    
    const iconWrapper = document.getElementById('toast-icon-wrapper');
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
    
    toast.classList.remove('translate-x-96','opacity-0');
    toast.classList.add('translate-x-0','opacity-100');
    setTimeout(() => {
        toast.classList.remove('translate-x-0','opacity-100');
        toast.classList.add('translate-x-96','opacity-0');
    }, 4000);
}

// ========== RENDERIZAR DETALLE ==========
function renderRestauranteDetalle(id) {
  currentDetailRestId = id;
  let r = getRestauranteById(id);
  if(!r) {
    document.getElementById('restaurante-detalle-content').innerHTML = '<p class="text-center py-12 text-red-500">Restaurante no encontrado</p>';
    return;
  }
  let container = document.getElementById('restaurante-detalle-content');

  let isOpen = isRestaurantOpen(r);
  const statusText = isOpen ? 'Abierto' : 'Cerrado';
  const statusClass = isOpen ? 'open' : 'closed';

  let thumbsHtml = r.galeria.map((img,i) =>
    `<button onclick="document.getElementById('det-main-img').src='${img}'" class="${i === 0 ? 'border-brand-primary' : ''}"><img src="${img}" alt="thumb"></button>`
  ).join('');

  let amenitiesHtml = '';
  if (r.aire) amenitiesHtml += `<span class="amenity-tag"><i class="fa-solid fa-cloud-sun"></i> Terraza</span>`;
  if (r.clima) amenitiesHtml += `<span class="amenity-tag"><i class="fa-solid fa-snowflake"></i> Climatizado</span>`;
  if (r.parqueo) amenitiesHtml += `<span class="amenity-tag"><i class="fa-solid fa-square-parking"></i> Parqueo Privado</span>`;

  let platosPopularesParaMostrar = r.platosPopulares || [];
  if (platosPopularesParaMostrar.length === 0 && r.seccionesCarta && r.seccionesCarta.length > 0) {
    let allPlatos = [];
    r.seccionesCarta.forEach(sec => {
      sec.platos.forEach(p => {
        allPlatos.push(p);
      });
    });
    platosPopularesParaMostrar = allPlatos.slice(0, 3);
  }

  let specialtiesHtml = platosPopularesParaMostrar.map(p =>
    `<div class="specialty-item">
      <img src="${p.img || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=200'}" alt="${p.nombre}" onerror="this.src='https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=200'">
      <div class="s-name">${p.nombre}</div>
      <div class="s-price">${p.precio}</div>
    </div>`
  ).join('');

  const isDesktop = window.innerWidth >= 768;

  // ===== BOTONES CON CÓMO LLEGAR Y COMPARTIR =====
  const desktopButtonsHtml = `
    <div class="detail-actions-wrapper">
      <button class="btn-action" onclick="toggleCartaModal('${r.id}')">
        <i class="fa-solid fa-receipt"></i> Ver carta
      </button>
      <button class="btn-action" onclick="abrirRutaConGeolocalizacion(${r.lat}, ${r.lng}, '${r.nombre}')">
        <i class="fa-solid fa-location-dot"></i> Cómo llegar
      </button>
      <button class="btn-action" onclick="mostrarMenuCompartir(getRestauranteById('${r.id}'))">
        <i class="fa-regular fa-share-from-square"></i> Compartir
      </button>
    </div>
  `;

  const mobileButtonsHtml = `
    <div class="detail-actions-mobile">
      <button class="btn-mobile-circle" onclick="toggleCartaModal('${r.id}')" title="Ver carta">
        <i class="fa-solid fa-receipt"></i>
      </button>
      <button class="btn-mobile-circle" onclick="abrirRutaConGeolocalizacion(${r.lat}, ${r.lng}, '${r.nombre}')" title="Cómo llegar">
        <i class="fa-solid fa-location-dot"></i>
      </button>
      <button class="btn-mobile-circle" onclick="mostrarMenuCompartir(getRestauranteById('${r.id}'))" title="Compartir">
        <i class="fa-regular fa-share-from-square"></i>
      </button>
    </div>
  `;

  if (isDesktop) {
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-6">
          <div class="detail-panel">
            <div class="detail-image-wrapper">
              <img id="det-main-img" src="${r.img}" alt="${r.nombre}" onerror="this.src='https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600'">
              <div class="thumb-gallery">${thumbsHtml}</div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-6">
          <div class="detail-panel">
            <div class="detail-body">
              <div class="detail-name">${r.nombre}</div>
              <div class="detail-meta">
                <span class="status-text ${statusClass}"><span class="status-dot ${statusClass}"></span>${statusText}</span>
                <span class="divider">·</span>
                <span class="rating"><i class="fa-solid fa-star"></i> ★</span>
              </div>
              <div class="detail-category">
                <i class="fa-regular fa-compass"></i> ${r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1)} · ${r.municipio}
              </div>
              <hr class="detail-divider">
              <div class="detail-info-grid">
                <div class="info-row"><i class="fa-regular fa-clock"></i> <span><strong>Horario:</strong> ${r.horario}</span></div>
                <div class="info-row"><i class="fa-solid fa-location-arrow"></i> <span><strong>Dirección:</strong> ${r.direccion}</span></div>
                <div class="info-row"><i class="fa-solid fa-phone"></i> <span><strong>Contacto:</strong> ${r.telefono}</span></div>
              </div>
              <hr class="detail-divider">
              ${amenitiesHtml ? `<div class="detail-amenities">${amenitiesHtml}</div>` : ''}
              ${desktopButtonsHtml}
            </div>
          </div>
        </div>
      </div>
      <div class="specialties-section">
        <div class="specialties-title"><i class="fa-solid fa-wand-magic-sparkles"></i> Especialidades Sugeridas</div>
        <div class="specialties-scroll custom-scrollbar">${specialtiesHtml}</div>
      </div>
      <div class="mapa-container relative" style="z-index:1;">
        <div id="detalle-mapa" class="h-72 w-full rounded-2xl overflow-hidden border border-brand-border" style="z-index:1;position:relative;"></div>
        <button id="detalle-center-map" class="map-center-btn-detalle" style="z-index:2;"><i class="fa-solid fa-location-crosshairs text-brand-primary"></i></button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="detail-panel">
        <div class="detail-image-wrapper">
          <img id="det-main-img" src="${r.img}" alt="${r.nombre}" onerror="this.src='https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600'">
          <div class="thumb-gallery">${thumbsHtml}</div>
        </div>
        <div class="detail-body">
          <div class="detail-name">${r.nombre}</div>
          <div class="detail-meta">
            <span class="status-text ${statusClass}"><span class="status-dot ${statusClass}"></span>${statusText}</span>
            <span class="divider">·</span>
            <span class="rating"><i class="fa-solid fa-star"></i> ★</span>
          </div>
          <div class="detail-category">
            <i class="fa-regular fa-compass"></i> ${r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1)} · ${r.municipio}
          </div>
          <hr class="detail-divider">
          <div class="detail-info-grid">
            <div class="info-row"><i class="fa-regular fa-clock"></i> <span><strong>Horario:</strong> ${r.horario}</span></div>
            <div class="info-row"><i class="fa-solid fa-location-arrow"></i> <span><strong>Dirección:</strong> ${r.direccion}</span></div>
            <div class="info-row"><i class="fa-solid fa-phone"></i> <span><strong>Contacto:</strong> ${r.telefono}</span></div>
          </div>
          <hr class="detail-divider">
          ${amenitiesHtml ? `<div class="detail-amenities">${amenitiesHtml}</div>` : ''}
          ${mobileButtonsHtml}
        </div>
      </div>
      <div class="specialties-section">
        <div class="specialties-title"><i class="fa-solid fa-wand-magic-sparkles"></i> Especialidades Sugeridas</div>
        <div class="specialties-scroll custom-scrollbar">${specialtiesHtml}</div>
      </div>
      <div class="mapa-container relative" style="z-index:1;">
        <div id="detalle-mapa" class="h-64 w-full rounded-2xl overflow-hidden border border-brand-border" style="z-index:1;position:relative;"></div>
        <button id="detalle-center-map" class="map-center-btn-detalle" style="z-index:2;"><i class="fa-solid fa-location-crosshairs text-brand-primary"></i></button>
      </div>
    `;
  }

  setTimeout(() => {
    let mapDiv = document.getElementById('detalle-mapa');
    if(mapDiv && r.lat && r.lng) {
      if(window.detailMap) window.detailMap.remove();
      
      // 🔥 SIEMPRE usar el tile claro (el filtro CSS se encarga del modo oscuro)
      let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      
      window.detailMap = L.map(mapDiv).setView([r.lat, r.lng], 16);
      L.tileLayer(tileUrl, { 
        attribution: '&copy; <a href="https://www.cartodb.com/">CartoDB</a> | &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
        maxZoom: 19,
        minZoom: 8,
        updateWhenIdle: false,
        updateWhenZooming: true,
        keepBuffer: 4
      }).addTo(window.detailMap);
      
      let blueIcon = L.divIcon({ 
        html: `<div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style="background-color: #3498DB; border: 2px solid white;"><i class="fa-solid fa-utensils text-white text-xs"></i></div>`, 
        iconSize: [32,32], 
        iconAnchor: [16,32] 
      });
      
      L.marker([r.lat, r.lng], { icon: blueIcon })
        .addTo(window.detailMap)
        .bindPopup(`<b>${escapeHtml(r.direccion)}</b>`)
        .openPopup();
      
      let centerBtn = document.getElementById('detalle-center-map');
      if(centerBtn) centerBtn.onclick = () => { 
        if(window.detailMap) window.detailMap.setView([r.lat, r.lng], 16); 
      };
      
      if(window.detailMap.getContainer) {
        window.detailMap.getContainer().style.zIndex = '1';
      }
      
      // Forzar actualización del mapa
      setTimeout(() => {
        if(window.detailMap) window.detailMap.invalidateSize();
      }, 100);
    }
  }, 250);
}

function handleResizeDetalle() {
  if (detailResizeTimeout) {
    clearTimeout(detailResizeTimeout);
  }
  detailResizeTimeout = setTimeout(() => {
    if (currentDetailRestId && document.getElementById('restaurante-detalle-content')) {
      const detallePage = document.getElementById('page-detalle');
      if (detallePage && !detallePage.classList.contains('hidden')) {
        renderRestauranteDetalle(currentDetailRestId);
      }
    }
  }, 300);
}

window.addEventListener('resize', handleResizeDetalle);

// ========== MODAL CARTA ==========
function toggleCartaModal(restId) {
  let r = getRestauranteById(restId);
  if (!r) return;
  
  const modal = document.getElementById('carta-modal-overlay');
  const content = document.getElementById('carta-modal-content');
  if (!modal || !content) return;
  
  modal.style.zIndex = '9999';
  
  let seccionesHtml = '';
  
  if (r.seccionesCarta && r.seccionesCarta.length > 0) {
    r.seccionesCarta.forEach(sec => {
      seccionesHtml += `
        <div class="mb-6">
          <h3 class="font-bold text-brand-primary border-b border-brand-border pb-2 mb-3 text-lg">${sec.seccion}</h3>
          ${sec.platos.map(p => `
            <div class="flex justify-between py-2 border-b border-brand-border/20 hover:bg-brand-bg/30 transition-colors px-2 rounded">
              <span class="text-sm font-medium">${p.nombre}</span>
              <span class="font-bold text-brand-primary text-sm whitespace-nowrap ml-4">${p.precio}</span>
            </div>
          `).join('')}
        </div>
      `;
    });
  } else {
    seccionesHtml = `
      <div class="text-center py-8">
        <p class="text-brand-text/60">No hay carta disponible para este establecimiento.</p>
        <p class="text-xs text-brand-text/40 mt-2">Consulta directamente con el personal del local.</p>
      </div>
    `;
  }
  
  content.innerHTML = `
    <div class="flex justify-between items-center mb-4 sticky top-0 bg-brand-card pt-2 pb-3 border-b border-brand-border/40 z-10">
      <h2 class="text-2xl font-serif font-bold text-brand-text">📋 Carta de ${r.nombre}</h2>
      <button onclick="closeCartaModal()" class="text-2xl text-brand-text/60 hover:text-brand-primary transition-colors hover:rotate-90 duration-300">&times;</button>
    </div>
    <div class="space-y-4">
      ${seccionesHtml}
    </div>
  `;
  modal.classList.remove('hidden');
}

function closeCartaModal() { 
  const modal = document.getElementById('carta-modal-overlay');
  if (modal) modal.classList.add('hidden');
}
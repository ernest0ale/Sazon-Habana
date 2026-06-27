// ============================================
// DETALLE.JS - FUNCIONES DE DETALLE
// ============================================

let currentDetailRestId = null;
let detailResizeTimeout = null;

// ========== FUNCIONES DE COMPARTIR ==========

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
    lines.push(restaurante.aire ? `🌳 Terraza disponible` : `🏠 Bajo techo`);
    lines.push(restaurante.clima ? `❄️ Climatizado` : ``);
    lines.push(restaurante.parqueo ? `🅿️ Parqueo privado` : ``);
    if (restaurante.platosPopulares && restaurante.platosPopulares.length > 0) {
        lines.push('');
        lines.push(`🌟 Especialidades: ${restaurante.platosPopulares.map(p => p.nombre).join(', ')}`);
    }
    lines.push(`\n🔗 Más información: ${window.location.href}`);
    return lines.join('\n');
}

function compartirEnRed(red, contenido, tipo) {
    let texto = '';
    if (tipo === 'enlace') {
        texto = `🍽️ Restaurante en Sazón Habana: ${window.location.href}`;
    } else {
        texto = contenido;
    }
    const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(texto.substring(0, 500))}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(texto.substring(0, 200))}`,
        copy: null
    };
    if (red === 'copy') {
        copyToClipboard(texto);
        showToast('✅ Contenido copiado al portapapeles', '', 'success');
    } else if (urls[red]) {
        window.open(urls[red], '_blank', 'width=600,height=400');
    }
}

function mostrarMenuCompartir(restaurante) {
    const shareUrl = window.location.href;
    const shareText = generarTextoCompartir(restaurante);
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
    `;
    
    overlay.innerHTML = `
        <div style="
            background: var(--brand-card);
            border-radius: 24px;
            padding: 2rem;
            width: 90%;
            max-width: 380px;
            text-align: center;
            border: 1px solid var(--brand-border);
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
            <h3 style="font-family: 'Playfair Display', serif; font-size: 1.3rem; margin-bottom: 1rem; color: var(--brand-text);">
                <i class="fa-regular fa-share-from-square" style="color: var(--brand-primary);"></i> Compartir
            </h3>
            <p style="font-size: 0.85rem; color: var(--brand-text); opacity: 0.7; margin-bottom: 1.5rem;">
                ${restaurante.nombre}
            </p>
            
            <button id="shareLinkOption" style="
                width: 100%;
                padding: 0.8rem;
                margin-bottom: 0.8rem;
                background: var(--brand-primary);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.2s ease;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <i class="fa-solid fa-link"></i>
                Compartir enlace
            </button>
            
            <button id="shareDetailsOption" style="
                width: 100%;
                padding: 0.8rem;
                margin-bottom: 1.5rem;
                background: #2ecc71;
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.2s ease;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                <i class="fa-solid fa-info-circle"></i>
                Compartir detalles
            </button>
            
            <button id="closeShareModal" style="
                width: 100%;
                padding: 0.8rem;
                background: transparent;
                color: var(--brand-text);
                border: 1px solid var(--brand-border);
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9rem;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='var(--brand-bg)'" onmouseout="this.style.background='transparent'">
                Cancelar
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    const abrirModalOpciones = (tipo, contenido) => {
        overlay.remove();
        
        const modal2 = document.createElement('div');
        modal2.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10002;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
        `;
        
        const titulo = tipo === 'enlace' ? 'Compartir enlace' : 'Compartir detalles';
        modal2.innerHTML = `
            <div style="
                background: var(--brand-card);
                border-radius: 24px;
                padding: 2rem;
                width: 90%;
                max-width: 400px;
                text-align: center;
                border: 1px solid var(--brand-border);
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--brand-text);">
                    ${titulo}
                </h3>
                <p style="font-size: 0.8rem; color: var(--brand-text); opacity: 0.6; margin-bottom: 1.5rem;">
                    Elige cómo quieres compartir
                </p>
                
                <div style="display: flex; gap: 0.8rem; justify-content: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <button id="copyClipboard" style="
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        background: #3498db;
                        color: white;
                        font-size: 1.3rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fa-regular fa-clipboard"></i>
                    </button>
                    
                    <button id="shareFacebook" style="
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        background: #1877f2;
                        color: white;
                        font-size: 1.3rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fa-brands fa-facebook-f"></i>
                    </button>
                    
                    <button id="shareWhatsapp" style="
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        background: #25d366;
                        color: white;
                        font-size: 1.3rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fa-brands fa-whatsapp"></i>
                    </button>
                    
                    <button id="shareTelegram" style="
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        background: #0088cc;
                        color: white;
                        font-size: 1.3rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                
                <button id="backToFirstModal" style="
                    width: 100%;
                    padding: 0.8rem;
                    margin-bottom: 0.8rem;
                    background: #7f8c8d;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                " onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
                    ← Volver
                </button>
                
                <button id="closeShareModal2" style="
                    width: 100%;
                    padding: 0.8rem;
                    background: transparent;
                    color: var(--brand-text);
                    border: 1px solid var(--brand-border);
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='var(--brand-bg)'" onmouseout="this.style.background='transparent'">
                    Cancelar
                </button>
            </div>
        `;
        document.body.appendChild(modal2);
        
        document.getElementById('copyClipboard')?.addEventListener('click', () => { 
            compartirEnRed('copy', contenido, tipo); 
            modal2.remove(); 
        });
        document.getElementById('shareFacebook')?.addEventListener('click', () => { 
            compartirEnRed('facebook', contenido, tipo); 
            modal2.remove(); 
        });
        document.getElementById('shareWhatsapp')?.addEventListener('click', () => { 
            compartirEnRed('whatsapp', contenido, tipo); 
            modal2.remove(); 
        });
        document.getElementById('shareTelegram')?.addEventListener('click', () => { 
            compartirEnRed('telegram', contenido, tipo); 
            modal2.remove(); 
        });
        document.getElementById('backToFirstModal')?.addEventListener('click', () => { 
            modal2.remove(); 
            mostrarMenuCompartir(restaurante); 
        });
        document.getElementById('closeShareModal2')?.addEventListener('click', () => modal2.remove());
        modal2.addEventListener('click', (e) => { if (e.target === modal2) modal2.remove(); });
    };
    
    document.getElementById('shareLinkOption')?.addEventListener('click', () => abrirModalOpciones('enlace', shareUrl));
    document.getElementById('shareDetailsOption')?.addEventListener('click', () => abrirModalOpciones('detalles', shareText));
    document.getElementById('closeShareModal')?.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ========== CÓMO LLEGAR (GOOGLE MAPS) ==========

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

// ========== RENDERIZAR DETALLE ==========

function renderRestauranteDetalle(id) {
  currentDetailRestId = id;
  let r = getRestauranteById(id);
  if(!r) {
    document.getElementById('restaurante-detalle-content').innerHTML = '<p class="text-center py-12 text-red-500">Restaurante no encontrado</p>';
    return;
  }
  let container = document.getElementById('restaurante-detalle-content');

  let resenas = getResenasByRestauranteId(id);
  let promedio = resenas.length ? (resenas.reduce((a,b)=>a+b.puntuacion,0)/resenas.length).toFixed(1) : "Nuevo";
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

  // Especialidades Sugeridas
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

  // ===== GENERAR BOTONES =====
  // Todos los botones en una sola fila para escritorio
  const desktopButtonsHtml = `
    <div class="detail-actions-wrapper">
      <button class="btn-action" onclick="toggleCartaModal('${r.id}')">
        <i class="fa-solid fa-receipt"></i> Ver carta
      </button>
      <button class="btn-action" onclick="renderResenasPage('${r.id}')">
        <i class="fa-regular fa-comments"></i> Reseñas
      </button>
      <button id="btn-como-llegar-detalle" class="btn-action">
        <i class="fa-solid fa-location-dot"></i> Cómo llegar
      </button>
      <button id="btn-compartir-detalle" class="btn-action">
        <i class="fa-regular fa-share-from-square"></i> Compartir
      </button>
    </div>
  `;

  // Botones móviles: circulares, solo iconos
  const mobileButtonsHtml = `
    <div class="detail-actions-mobile">
      <button class="btn-mobile-circle" onclick="toggleCartaModal('${r.id}')">
        <i class="fa-solid fa-receipt"></i>
      </button>
      <button class="btn-mobile-circle" onclick="renderResenasPage('${r.id}')">
        <i class="fa-regular fa-comments"></i>
      </button>
      <button id="btn-como-llegar-mobile" class="btn-mobile-circle">
        <i class="fa-solid fa-location-dot"></i>
      </button>
      <button id="btn-compartir-mobile" class="btn-mobile-circle">
        <i class="fa-regular fa-share-from-square"></i>
      </button>
    </div>
  `;

  if (isDesktop) {
    // VERSIÓN ESCRITORIO
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
                <span class="rating"><i class="fa-solid fa-star"></i> ${promedio} <span style="font-weight:400;opacity:0.6;font-size:0.75rem;">(${resenas.length} reseñas)</span></span>
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
              
              <!-- BOTONES ESCRITORIO - UNA SOLA FILA -->
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
    // VERSIÓN MÓVIL
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
            <span class="rating"><i class="fa-solid fa-star"></i> ${promedio} <span style="font-weight:400;opacity:0.6;font-size:0.75rem;">(${resenas.length})</span></span>
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
          
          <!-- BOTONES MÓVIL -->
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

  // ===== ASIGNAR EVENT LISTENERS A LOS BOTONES =====
  setTimeout(() => {
    // Botón "Cómo llegar" (escritorio)
    const btnComoLlegar = document.getElementById('btn-como-llegar-detalle');
    if (btnComoLlegar && r.lat && r.lng) {
      btnComoLlegar.addEventListener('click', () => {
        abrirRutaConGeolocalizacion(r.lat, r.lng, r.nombre);
      });
    } else if (btnComoLlegar) {
      btnComoLlegar.style.opacity = '0.5';
      btnComoLlegar.style.cursor = 'not-allowed';
      btnComoLlegar.addEventListener('click', () => {
        showToast('❌ Ubicación no disponible', 'Este restaurante no tiene coordenadas asociadas', 'error');
      });
    }
    
    // Botón "Cómo llegar" (móvil)
    const btnComoLlegarMobile = document.getElementById('btn-como-llegar-mobile');
    if (btnComoLlegarMobile && r.lat && r.lng) {
      btnComoLlegarMobile.addEventListener('click', () => {
        abrirRutaConGeolocalizacion(r.lat, r.lng, r.nombre);
      });
    } else if (btnComoLlegarMobile) {
      btnComoLlegarMobile.style.opacity = '0.5';
      btnComoLlegarMobile.style.cursor = 'not-allowed';
      btnComoLlegarMobile.addEventListener('click', () => {
        showToast('❌ Ubicación no disponible', 'Este restaurante no tiene coordenadas asociadas', 'error');
      });
    }
    
    // Botón "Compartir" (escritorio)
    const btnCompartir = document.getElementById('btn-compartir-detalle');
    if (btnCompartir) {
      btnCompartir.addEventListener('click', () => {
        mostrarMenuCompartir(r);
      });
    }
    
    // Botón "Compartir" (móvil)
    const btnCompartirMobile = document.getElementById('btn-compartir-mobile');
    if (btnCompartirMobile) {
      btnCompartirMobile.addEventListener('click', () => {
        mostrarMenuCompartir(r);
      });
    }
  }, 100);

  // ===== INICIALIZAR MAPA =====
  setTimeout(() => {
    let mapDiv = document.getElementById('detalle-mapa');
    if(mapDiv && r.lat && r.lng) {
      if(window.detailMap) window.detailMap.remove();
      let isDark = document.documentElement.classList.contains('dark');
      let tileUrl = isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      window.detailMap = L.map(mapDiv).setView([r.lat, r.lng], 16);
      L.tileLayer(tileUrl, { attribution: '&copy; Carto' }).addTo(window.detailMap);
      let blueIcon = L.divIcon({ html: `<div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style="background-color: #3498DB; border: 2px solid white;"><i class="fa-solid fa-utensils text-white text-xs"></i></div>`, iconSize: [32,32], iconAnchor: [16,32] });
      L.marker([r.lat, r.lng], { icon: blueIcon }).addTo(window.detailMap).bindPopup(`<b>${escapeHtml(r.direccion)}</b>`).openPopup();
      let centerBtn = document.getElementById('detalle-center-map');
      if(centerBtn) centerBtn.onclick = () => { if(window.detailMap) window.detailMap.setView([r.lat, r.lng], 16); };
      if(window.detailMap.getContainer) {
        window.detailMap.getContainer().style.zIndex = '1';
      }
    }
  }, 250);
}

// ===== RESPONSIVE - REDIMENSIONAR SIN RECARGAR =====
function handleResizeDetalle() {
  // Limpiar timeout anterior
  if (detailResizeTimeout) {
    clearTimeout(detailResizeTimeout);
  }
  
  detailResizeTimeout = setTimeout(() => {
    // Si estamos en la página de detalle y hay un restaurante cargado
    if (currentDetailRestId && document.getElementById('restaurante-detalle-content')) {
      // Verificar si la página de detalle está visible
      const detallePage = document.getElementById('page-detalle');
      if (detallePage && !detallePage.classList.contains('hidden')) {
        renderRestauranteDetalle(currentDetailRestId);
      }
    }
  }, 300);
}

// Agregar listener de resize
window.addEventListener('resize', handleResizeDetalle);

// ===== MODAL CARTA =====
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

// ===== RESEÑAS =====
function renderResenasPage(restId) {
  let r = getRestauranteById(restId);
  let resenas = getResenasByRestauranteId(restId);
  let user = getUsuarioActual();
  
  document.getElementById('page-detalle').classList.add('hidden');
  document.getElementById('page-resenas').classList.remove('hidden');
  
  let container = document.getElementById('resenas-detalle-content');
  if (!container) return;

  // Generar HTML de reseñas existentes
  let reseñasHtml = '';
  if (resenas.length === 0) {
    reseñasHtml = '<p class="text-center py-8 text-brand-text/60">No hay reseñas todavía. ¡Sé el primero en opinar!</p>';
  } else {
    reseñasHtml = resenas.map(rev => `
      <div class="p-4 bg-brand-bg/40 rounded-xl border border-brand-border/30">
        <div class="flex justify-between">
          <span class="font-bold">${rev.nombreUsuario}</span>
          <span class="text-[10px] text-brand-text/40">${rev.fecha}</span>
        </div>
        <span class="text-brand-primary font-bold text-sm">${"★".repeat(rev.puntuacion)}${"☆".repeat(5-rev.puntuacion)}</span>
        <p class="mt-2 text-sm">${rev.texto}</p>
      </div>
    `).join('');
  }

  // Si el usuario NO ha iniciado sesión, mostrar mensaje y botón
  let loginBox = '';
  if (!user) {
    loginBox = `
      <div class="reseñas-login-box">
        <div class="reseñas-divider"></div>
        <p class="reseñas-login-mensaje">
          <i class="fa-regular fa-circle-user"></i> Inicia sesión para dejar una reseña
        </p>
        <a href="login.html" class="reseñas-login-btn">
          <i class="fa-solid fa-arrow-right-to-bracket"></i> Iniciar Sesión
        </a>
      </div>
    `;
  } else {
    // Si el usuario ha iniciado sesión, mostrar el formulario de reseña
    loginBox = `
      <div class="reseñas-divider"></div>
      <div class="mt-6 pt-4">
        <h3 class="font-bold text-brand-text mb-3">Deja tu valoración</h3>
        <div class="star-rating" id="star-rating-resenas-page">
          <input type="radio" name="rating-res-page" value="5" id="star5p"><label for="star5p"></label>
          <input type="radio" name="rating-res-page" value="4" id="star4p"><label for="star4p"></label>
          <input type="radio" name="rating-res-page" value="3" id="star3p"><label for="star3p"></label>
          <input type="radio" name="rating-res-page" value="2" id="star2p"><label for="star2p"></label>
          <input type="radio" name="rating-res-page" value="1" id="star1p"><label for="star1p"></label>
        </div>
        <textarea id="review-text-resenas-page" rows="3" placeholder="Comparte tu experiencia..." class="w-full bg-brand-bg text-brand-text text-xs p-3 rounded-xl border border-brand-border mt-3"></textarea>
        <button onclick="submitReviewFromResenasPage('${restId}')" class="w-full mt-3 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-hover transition-colors">Publicar reseña</button>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="space-y-4">
      <div class="border-b border-brand-border pb-4">
        <button onclick="volverADetalle()" class="inline-flex items-center gap-2 text-brand-text hover:text-brand-primary font-medium mb-4 transition-colors group">
          <i class="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Volver al restaurante
        </button>
        <h1 class="text-2xl font-serif font-bold">Reseñas de ${r.nombre}</h1>
        <p class="text-xs text-brand-text/50 mt-1">${resenas.length} opiniones de la comunidad</p>
      </div>
      
      ${reseñasHtml}
      
      ${loginBox}
    </div>
  `;
}

function volverADetalle() {
  document.getElementById('page-resenas').classList.add('hidden');
  document.getElementById('page-detalle').classList.remove('hidden');
  if (currentDetailRestId) {
    renderRestauranteDetalle(currentDetailRestId);
  }
}

function submitReviewFromResenasPage(restId) {
  let user = getUsuarioActual();
  if(!user) { showToast("Error", "Debes iniciar sesión", "error"); return; }
  let selectedRating = document.querySelector('input[name="rating-res-page"]:checked');
  if(!selectedRating) { showToast("Error", "Selecciona una calificación", "error"); return; }
  let text = document.getElementById('review-text-resenas-page')?.value.trim();
  if(!text) { showToast("Error", "Escribe tu opinión", "error"); return; }
  agregarResena(restId, user.id, selectedRating.value, text);
  showToast("Reseña Registrada", "Gracias por tu opinión", "success");
  renderResenasPage(restId);
  if(currentDetailRestId === restId) renderRestauranteDetalle(restId);
}
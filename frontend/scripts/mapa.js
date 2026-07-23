// ============================================
// MAPA.JS - FUNCIONES DEL MAPA
// ============================================

let leafletMap = null;
let activePopup = null;
let mapMarkersLayer = null;

// Centro de La Habana (posición inicial)
const CENTRO_HABANA = [23.1136, -82.3666];
const ZOOM_INICIAL = 14;

function initMapGeneral() {
    // Limpiar mapa anterior si existe
    if (leafletMap) {
        leafletMap.remove();
        leafletMap = null;
    }

    // Crear el mapa con la posición centrada
    leafletMap = L.map('mapa-principal', { 
        zoomControl: true
    }).setView(CENTRO_HABANA, ZOOM_INICIAL);

    // Usar SIEMPRE el tile claro de CartoDB
    // El filtro CSS se encargará del modo oscuro
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.cartodb.com/">CartoDB</a> | &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
        maxZoom: 19,
        minZoom: 8,
        updateWhenIdle: false,
        updateWhenZooming: true,
        keepBuffer: 4
    }).addTo(leafletMap);

    // Añadir control de centrado personalizado
    let centerControl = L.control({ position: 'topright' });
    centerControl.onAdd = function() {
        let div = L.DomUtil.create('div', 'leaflet-control-custom-center');
        div.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
        div.title = 'Centrar mapa en La Habana';
        div.onclick = function() { 
            leafletMap.setView(CENTRO_HABANA, ZOOM_INICIAL); 
        };
        return div;
    };
    centerControl.addTo(leafletMap);

    // Manejar clics en el mapa para cerrar popups
    leafletMap.on('click', function(e) {
        if (activePopup) {
            try { 
                activePopup.closePopup(); 
            } catch(e) {}
            activePopup = null;
        }
    });

    // Forzar actualización del mapa
    setTimeout(function() {
        if (leafletMap) {
            leafletMap.invalidateSize();
        }
    }, 100);

    updateMapMarkers();
}

function createMapPopupMarker(rest) {
    const tipoIcon = getTipoIcon(rest.tipo);
    const isOpen = isRestaurantOpen(rest);
    const statusText = isOpen ? 'Abierto' : 'Cerrado';
    const statusClass = isOpen ? 'open' : 'closed';

    const icon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style="background-color: ${tipoIcon.color}; border: 2px solid white;"><i class="fa-solid ${tipoIcon.icon} text-white text-xs"></i></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -18]
    });

    const marker = L.marker([rest.lat, rest.lng], { icon: icon });
    marker.restauranteData = rest;

    const popupContent = `
        <div class="popup-body">
            <img src="${rest.img}" class="popup-img" onerror="this.src='https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400'">
            <div class="popup-title">${rest.nombre}</div>
            <div class="popup-meta">
                <span class="status-text ${statusClass}"><span class="status-dot ${statusClass}"></span>${statusText}</span>
                <span class="divider">·</span>
                <span class="rating"><i class="fa-solid fa-star"></i> ★</span>
            </div>
            <div class="popup-category">
                <i class="fa-regular fa-compass"></i> ${rest.tipo.charAt(0).toUpperCase() + rest.tipo.slice(1)} · ${rest.municipio}
            </div>
            <button class="popup-btn" onclick="event.stopPropagation(); window.location.href='detalles.html?id=${rest.id}'">Ver detalles</button>
        </div>
    `;

    marker.bindPopup(popupContent, {
        className: 'custom-popup-wrapper',
        maxWidth: 290,
        minWidth: 250
    });

    marker.on('click', function(e) {
        if (e && e.originalEvent) {
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault();
        }
        if (e) { e.stopPropagation(); e.preventDefault(); }

        if (activePopup === this) {
            this.closePopup();
            activePopup = null;
            return;
        }
        if (activePopup) {
            try { activePopup.closePopup(); } catch(e) {}
            activePopup = null;
        }
        try { this.openPopup(); activePopup = this; } catch(e) {}
    });

    marker.on('popupclose', function(e) {
        if (activePopup === this) activePopup = null;
    });

    return marker;
}

function updateMapMarkers() {
    if (!leafletMap) return;
    
    if (mapMarkersLayer) {
        try { leafletMap.removeLayer(mapMarkersLayer); } catch(e) {}
        mapMarkersLayer = null;
    }
    
    if (activePopup) {
        try { activePopup.closePopup(); } catch(e) {}
        activePopup = null;
    }

    let rest = getRestaurantes();
    let municipio = document.getElementById('map-select-municipio')?.value || 'todos';
    let tipo = document.getElementById('map-select-tipo')?.value || 'todos';
    let chkAire = document.getElementById('map-chk-aire')?.checked || false;
    let chkClima = document.getElementById('map-chk-clima')?.checked || false;
    let chkParqueo = document.getElementById('map-chk-parqueo')?.checked || false;

    let filtrados = rest.filter(r => {
        if (municipio !== 'todos' && r.municipio !== municipio) return false;
        if (tipo !== 'todos' && r.tipo !== tipo) return false;
        if (chkAire && !r.aire) return false;
        if (chkClima && !r.clima) return false;
        if (chkParqueo && !r.parqueo) return false;
        return true;
    });

    mapMarkersLayer = L.layerGroup().addTo(leafletMap);
    filtrados.forEach(r => {
        try { mapMarkersLayer.addLayer(createMapPopupMarker(r)); } catch(e) {}
    });
    
    // Solo ajustar el zoom si hay marcadores, pero mantener la posición centrada
    if (filtrados.length > 0 && filtrados.length <= 3) {
        let bounds = L.latLngBounds(filtrados.map(r => [r.lat, r.lng]));
        leafletMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (filtrados.length > 0) {
        // Si hay muchos marcadores, mostrar todos en vista general
        let bounds = L.latLngBounds(filtrados.map(r => [r.lat, r.lng]));
        leafletMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
}

function resetMapFilters() {
    document.getElementById('map-select-municipio').value = 'todos';
    document.getElementById('map-select-tipo').value = 'todos';
    document.getElementById('map-chk-aire').checked = false;
    document.getElementById('map-chk-clima').checked = false;
    document.getElementById('map-chk-parqueo').checked = false;
    updateMapMarkers();
    // Volver al centro de La Habana
    if(leafletMap) leafletMap.setView(CENTRO_HABANA, ZOOM_INICIAL);
}
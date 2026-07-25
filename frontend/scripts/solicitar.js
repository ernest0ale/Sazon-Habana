// ============================================
// SOLICITAR.JS - FUNCIONES DE SOLICITUD DE ESPACIO
// ============================================

let currentWizardStep = 1;
let wizardLeafletMap = null;
let wizardMarker = null;
let simulatedUploadedFileName = "";

// Mapeo de días en español a abreviaturas
const DIAS_SEMANA_MAP = {
  'Lunes': 'LUN',
  'Martes': 'MAR',
  'Miércoles': 'MIE',
  'Jueves': 'JUE',
  'Viernes': 'VIE',
  'Sábado': 'SAB',
  'Domingo': 'DOM'
};

const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function initSolicitudWizard() { 
  currentWizardStep = 1; 
  simulatedUploadedFileName = ""; 
  const fileNameDiv = document.getElementById('wiz-file-name');
  if (fileNameDiv) fileNameDiv.innerText = ""; 
  const form = document.getElementById('wizard-form');
  if (form) form.reset(); 
  showWizardStep(1); 
}

function showWizardStep(step) { 
  currentWizardStep = step; 
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.add('hidden')); 
  const target = document.getElementById(`wizard-step-${step}`);
  if (target) target.classList.remove('hidden'); 
  
  for(let i=1;i<=3;i++) { 
    let ind = document.getElementById(`step-indicator-${i}`); 
    let num = document.getElementById(`step-num-${i}`); 
    if(i<step) { 
      if (ind) ind.className = "flex flex-col items-center flex-1 text-center font-bold text-brand-secondary"; 
      if (num) { 
        num.className = "w-10 h-10 rounded-full bg-brand-secondary text-white flex items-center justify-center font-bold text-base shadow-md mb-2"; 
        num.innerHTML = '<i class="fa-solid fa-check"></i>'; 
      } 
    } else if(i===step) { 
      if (ind) ind.className = "flex flex-col items-center flex-1 text-center font-bold text-brand-primary"; 
      if (num) { 
        num.className = "w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-base shadow-md mb-2"; 
        num.innerHTML = i; 
      } 
    } else { 
      if (ind) ind.className = "flex flex-col items-center flex-1 text-center font-semibold text-brand-text/45"; 
      if (num) { 
        num.className = "w-10 h-10 rounded-full bg-brand-border/60 text-brand-text/50 flex items-center justify-center font-bold text-base mb-2"; 
        num.innerHTML = i; 
      } 
    } 
  } 
  
  let btnPrev = document.getElementById('wiz-btn-prev'); 
  let btnNext = document.getElementById('wiz-btn-next'); 
  let btnSubmit = document.getElementById('wiz-btn-submit'); 
  
  if (btnPrev) btnPrev.disabled = step===1; 
  if(step===3) { 
    if (btnNext) btnNext.classList.add('hidden'); 
    if (btnSubmit) btnSubmit.classList.remove('hidden'); 
  } else { 
    if (btnNext) btnNext.classList.remove('hidden'); 
    if (btnSubmit) btnSubmit.classList.add('hidden'); 
  } 
  
  if(step===2) setTimeout(initWizardMap, 300); 
}

// ===== FUNCIONES PARA HORARIOS =====

function validarFormatoHora(horaStr) {
  if (!horaStr) return false;
  horaStr = horaStr.trim();
  
  const regex12h = /^(\d{1,2})\s*[:.]?\s*(\d{2})?\s*(AM|PM|am|pm|a\.m\.|p\.m\.)?$/i;
  const regex24h = /^(\d{1,2})\s*[:.]?\s*(\d{2})?$/;
  
  let match12 = horaStr.match(regex12h);
  let match24 = horaStr.match(regex24h);
  
  if (match12) {
    let horas = parseInt(match12[1]);
    let minutos = match12[2] ? parseInt(match12[2]) : 0;
    if (horas < 1 || horas > 12) return false;
    if (minutos < 0 || minutos > 59) return false;
    return true;
  }
  
  if (match24) {
    let horas = parseInt(match24[1]);
    let minutos = match24[2] ? parseInt(match24[2]) : 0;
    if (horas < 0 || horas > 23) return false;
    if (minutos < 0 || minutos > 59) return false;
    return true;
  }
  
  return false;
}

function normalizarHora(horaStr) {
  if (!horaStr) return '';
  horaStr = horaStr.trim();
  
  const regex12h = /^(\d{1,2})\s*[:.]?\s*(\d{2})?\s*(AM|PM|am|pm|a\.m\.|p\.m\.)?$/i;
  const regex24h = /^(\d{1,2})\s*[:.]?\s*(\d{2})?$/;
  
  let match12 = horaStr.match(regex12h);
  let match24 = horaStr.match(regex24h);
  
  if (match12) {
    let horas = parseInt(match12[1]);
    let minutos = match12[2] ? parseInt(match12[2]) : 0;
    let meridiem = match12[3] ? match12[3].toUpperCase() : '';
    if (!meridiem) meridiem = 'AM';
    return `${horas}:${String(minutos).padStart(2, '0')} ${meridiem}`;
  }
  
  if (match24) {
    let horas = parseInt(match24[1]);
    let minutos = match24[2] ? parseInt(match24[2]) : 0;
    let meridiem = horas >= 12 ? 'PM' : 'AM';
    let hora12 = horas % 12;
    if (hora12 === 0) hora12 = 12;
    return `${hora12}:${String(minutos).padStart(2, '0')} ${meridiem}`;
  }
  
  return horaStr;
}

// ===== FUNCIÓN PARA OBTENER HORARIOS DE LOS RANGOS =====
function obtenerHorariosPorDia() {
  const horarios = {};
  const diasInicializados = {};
  
  // Inicializar todos los días
  DIAS_ORDEN.forEach(function(dia) {
    horarios[dia] = null;
    diasInicializados[dia] = false;
  });
  
  // Recorrer todos los rangos
  const rangos = document.querySelectorAll('.horario-rango');
  rangos.forEach(function(rango) {
    const diaDesde = rango.querySelector('.dia-desde').value;
    const diaHasta = rango.querySelector('.dia-hasta').value;
    const horaInicio = rango.querySelector('.hora-inicio').value;
    const horaFin = rango.querySelector('.hora-fin').value;
    const cerrado = rango.querySelector('.cerrado-checkbox').checked;
    
    const idxDesde = DIAS_ORDEN.indexOf(diaDesde);
    const idxHasta = DIAS_ORDEN.indexOf(diaHasta);
    
    // Si es cerrado, marcar todos los días del rango como cerrados
    if (cerrado) {
      for (let i = idxDesde; i <= idxHasta; i++) {
        horarios[DIAS_ORDEN[i]] = 'Cerrado';
        diasInicializados[DIAS_ORDEN[i]] = true;
      }
      return;
    }
    
    // Si no es cerrado, aplicar el horario a todos los días del rango
    const horaInicioNormalizada = normalizarHora(horaInicio);
    const horaFinNormalizada = normalizarHora(horaFin);
    const horarioStr = `${horaInicioNormalizada} - ${horaFinNormalizada}`;
    
    for (let i = idxDesde; i <= idxHasta; i++) {
      horarios[DIAS_ORDEN[i]] = horarioStr;
      diasInicializados[DIAS_ORDEN[i]] = true;
    }
  });
  
  // Los días no inicializados se consideran cerrados
  DIAS_ORDEN.forEach(function(dia) {
    if (!diasInicializados[dia]) {
      horarios[dia] = 'Cerrado';
    }
  });
  
  return horarios;
}

// ===== FUNCIÓN PARA GENERAR TEXTO DE HORARIO LEGIBLE =====
function generarTextoHorario(horarios) {
  if (!horarios) return '';
  
  const partes = [];
  
  // Agrupar días con el mismo horario
  const grupos = {};
  DIAS_ORDEN.forEach(function(dia) {
    const horario = horarios[dia] || '';
    if (!grupos[horario]) grupos[horario] = [];
    grupos[horario].push(dia);
  });
  
  // Generar texto para cada grupo
  for (const [horario, diasList] of Object.entries(grupos)) {
    if (diasList.length === 1) {
      partes.push(`${diasList[0]}: ${horario}`);
    } else if (diasList.length === 7) {
      partes.push(`Todos los días: ${horario}`);
    } else {
      // Verificar si son días consecutivos
      const indices = diasList.map(function(d) { return DIAS_ORDEN.indexOf(d); }).sort(function(a,b){return a-b;});
      let esConsecutivo = true;
      for (let i = 1; i < indices.length; i++) {
        if (indices[i] !== indices[i-1] + 1) {
          esConsecutivo = false;
          break;
        }
      }
      if (esConsecutivo && indices.length > 2) {
        partes.push(`${diasList[0]} - ${diasList[diasList.length-1]}: ${horario}`);
      } else {
        partes.push(`${diasList.join(', ')}: ${horario}`);
      }
    }
  }
  
  return partes.join(' | ');
}

// ===== FUNCIÓN PARA VALIDAR QUE NO HAYA SOLAPAMIENTO DE DÍAS =====
function validarSolapamientoDias() {
  const rangos = document.querySelectorAll('.horario-rango');
  const diasCubiertos = new Set();
  
  for (const rango of rangos) {
    const diaDesde = rango.querySelector('.dia-desde').value;
    const diaHasta = rango.querySelector('.dia-hasta').value;
    const idxDesde = DIAS_ORDEN.indexOf(diaDesde);
    const idxHasta = DIAS_ORDEN.indexOf(diaHasta);
    
    for (let i = idxDesde; i <= idxHasta; i++) {
      const dia = DIAS_ORDEN[i];
      if (diasCubiertos.has(dia)) {
        return false; // Solapamiento detectado
      }
      diasCubiertos.add(dia);
    }
  }
  
  return true;
}

function nextWizardStep() { 
  if(currentWizardStep===1) { 
    let n=document.getElementById('wiz-nombre')?.value.trim(); 
    let t=document.getElementById('wiz-tipo')?.value; 
    let p=document.getElementById('wiz-precio')?.value; 
    let tel=document.getElementById('wiz-telefono')?.value.trim(); 
    let d=document.getElementById('wiz-descripcion')?.value.trim(); 
    
    if(!n||!t||!p||!tel||!d) { 
      showToast("Faltan Datos", "Completa todos los campos requeridos.", "error"); 
      return; 
    }
    
    if(!/^\d{8}$/.test(tel)) {
      showToast("Teléfono inválido", "Debe tener 8 dígitos numéricos.", "error");
      return;
    }
    
    // Validar solapamiento de días
    if (!validarSolapamientoDias()) {
      showToast("Solapamiento de días", "Los rangos de días no deben solaparse entre sí.", "error");
      return;
    }
    
    // Validar que todos los días tengan horario
    const horarios = obtenerHorariosPorDia();
    let todosCubiertos = true;
    DIAS_ORDEN.forEach(function(dia) {
      if (!horarios[dia]) todosCubiertos = false;
    });
    
    if (!todosCubiertos) {
      showToast("Horario incompleto", "Todos los días deben tener un horario definido.", "error");
      return;
    }
  } 
  if(currentWizardStep===2) { 
    let z=document.getElementById('wiz-municipio')?.value; 
    let dir=document.getElementById('wiz-direccion')?.value.trim(); 
    if(!z||!dir) { showToast("Falta Ubicación", "Completa municipio y dirección.", "error"); return; } 
  } 
  if(currentWizardStep<3) showWizardStep(currentWizardStep+1); 
}

function prevWizardStep() { 
  if(currentWizardStep>1) showWizardStep(currentWizardStep-1); 
}

function initWizardMap() { 
  if(wizardLeafletMap) wizardLeafletMap.remove(); 
  const mapDiv = document.getElementById('wizard-map');
  if (!mapDiv) return;
  
  wizardLeafletMap = L.map('wizard-map', { zoomControl: false }).setView([23.1136, -82.3666], 13); 
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '© OSM' }).addTo(wizardLeafletMap); 
  
  let dragIcon = L.divIcon({ 
    className: 'wizard-drag-pin', 
    html: '<div class="w-10 h-10 rounded-full bg-brand-primary text-white border-2 border-white flex items-center justify-center shadow-2xl animate-bounce"><i class="fa-solid fa-map-pin"></i></div>', 
    iconSize: [40,40], 
    iconAnchor: [20,40] 
  }); 
  
  wizardMarker = L.marker([23.1136, -82.3666], { draggable: true, icon: dragIcon }).addTo(wizardLeafletMap); 
  wizardMarker.on('dragend', () => { 
    let pos = wizardMarker.getLatLng(); 
    const latInput = document.getElementById('wiz-lat');
    const lngInput = document.getElementById('wiz-lng');
    if (latInput) latInput.value = pos.lat; 
    if (lngInput) lngInput.value = pos.lng; 
  }); 
  
  wizardLeafletMap.on('click', (e) => { 
    wizardMarker.setLatLng(e.latlng); 
    const latInput = document.getElementById('wiz-lat');
    const lngInput = document.getElementById('wiz-lng');
    if (latInput) latInput.value = e.latlng.lat; 
    if (lngInput) lngInput.value = e.latlng.lng; 
  }); 
  
  setTimeout(() => {
    if (wizardLeafletMap) wizardLeafletMap.invalidateSize();
  }, 400);
}

function handleSimulatedFileUpload(e) { 
  let file = e.target.files[0]; 
  if(file) { 
    simulatedUploadedFileName = file.name; 
    const fileNameDiv = document.getElementById('wiz-file-name');
    if (fileNameDiv) fileNameDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> Archivo: ${file.name}`; 
    showToast("Archivo Cargado", `Se simuló la carga de ${file.name}`, "success"); 
  } 
}

function handleWizardSubmit(e) { 
  e.preventDefault(); 
  const chk = document.getElementById('wiz-chk-responsable');
  if(!chk || !chk.checked) { 
    showToast("Aceptación Obligatoria", "Debes aceptar los términos.", "error"); 
    return; 
  } 
  
  // Obtener horarios
  const horarios = obtenerHorariosPorDia();
  const horarioTexto = generarTextoHorario(horarios);
  
  let user = getUsuarioActual(); 
  let nombreGestor = user ? user.nombre : "Solicitante"; 
  let emailGestor = user ? user.email : "solicitante@ejemplo.com"; 
  let passwordGestor = user ? user.password : "solicitante123"; 
  
  let nueva = { 
    nombre: document.getElementById('wiz-nombre')?.value || '', 
    tipo: document.getElementById('wiz-tipo')?.value || '', 
    precio: document.getElementById('wiz-precio')?.value || '', 
    horario: horarioTexto,
    telefono: document.getElementById('wiz-telefono')?.value || '', 
    descripcion: document.getElementById('wiz-descripcion')?.value || '', 
    img: document.getElementById('wiz-img')?.value || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800", 
    municipio: document.getElementById('wiz-municipio')?.value || '', 
    direccion: document.getElementById('wiz-direccion')?.value || '', 
    lat: parseFloat(document.getElementById('wiz-lat')?.value || 23.1136), 
    lng: parseFloat(document.getElementById('wiz-lng')?.value || -82.3666), 
    aire: document.getElementById('wiz-chk-aire')?.checked || false, 
    clima: document.getElementById('wiz-chk-clima')?.checked || false, 
    parqueo: document.getElementById('wiz-chk-parqueo')?.checked || false, 
    fileLegal: simulatedUploadedFileName || "documento.pdf", 
    nombreGestor, 
    emailGestor, 
    passwordGestor,
    horariosPorDia: horarios
  }; 
  
  agregarSolicitud(nueva); 
  showToast("Solicitud Enviada", "Tu solicitud será revisada por el equipo.", "success"); 
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}
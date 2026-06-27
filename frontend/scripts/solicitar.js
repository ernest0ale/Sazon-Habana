// ============================================
// SOLICITAR.JS - FUNCIONES DE SOLICITUD DE ESPACIO
// ============================================

let currentWizardStep = 1;
let wizardLeafletMap = null;
let wizardMarker = null;
let simulatedUploadedFileName = "";

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

function nextWizardStep() { 
  if(currentWizardStep===1) { 
    let n=document.getElementById('wiz-nombre')?.value.trim(); 
    let t=document.getElementById('wiz-tipo')?.value; 
    let p=document.getElementById('wiz-precio')?.value; 
    let h=document.getElementById('wiz-horario')?.value.trim(); 
    let tel=document.getElementById('wiz-telefono')?.value.trim(); 
    let d=document.getElementById('wiz-descripcion')?.value.trim(); 
    if(!n||!t||!p||!h||!tel||!d) { showToast("Faltan Datos", "Completa todos los campos requeridos.", "error"); return; } 
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
  
  let user = getUsuarioActual(); 
  let nombreGestor = user ? user.nombre : "Solicitante"; 
  let emailGestor = user ? user.email : "solicitante@ejemplo.com"; 
  let passwordGestor = user ? user.password : "solicitante123"; 
  
  let nueva = { 
    nombre: document.getElementById('wiz-nombre')?.value || '', 
    tipo: document.getElementById('wiz-tipo')?.value || '', 
    precio: document.getElementById('wiz-precio')?.value || '', 
    horario: document.getElementById('wiz-horario')?.value || '', 
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
    passwordGestor 
  }; 
  
  agregarSolicitud(nueva); 
  showToast("Solicitud Enviada", "Tu solicitud será revisada por el equipo.", "success"); 
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}
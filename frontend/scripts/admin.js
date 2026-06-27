// ============================================
// ADMIN.JS - FUNCIONES DEL PANEL ADMIN
// ============================================

function renderAdminPanel() {
  let user = getUsuarioActual();
  if(!user || user.rol !== 'admin') { 
    window.location.href = 'index.html';
    return; 
  }
  
  let solicitudes = getSolicitudes();
  let tbody = document.getElementById('admin-table-body');
  let badge = document.getElementById('admin-pending-badge');
  let empty = document.getElementById('admin-empty-state');
  
  if (!tbody || !badge || !empty) return;
  
  tbody.innerHTML = '';
  badge.innerText = solicitudes.length;
  
  if(solicitudes.length===0) { 
    empty.classList.remove('hidden'); 
    return; 
  }
  empty.classList.add('hidden');
  
  solicitudes.forEach(s => {
    let row = document.createElement('tr');
    row.className = "hover:bg-brand-bg/30 text-xs text-brand-text border-b border-brand-border/20";
    row.innerHTML = `
      <td class="p-4 font-bold">${s.nombre}</td>
      <td class="p-4"><div><span class="font-semibold">${s.nombreGestor}</span><br><span class="text-[10px]">${s.emailGestor}</span></div></td>
      <td class="p-4"><span class="capitalize">${s.tipo}</span><br><span class="text-[10px]">${s.municipio}</span></td>
      <td class="p-4"><i class="fa-solid fa-file-pdf"></i> ${s.fileLegal}</td>
      <td class="p-4 text-right">
        <button onclick="approveSolicitud('${s.id}')" class="bg-brand-secondary text-white px-3 py-1.5 rounded-lg mr-2 hover:bg-opacity-80">Aprobar</button>
        <button onclick="rejectSolicitud('${s.id}')" class="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600">Rechazar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function approveSolicitud(id) { 
  if(aprobarSolicitud(id)) { 
    showToast("Aprobado", "Restaurante y gestor creados.", "success"); 
    renderAdminPanel(); 
  } 
}

function rejectSolicitud(id) { 
  if(rechazarSolicitud(id)) { 
    showToast("Rechazado", "Solicitud eliminada.", "info"); 
    renderAdminPanel(); 
  } 
}
// ============================================
// MIESPACIO.JS - GESTIÓN DEL ESPACIO DEL GESTOR
// ============================================

function renderMiEspacio() {
  let user = getUsuarioActual();
  if(!user || user.rol !== 'gestor' || !user.restauranteId) { 
    window.location.href = 'index.html';
    return; 
  }
  let rest = getRestauranteById(user.restauranteId);
  if(!rest) { 
    window.location.href = 'index.html';
    return; 
  }
  
  let container = document.getElementById('mi-espacio-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="space-y-6">
      <div class="border-b border-brand-border pb-4">
        <h2 class="text-2xl font-serif font-bold">${rest.nombre}</h2>
        <p class="text-xs text-brand-text/50">Panel de gestión de tu espacio</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold uppercase text-brand-text/60">Nombre del espacio</label>
          <input type="text" id="me-nombre" value="${rest.nombre}" class="w-full bg-brand-bg text-brand-text p-3 rounded-xl border border-brand-border">
        </div>
        <div>
          <label class="text-xs font-bold uppercase text-brand-text/60">Horario</label>
          <input type="text" id="me-horario" value="${rest.horario}" class="w-full bg-brand-bg text-brand-text p-3 rounded-xl border border-brand-border">
        </div>
        <div class="md:col-span-2">
          <label class="text-xs font-bold uppercase text-brand-text/60">Descripción</label>
          <textarea id="me-descripcion" rows="4" class="w-full bg-brand-bg text-brand-text p-3 rounded-xl border border-brand-border">${rest.descripcion}</textarea>
        </div>
        <div>
          <label class="text-xs font-bold uppercase text-brand-text/60">Teléfono de contacto</label>
          <input type="text" id="me-telefono" value="${rest.telefono}" class="w-full bg-brand-bg text-brand-text p-3 rounded-xl border border-brand-border">
        </div>
        <div>
          <label class="text-xs font-bold uppercase text-brand-text/60">Dirección</label>
          <input type="text" id="me-direccion" value="${rest.direccion}" class="w-full bg-brand-bg text-brand-text p-3 rounded-xl border border-brand-border">
        </div>
      </div>
      <button onclick="saveMiEspacio('${rest.id}')" class="w-full py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-hover transition-colors">Guardar Cambios</button>
    </div>
  `;
}

function saveMiEspacio(id) {
  let nombre = document.getElementById('me-nombre')?.value.trim();
  let horario = document.getElementById('me-horario')?.value.trim();
  let desc = document.getElementById('me-descripcion')?.value.trim();
  let telefono = document.getElementById('me-telefono')?.value.trim();
  let direccion = document.getElementById('me-direccion')?.value.trim();
  
  if(!nombre||!horario||!desc||!telefono||!direccion) { 
    showToast("Faltan Campos", "Completa todos los campos.", "error"); 
    return; 
  }
  
  if(actualizarRestaurante(id, { nombre, horario, descripcion: desc, telefono, direccion })) {
    showToast("Actualizado", "Tu espacio ha sido actualizado.", "success");
    renderMiEspacio();
  } else showToast("Error", "No se pudo actualizar.", "error");
}
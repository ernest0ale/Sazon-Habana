// ============================================
// PERFIL.JS - FUNCIONES DEL PERFIL
// ============================================

function renderPerfilPage() {
  let user = getUsuarioActual();
  if(!user) {
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('prof-nombre').value = user.nombre;
  document.getElementById('prof-email').value = user.email;
  document.getElementById('prof-telefono').value = user.telefono || '';
  
  let resenas = JSON.parse(localStorage.getItem("sh_resenas"));
  let misResenas = resenas.filter(r => r.usuarioId === user.id);
  let listDiv = document.getElementById('prof-resenas-list');
  if (!listDiv) return;
  
  listDiv.innerHTML = misResenas.length===0 ? 
    '<p class="text-[11px] text-brand-text/40 text-center py-4">No has escrito reseñas.</p>' : 
    misResenas.map(rev => {
      const rest = getRestauranteById(rev.restauranteId);
      return `<div class="p-3 bg-brand-bg rounded-xl border border-brand-border/40 text-[11px] flex justify-between items-center">
        <span class="truncate max-w-[150px]">${rest?.nombre || 'Restaurante eliminado'}</span>
        <button onclick="removeUserReview('${rev.id}')" class="text-red-500 hover:text-red-700"><i class="fa-regular fa-trash-can"></i></button>
      </div>`;
    }).join('');
}

function saveProfileData() {
  let user = getUsuarioActual();
  if(!user) return;
  let nombre = document.getElementById('prof-nombre').value.trim();
  let telefono = document.getElementById('prof-telefono').value.trim();
  if(!nombre) { showToast("Error", "El nombre es obligatorio.", "error"); return; }
  
  let usuarios = JSON.parse(localStorage.getItem("sh_usuarios"));
  let idx = usuarios.findIndex(u => u.id === user.id);
  if(idx !== -1) {
    usuarios[idx].nombre = nombre;
    usuarios[idx].telefono = telefono;
    localStorage.setItem("sh_usuarios", JSON.stringify(usuarios));
    user.nombre = nombre;
    user.telefono = telefono;
    localStorage.setItem("sh_usuario_actual", JSON.stringify(user));
    showToast("Perfil Actualizado", "Cambios guardados.", "success");
    renderAuthNavs();
    renderPerfilPage();
  }
}

function removeUserReview(id) {
  eliminarResena(id);
  showToast("Reseña Eliminada", "La valoración ha sido borrada.", "success");
  renderPerfilPage();
}

function openChangePasswordModal() { 
  document.getElementById('modal-change-password').classList.remove('hidden'); 
}

function closeChangePasswordModal() { 
  document.getElementById('modal-change-password').classList.add('hidden'); 
  document.getElementById('m-old-pass').value = ''; 
  document.getElementById('m-new-pass').value = ''; 
}

function submitChangePassword() { 
  let user = getUsuarioActual(); 
  if (!user) return;
  let oldP = document.getElementById('m-old-pass').value; 
  let newP = document.getElementById('m-new-pass').value; 
  
  if(oldP !== user.password) { showToast("Error", "Contraseña actual incorrecta.", "error"); return; } 
  if(newP.length<4) { showToast("Error", "Mínimo 4 caracteres.", "error"); return; } 
  
  let usuarios = JSON.parse(localStorage.getItem("sh_usuarios")); 
  let idx = usuarios.findIndex(u => u.id === user.id); 
  if(idx !== -1) { 
    usuarios[idx].password = newP; 
    localStorage.setItem("sh_usuarios", JSON.stringify(usuarios)); 
    user.password = newP; 
    localStorage.setItem("sh_usuario_actual", JSON.stringify(user)); 
    showToast("Actualizada", "Contraseña cambiada.", "success"); 
    closeChangePasswordModal(); 
  } 
}

function openDeleteAccountModal() { 
  document.getElementById('modal-delete-account').classList.remove('hidden'); 
}

function closeDeleteAccountModal() { 
  document.getElementById('modal-delete-account').classList.add('hidden'); 
  document.getElementById('m-del-confirm').value = ''; 
}

function submitDeleteAccount() { 
  let user = getUsuarioActual();
  if (!user) return;
  let confirm = document.getElementById('m-del-confirm').value.trim(); 
  if(confirm !== "ELIMINAR") { showToast("Error", "Escribe ELIMINAR", "error"); return; } 
  
  let usuarios = JSON.parse(localStorage.getItem("sh_usuarios")); 
  let idx = usuarios.findIndex(u => u.id === user.id); 
  if(idx !== -1) { 
    usuarios[idx].estado = "eliminado_pendiente"; 
    localStorage.setItem("sh_usuarios", JSON.stringify(usuarios)); 
    localStorage.removeItem("sh_usuario_actual"); 
    renderAuthNavs(); 
    showToast("Cuenta en Gracia", "Se eliminará en 14 días.", "info"); 
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  } 
}
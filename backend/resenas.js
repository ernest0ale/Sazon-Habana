// ============================================
// RESENAS.JS - GESTIÓN DE RESEÑAS
// ============================================

function agregarResena(restauranteId, usuarioId, puntuacion, texto) { 
  let resenas = JSON.parse(localStorage.getItem("sh_resenas")); 
  let usuarios = JSON.parse(localStorage.getItem("sh_usuarios")); 
  let user = usuarios.find(u => u.id === usuarioId); 
  let nueva = { 
    id: "rev_" + Date.now(), 
    restauranteId, 
    usuarioId, 
    nombreUsuario: user ? user.nombre : "Anónimo", 
    puntuacion: parseInt(puntuacion), 
    texto, 
    fecha: new Date().toISOString().split('T')[0] 
  }; 
  resenas.push(nueva); 
  localStorage.setItem("sh_resenas", JSON.stringify(resenas)); 
  return true; 
}

function eliminarResena(id) { 
  let resenas = JSON.parse(localStorage.getItem("sh_resenas")); 
  localStorage.setItem("sh_resenas", JSON.stringify(resenas.filter(r => r.id !== id))); 
  return true; 
}
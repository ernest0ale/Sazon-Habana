// ============================================
// SOLICITUDES.JS - GESTIÓN DE SOLICITUDES
// ============================================

function getSolicitudes() { 
  return JSON.parse(localStorage.getItem("sh_solicitudes")); 
}

function agregarSolicitud(sol) { 
  let solicitudes = getSolicitudes(); 
  sol.id = "sol_" + Date.now(); 
  solicitudes.push(sol); 
  localStorage.setItem("sh_solicitudes", JSON.stringify(solicitudes)); 
  return true; 
}

function aprobarSolicitud(id) { 
  let solicitudes = getSolicitudes(); 
  let sol = solicitudes.find(s => s.id === id); 
  if(!sol) return false; 
  
  let usuarios = JSON.parse(localStorage.getItem("sh_usuarios")); 
  let nuevoRestId = "res_" + Date.now(); 
  let nuevoGestorId = "usr_" + Date.now(); 
  
  let nuevoGestor = { 
    id: nuevoGestorId, 
    email: sol.emailGestor, 
    telefono: sol.telefono, 
    password: sol.passwordGestor, 
    nombre: sol.nombreGestor, 
    rol: "gestor", 
    restauranteId: nuevoRestId, 
    estado: "activo", 
    preferencias: [sol.tipo], 
    colorPrimario: "#5B8A72" 
  }; 
  usuarios.push(nuevoGestor); 
  localStorage.setItem("sh_usuarios", JSON.stringify(usuarios)); 
  
  let nuevoRest = { 
    id: nuevoRestId, 
    nombre: sol.nombre, 
    municipio: sol.municipio, 
    direccion: sol.direccion, 
    tipo: sol.tipo, 
    precio: sol.precio, 
    horario: sol.horario, 
    telefono: sol.telefono, 
    descripcion: sol.descripcion, 
    img: sol.img || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600", 
    galeria: [sol.img], 
    lat: parseFloat(sol.lat), 
    lng: parseFloat(sol.lng), 
    aire: sol.aire, 
    clima: sol.clima, 
    parqueo: sol.parqueo, 
    createdAt: new Date().toISOString(), 
    platosPopulares: [{ 
      nombre: "Especialidad de la Casa", 
      precio: "$1500 CUP", 
      descripcion: "Plato de firma introducido por el nuevo gestor.", 
      img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=200" 
    }], 
    seccionesCarta: [{ 
      seccion: "Especialidades", 
      platos: [{ nombre: "Plato Aprobado", precio: "$1500 CUP" }] 
    }] 
  }; 
  
  let restaurantes = getRestaurantes(); 
  restaurantes.push(nuevoRest); 
  localStorage.setItem("sh_restaurantes", JSON.stringify(restaurantes)); 
  localStorage.setItem("sh_solicitudes", JSON.stringify(solicitudes.filter(s => s.id !== id))); 
  return true; 
}

function rechazarSolicitud(id) { 
  let solicitudes = getSolicitudes(); 
  localStorage.setItem("sh_solicitudes", JSON.stringify(solicitudes.filter(s => s.id !== id))); 
  return true; 
}
/**
 * Script principal - Backend
 * Maneja la lógica de negocio, autenticación y operaciones CRUD
 */

// ===== FUNCIONES DE AUTENTICACIÓN =====

function registrarUsuario(nombre, email, telefono, password, rol, preferencias) {
  let usuarios = getUsuarios();
  if(usuarios.find(u => u.email === email)) {
    return { exito: false, mensaje: "Email ya registrado" };
  }
  let nuevo = {
    id: "usr_" + Date.now(),
    nombre,
    email,
    telefono,
    password,
    rol,
    estado: "activo",
    restauranteId: null,
    preferencias,
    colorPrimario: "#5B8A72"
  };
  usuarios.push(nuevo);
  localStorage.setItem("sh_usuarios", JSON.stringify(usuarios));
  localStorage.setItem("sh_usuario_actual", JSON.stringify(nuevo));
  return { exito: true, usuario: nuevo };
}

function iniciarSesion(identificador, password) {
  let usuarios = getUsuarios();
  let usuario = usuarios.find(u => (u.email === identificador || u.telefono === identificador) && u.password === password);
  if(!usuario) {
    return { exito: false, mensaje: "Credenciales incorrectas" };
  }
  localStorage.setItem("sh_usuario_actual", JSON.stringify(usuario));
  return { exito: true, usuario };
}

function getUsuarioActual() {
  return JSON.parse(localStorage.getItem("sh_usuario_actual"));
}

function cerrarSesion() {
  localStorage.removeItem("sh_usuario_actual");
}

function actualizarUsuario(id, datos) {
  let usuarios = getUsuarios();
  let idx = usuarios.findIndex(u => u.id === id);
  if(idx !== -1) {
    usuarios[idx] = { ...usuarios[idx], ...datos };
    localStorage.setItem("sh_usuarios", JSON.stringify(usuarios));
    if(getUsuarioActual()?.id === id) {
      localStorage.setItem("sh_usuario_actual", JSON.stringify(usuarios[idx]));
    }
    return true;
  }
  return false;
}

// ===== FUNCIONES DE RESEÑAS =====

function agregarResena(restauranteId, usuarioId, puntuacion, texto) {
  let resenas = getResenas();
  let user = getUsuarioById(usuarioId);
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
  let resenas = getResenas();
  localStorage.setItem("sh_resenas", JSON.stringify(resenas.filter(r => r.id !== id)));
  return true;
}

// ===== FUNCIONES DE SOLICITUDES =====

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

  let usuarios = getUsuarios();
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
    platosPopulares: [{ nombre: "Especialidad de la Casa", precio: "$1500 CUP", descripcion: "Plato de firma introducido por el nuevo gestor.", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=200" }],
    seccionesCarta: [{ seccion: "Especialidades", platos: [{ nombre: "Plato Aprobado", precio: "$1500 CUP" }] }]
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

// ===== FUNCIONES DE BÚSQUEDA =====

function buscarRestaurantes(query) {
  if (!query) return getRestaurantes();
  const q = query.toLowerCase().trim();
  return getRestaurantes().filter(r => {
    return r.nombre.toLowerCase().includes(q) ||
           r.descripcion.toLowerCase().includes(q) ||
           r.tipo.toLowerCase().includes(q) ||
           r.municipio.toLowerCase().includes(q);
  });
}

function filtrarRestaurantes(filtros) {
  let rest = getRestaurantes();
  const { municipio, tipo, precio, aire, clima, parqueo, query } = filtros;

  if (query) {
    const q = query.toLowerCase().trim();
    rest = rest.filter(r => {
      return r.nombre.toLowerCase().includes(q) ||
             r.descripcion.toLowerCase().includes(q) ||
             r.tipo.toLowerCase().includes(q) ||
             r.municipio.toLowerCase().includes(q);
    });
  }

  if (municipio && municipio !== 'todos') {
    rest = rest.filter(r => r.municipio === municipio);
  }
  if (tipo && tipo !== 'todos') {
    rest = rest.filter(r => r.tipo === tipo);
  }
  if (precio && precio !== 'todos') {
    rest = rest.filter(r => r.precio === precio);
  }
  if (aire) {
    rest = rest.filter(r => r.aire === true);
  }
  if (clima) {
    rest = rest.filter(r => r.clima === true);
  }
  if (parqueo) {
    rest = rest.filter(r => r.parqueo === true);
  }

  return rest;
}

function ordenarRestaurantes(restaurantes, criterio) {
  const sorted = [...restaurantes];
  switch(criterio) {
    case 'name':
      return sorted.sort((a,b) => a.nombre.localeCompare(b.nombre));
    case 'p-low':
      return sorted.sort((a,b) => parseInt(a.precio) - parseInt(b.precio));
    case 'p-high':
      return sorted.sort((a,b) => parseInt(b.precio) - parseInt(a.precio));
    case 'pop':
    default:
      return sorted.sort((a,b) => {
        let rA = getResenasByRestauranteId(a.id);
        let rB = getResenasByRestauranteId(b.id);
        let pA = rA.length ? rA.reduce((s,c) => s + c.puntuacion, 0) / rA.length : 0;
        let pB = rB.length ? rB.reduce((s,c) => s + c.puntuacion, 0) / rB.length : 0;
        return pB - pA;
      });
  }
}
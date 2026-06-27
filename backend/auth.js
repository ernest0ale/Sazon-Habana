// ============================================
// AUTH.JS - AUTENTICACIÓN
// ============================================

function getUsuarioActual() { 
  return JSON.parse(localStorage.getItem("sh_usuario_actual")); 
}

function registrarUsuario(nombre, email, telefono, password, rol, preferencias) { 
  let usuarios = JSON.parse(localStorage.getItem("sh_usuarios")); 
  if(usuarios.find(u => u.email === email)) return { exito: false, mensaje: "Email ya registrado" }; 
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
  let usuarios = JSON.parse(localStorage.getItem("sh_usuarios")); 
  let usuario = usuarios.find(u => (u.email === identificador || u.telefono === identificador) && u.password === password); 
  if(!usuario) return { exito: false, mensaje: "Credenciales incorrectas" }; 
  localStorage.setItem("sh_usuario_actual", JSON.stringify(usuario)); 
  return { exito: true, usuario }; 
}

function cerrarSesion() {
  localStorage.removeItem("sh_usuario_actual");
  document.documentElement.style.setProperty('--brand-primary', '#5B8A72');
  localStorage.setItem('sh_theme_color', '#5B8A72');
  showToast("Sesión Cerrada", "Vuelve pronto.", "info");
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

function setThemeColor(color) {
  document.documentElement.style.setProperty('--brand-primary', color);
  localStorage.setItem('sh_theme_color', color);
  let user = getUsuarioActual();
  if(user) {
    let usuarios = JSON.parse(localStorage.getItem("sh_usuarios"));
    let idx = usuarios.findIndex(u => u.id === user.id);
    if(idx !== -1) {
      usuarios[idx].colorPrimario = color;
      localStorage.setItem("sh_usuarios", JSON.stringify(usuarios));
      user.colorPrimario = color;
      localStorage.setItem("sh_usuario_actual", JSON.stringify(user));
    }
  }
  showToast("Color Actualizado", "La identidad de la aplicación ha cambiado.", "success");
}
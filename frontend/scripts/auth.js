// ============================================
// AUTH.JS - FUNCIONES DE AUTENTICACIÓN FRONTEND
// ============================================

function handleLogin(e) { 
  e.preventDefault(); 
  let id = document.getElementById('login-id').value.trim(); 
  let pass = document.getElementById('login-password').value; 
  let res = iniciarSesion(id, pass); 
  if(res.exito) { 
    if(res.usuario.colorPrimario) setThemeColor(res.usuario.colorPrimario); 
    renderAuthNavs(); 
    showToast("Bienvenido", `Hola ${res.usuario.nombre}`, "success"); 
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  } else showToast("Error", res.mensaje, "error"); 
}

function handleRegister(e) { 
  e.preventDefault(); 
  let nombre = document.getElementById('reg-nombre').value.trim(); 
  let email = document.getElementById('reg-email').value.trim(); 
  let telefono = document.getElementById('reg-telefono').value.trim(); 
  let pass = document.getElementById('reg-password').value; 
  let confirmPass = document.getElementById('reg-confirm-password').value; 
  
  if(pass !== confirmPass) { showToast("Error", "Las contraseñas no coinciden.", "error"); return; } 
  if(pass.length<4) { showToast("Error", "Contraseña mínimo 4 caracteres.", "error"); return; } 
  
  let rol = document.querySelector('input[name="reg-rol"]:checked')?.value || 'casual'; 
  let prefs = []; 
  ['criolla','rápida','italiana','mariscos','cafetería','heladería','dulcería'].forEach(p => { 
    let btn = document.getElementById(`reg-pref-${p}`); 
    if(btn && btn.classList.contains('bg-brand-primary')) prefs.push(p); 
  }); 
  
  let res = registrarUsuario(nombre, email, telefono, pass, rol, prefs); 
  if(res.exito) { 
    showToast("Registro Exitoso", "Cuenta creada.", "success"); 
    renderAuthNavs(); 
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  } else showToast("Error", res.mensaje, "error"); 
}

function toggleRegPref(pref) { 
  let btn = document.getElementById(`reg-pref-${pref}`); 
  if (!btn) return;
  btn.classList.toggle('bg-brand-bg'); 
  btn.classList.toggle('text-brand-text'); 
  btn.classList.toggle('bg-brand-primary'); 
  btn.classList.toggle('text-white'); 
}

function simulateRecovery() { 
  let email = prompt("Escribe tu correo:"); 
  if(email) showToast("Recuperación", "Se ha enviado un enlace simulado.", "info"); 
}
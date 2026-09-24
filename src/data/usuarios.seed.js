/**
 * ============================================
 * USUARIOS.SEED.JS - Usuarios iniciales
 * ============================================
 * Las contraseñas aquí son PLANAS porque este archivo
 * alimentará un script que las hashea con bcrypt antes
 * de insertarlas en Supabase.
 *
 * ⚠️ NUNCA exponer este archivo al cliente.
 */

export const USUARIOS_SEED = [
  {
    email: 'admin@sazonhabana.com',
    telefono: '50000000',
    passwordPlano: 'Admin123!',
    nombre: 'Administrador Sazón',
    rol: 'admin',
    estado: 'activo',
    preferencias: [],
    color_primario: '#5B8A72',
    restaurante_id: null
  },
  {
    email: 'gestor@elbiky.com',
    telefono: '51111111',
    passwordPlano: 'Biky123!',
    nombre: 'Dueño El Biky',
    rol: 'gestor',
    estado: 'activo',
    preferencias: ['criolla'],
    color_primario: '#5B8A72',
    restaurante_id: null // se asigna tras insertar El Biky
  }
];

export default USUARIOS_SEED;
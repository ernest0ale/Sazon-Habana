/**
 * ============================================
 * CONSTANTS.JS - Constantes de la aplicación
 * ============================================
 */

export const APP_NAME = 'Sazón Habana';
export const APP_TAGLINE = 'Sabor auténtico y cubanía';

// Roles
export const ROLES = {
  CASUAL: 'casual',
  GESTOR: 'gestor',
  ADMIN: 'admin'
};

// Tipos de cocina
export const TIPOS_COCINA = [
  'criolla',
  'rápida',
  'italiana',
  'mariscos',
  'cafetería',
  'heladería',
  'dulcería'
];

// Rangos de precio
export const RANGOS_PRECIO = ['1', '2', '3'];

// Municipios de La Habana
export const MUNICIPIOS_LA_HABANA = [
  'Arroyo Naranjo',
  'Boyeros',
  'Centro Habana',
  'Cerro',
  'Cotorro',
  'Diez de Octubre',
  'Guanabacoa',
  'Habana del Este',
  'Habana Vieja',
  'La Lisa',
  'Marianao',
  'Playa',
  'Plaza de la Revolución',
  'Regla',
  'San Miguel del Padrón'
];

// Estados de usuario
export const ESTADOS_USUARIO = {
  ACTIVO: 'activo',
  PENDIENTE: 'pendiente',
  ELIMINADO_PENDIENTE: 'eliminado_pendiente',
  SUSPENDIDO: 'suspendido'
};

// Colores de tema
export const COLORES_TEMA = [
  '#5B8A72',
  '#4A735A',
  '#7BA88E',
  '#3D6B4F',
  '#6A967C'
];

// Paginación
export const ITEMS_PER_PAGE = 9;

// Iconos por tipo de cocina
export const TIPO_ICONS = {
  criolla: { icon: 'utensils', color: '#5B8A72' },
  rápida: { icon: 'burger', color: '#E67E22' },
  italiana: { icon: 'pizza-slice', color: '#E74C3C' },
  mariscos: { icon: 'fish', color: '#3498DB' },
  cafetería: { icon: 'mug-hot', color: '#8BAA7B' },
  heladería: { icon: 'ice-cream', color: '#F1C40F' },
  dulcería: { icon: 'cake-candles', color: '#E91E63' }
};

// Rutas protegidas por rol
export const PROTECTED_ROUTES = {
  '/admin': [ROLES.ADMIN],
  '/mi-espacio': [ROLES.GESTOR],
  '/perfil': [ROLES.CASUAL, ROLES.GESTOR, ROLES.ADMIN]
};

// Rutas solo para no autenticados
export const GUEST_ONLY_ROUTES = ['/login', '/registro'];

// Tiempo de expiración de reseña editable (ms)
export const RESENA_EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;
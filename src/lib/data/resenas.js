/**
 * ============================================
 * RESENAS.JS - Acceso a datos de reseñas
 * ============================================
 * Almacenamiento temporal en memoria (mientras migramos a Supabase).
 * En cliente: localStorage. En servidor: array en memoria (no persistente).
 */

import { isClient } from '@/lib/utils/helpers';

const STORAGE_KEY = 'sh_resenas_temp';

let memoryStore = [];

function loadFromStorage() {
  if (!isClient()) return memoryStore;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryStore;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(list) {
  if (!isClient()) {
    memoryStore = list;
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Ignorar quota errors
  }
}

export function getResenas() {
  return loadFromStorage();
}

export function getResenasByRestauranteId(restauranteId) {
  return getResenas().filter((r) => r.restauranteId === restauranteId);
}

export function getResenasByUsuarioId(usuarioId) {
  return getResenas().filter((r) => r.usuarioId === usuarioId);
}

export function agregarResena({ restauranteId, usuarioId, nombreUsuario, puntuacion, texto }) {
  const resenas = getResenas();
  const nueva = {
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    restauranteId,
    usuarioId,
    nombreUsuario: nombreUsuario || 'Anónimo',
    puntuacion: parseInt(puntuacion, 10),
    texto,
    fecha: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  resenas.push(nueva);
  saveToStorage(resenas);
  return nueva;
}

export function eliminarResena(id) {
  const resenas = getResenas().filter((r) => r.id !== id);
  saveToStorage(resenas);
  return true;
}

export function getCalificacionPromedio(restauranteId) {
  const resenas = getResenasByRestauranteId(restauranteId);
  if (resenas.length === 0) return null;
  const suma = resenas.reduce((acc, r) => acc + r.puntuacion, 0);
  return suma / resenas.length;
}
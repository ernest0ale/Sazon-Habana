/**
 * ============================================
 * RESTAURANTES.JS - Acceso a datos de restaurantes
 * ============================================
 * Capa de abstracción. En cliente lee del seed en memoria.
 * Cuando migremos a Supabase, estas funciones llamarán a la API.
 */

import { RESTAURANTES_SEED } from '@/data/restaurantes.seed';

let cache = null;

/**
 * Devuelve todos los restaurantes.
 * Los añade un `id` estable a partir del nombre si no lo tienen.
 */
export function getRestaurantes() {
  if (cache) return cache;

  cache = RESTAURANTES_SEED.map((r, i) => ({
    ...r,
    id: r.id || `res_${String(i + 1).padStart(3, '0')}`
  }));

  return cache;
}

export function getRestauranteById(id) {
  return getRestaurantes().find((r) => r.id === id) || null;
}

export function getRestaurantesByMunicipio(municipio) {
  if (!municipio || municipio === 'todos') return getRestaurantes();
  return getRestaurantes().filter((r) => r.municipio === municipio);
}

export function getRestaurantesByTipo(tipo) {
  if (!tipo || tipo === 'todos') return getRestaurantes();
  return getRestaurantes().filter((r) => r.tipo === tipo);
}

/**
 * Municipios únicos con restaurantes registrados.
 */
export function getMunicipiosConRestaurantes() {
  const set = new Set(getRestaurantes().map((r) => r.municipio).filter(Boolean));
  return Array.from(set).sort();
}

/**
 * Busca restaurantes por texto libre.
 * Coincide con nombre, descripción, tipo, municipio o platos.
 */
export function buscarRestaurantes(query) {
  if (!query) return getRestaurantes();

  const q = String(query).toLowerCase().trim();
  if (!q) return getRestaurantes();

  return getRestaurantes().filter((r) => {
    if (r.nombre?.toLowerCase().includes(q)) return true;
    if (r.descripcion?.toLowerCase().includes(q)) return true;
    if (r.tipo?.toLowerCase().includes(q)) return true;
    if (r.municipio?.toLowerCase().includes(q)) return true;

    const platos = r.platos_populares || r.platosPopulares || [];
    if (platos.some((p) => p.nombre?.toLowerCase().includes(q))) return true;

    const secciones = r.secciones_carta || r.seccionesCarta || [];
    if (secciones.some((sec) => sec.platos?.some((p) => p.nombre?.toLowerCase().includes(q)))) {
      return true;
    }

    return false;
  });
}

/**
 * Filtra por múltiples criterios.
 */
export function filtrarRestaurantes(filtros = {}) {
  const {
    municipio = 'todos',
    tipo = 'todos',
    precio = 'todos',
    aire = false,
    clima = false,
    parqueo = false,
    query = ''
  } = filtros;

  let rest = query ? buscarRestaurantes(query) : getRestaurantes();

  if (municipio !== 'todos') rest = rest.filter((r) => r.municipio === municipio);
  if (tipo !== 'todos') rest = rest.filter((r) => r.tipo === tipo);
  if (precio !== 'todos') rest = rest.filter((r) => r.precio === precio);
  if (aire) rest = rest.filter((r) => r.aire === true);
  if (clima) rest = rest.filter((r) => r.clima === true);
  if (parqueo) rest = rest.filter((r) => r.parqueo === true);

  return rest;
}

/**
 * Ordena un array de restaurantes según el criterio.
 */
export function ordenarRestaurantes(lista, criterio = 'pop', getRatingFn) {
  const sorted = [...lista];

  switch (criterio) {
    case 'name':
      return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));

    case 'p-low':
      return sorted.sort((a, b) => parseInt(a.precio, 10) - parseInt(b.precio, 10));

    case 'p-high':
      return sorted.sort((a, b) => parseInt(b.precio, 10) - parseInt(a.precio, 10));

    case 'pop':
    default: {
      if (!getRatingFn) return sorted;
      return sorted.sort((a, b) => {
        const pA = getRatingFn(a.id) ?? 0;
        const pB = getRatingFn(b.id) ?? 0;
        return pB - pA;
      });
    }
  }
}

/**
 * Utilidad para tests / dev: invalida la caché en memoria.
 */
export function _resetCache() {
  cache = null;
}
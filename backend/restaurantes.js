/**
 * Restaurantes - Backend
 * Funciones específicas para manejo de restaurantes
 */

function getRestaurantesPopulares() {
  const rest = getRestaurantes();
  return [...rest].sort((a,b) => {
    const rA = getResenasByRestauranteId(a.id).length;
    const rB = getResenasByRestauranteId(b.id).length;
    return rB - rA;
  });
}

function getRestaurantesNuevos() {
  const rest = getRestaurantes();
  return [...rest].sort((a,b) => b.id.localeCompare(a.id));
}

function getRestaurantesMejorValorados() {
  const rest = getRestaurantes();
  return [...rest].sort((a,b) => {
    const rA = getResenasByRestauranteId(a.id);
    const rB = getResenasByRestauranteId(b.id);
    const pA = rA.length ? rA.reduce((s,c) => s + c.puntuacion, 0) / rA.length : 0;
    const pB = rB.length ? rB.reduce((s,c) => s + c.puntuacion, 0) / rB.length : 0;
    return pB - pA;
  });
}

function getCalificacionPromedio(restauranteId) {
  const resenas = getResenasByRestauranteId(restauranteId);
  if (resenas.length === 0) return null;
  return resenas.reduce((s, c) => s + c.puntuacion, 0) / resenas.length;
}

function getTiposCocina() {
  const tipos = getRestaurantes().map(r => r.tipo);
  return [...new Set(tipos)];
}
/**
 * ============================================
 * HORARIO-PARSER.JS - Parseo de horarios
 * ============================================
 * Convierte un string de horario en un objeto por día.
 *
 * Ejemplo:
 *   "Lunes - Viernes: 09:00 - 22:00 | Sábado: 10:00 - 23:00 | Domingo: Cerrado"
 *   → { Lunes: '09:00 - 22:00', Martes: '09:00 - 22:00', ..., Domingo: 'Cerrado' }
 */

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function parsearHorario(horarioStr) {
  if (!horarioStr) return null;

  // Caso simple: "HH:MM AM - HH:MM PM" (mismo horario todos los días)
  const simpleRegex = /^(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[-–]\s*(\d{1,2}:\d{2}\s*(?:AM|PM))$/i;
  const simpleMatch = horarioStr.match(simpleRegex);
  if (simpleMatch) {
    const resultado = {};
    DIAS_SEMANA.forEach((dia) => {
      resultado[dia] = `${simpleMatch[1]} - ${simpleMatch[2]}`;
    });
    return resultado;
  }

  const resultado = {};
  let partes = horarioStr.split('|').map((s) => s.trim());
  if (partes.length === 1) {
    partes = horarioStr.split(',').map((s) => s.trim());
  }

  partes.forEach((parte) => {
    if (!parte) return;

    // "Lunes - Viernes: 09:00 AM - 10:00 PM"
    const rangoRegex = /^([A-Za-záéíóúÁÉÍÓÚñÑ]+)\s*[-–]\s*([A-Za-záéíóúÁÉÍÓÚñÑ]+)\s*:\s*(.+)$/i;
    const rangoMatch = parte.match(rangoRegex);
    if (rangoMatch) {
      const diaInicio = rangoMatch[1].trim();
      const diaFin = rangoMatch[2].trim();
      const horario = rangoMatch[3].trim();

      const idxInicio = DIAS_SEMANA.indexOf(diaInicio);
      const idxFin = DIAS_SEMANA.indexOf(diaFin);

      if (idxInicio !== -1 && idxFin !== -1) {
        for (let i = idxInicio; i <= idxFin; i++) {
          resultado[DIAS_SEMANA[i]] = horario;
        }
      }
      return;
    }

    // "Lunes, Martes y Miércoles: 09:00 AM - 10:00 PM"
    const diaRegex = /^([A-Za-záéíóúÁÉÍÓÚñÑ,\s]+)\s*:\s*(.+)$/i;
    const diaMatch = parte.match(diaRegex);
    if (diaMatch) {
      const diasStr = diaMatch[1].trim();
      const horario = diaMatch[2].trim();

      const diasList = diasStr.split(/[,y]\s*/).map((s) => s.trim());
      diasList.forEach((dia) => {
        const diaLimpio = dia.replace(/[.,]/g, '').trim();
        const idx = DIAS_SEMANA.findIndex(
          (d) =>
            d.toLowerCase() === diaLimpio.toLowerCase() ||
            d.toLowerCase().startsWith(diaLimpio.toLowerCase())
        );
        if (idx !== -1) resultado[DIAS_SEMANA[idx]] = horario;
      });
      return;
    }

    // "Todos los días: 12:00 PM - 10:00 PM"
    if (parte.toLowerCase().includes('todos los días') || parte.toLowerCase().includes('todos los dias')) {
      const horarioMatch = parte.match(/\d{1,2}:\d{2}\s*(?:AM|PM)\s*[-–]\s*\d{1,2}:\d{2}\s*(?:AM|PM)/i);
      if (horarioMatch) {
        DIAS_SEMANA.forEach((dia) => {
          resultado[dia] = horarioMatch[0];
        });
      }
    }
  });

  if (Object.keys(resultado).length === 0) return null;
  return resultado;
}

export function isRestaurantOpen(restaurante, now = new Date()) {
  if (!restaurante?.horario) return false;
  const horarios = parsearHorario(restaurante.horario);
  if (!horarios) return false;

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaHoy = diasSemana[now.getDay()];
  const horarioHoy = horarios[diaHoy];

  if (!horarioHoy || horarioHoy.toLowerCase().includes('cerrado')) return false;

  const rangeMatch = horarioHoy.match(
    /(\d{1,2}):?(\d{2})?\s*(AM|PM)\s*[-–]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i
  );
  if (!rangeMatch) return false;

  const h1 = parseInt(rangeMatch[1], 10);
  const m1 = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : 0;
  const ampm1 = rangeMatch[3].toUpperCase();
  const h2 = parseInt(rangeMatch[4], 10);
  const m2 = rangeMatch[5] ? parseInt(rangeMatch[5], 10) : 0;
  const ampm2 = rangeMatch[6].toUpperCase();

  let hour1 = h1;
  if (ampm1 === 'PM' && h1 !== 12) hour1 += 12;
  if (ampm1 === 'AM' && h1 === 12) hour1 = 0;

  let hour2 = h2;
  if (ampm2 === 'PM' && h2 !== 12) hour2 += 12;
  if (ampm2 === 'AM' && h2 === 12) hour2 = 0;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = hour1 * 60 + m1;
  let endMinutes = hour2 * 60 + m2;

  if (endMinutes < startMinutes) endMinutes += 24 * 60;

  if (startMinutes <= currentMinutes && currentMinutes < endMinutes) return true;
  if (currentMinutes < endMinutes && startMinutes > endMinutes) {
    return currentMinutes < endMinutes;
  }
  return false;
}
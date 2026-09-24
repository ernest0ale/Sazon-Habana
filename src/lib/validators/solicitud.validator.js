/**
 * ============================================
 * SOLICITUD.VALIDATOR.JS
 * ============================================
 */

import {
  validateString,
  validateEnum,
  validatePhoneCU,
  validateEmail,
  validatePassword,
  validateName,
  validateLatitude,
  validateLongitude,
  validateUrl
} from '@/lib/security/validators';
import { TIPOS_COCINA, RANGOS_PRECIO, MUNICIPIOS_LA_HABANA } from '@/lib/utils/constants';

/**
 * Valida el payload completo de una solicitud de espacio.
 */
export function validateSolicitudForm(data) {
  const errors = [];

  // Paso 1
  errors.push(...validateString(data.nombre, { min: 3, max: 120, fieldName: 'Nombre del establecimiento' }).errors);
  errors.push(...validateEnum(data.tipo, TIPOS_COCINA, { fieldName: 'Tipo de cocina' }).errors);
  errors.push(...validateEnum(data.precio, RANGOS_PRECIO, { fieldName: 'Rango de precios' }).errors);
  errors.push(...validatePhoneCU(data.telefono, { required: true }).errors);
  errors.push(...validateString(data.descripcion, { min: 10, max: 2000, fieldName: 'Descripción' }).errors);

  if (data.img) {
    errors.push(...validateUrl(data.img, { fieldName: 'URL de imagen' }).errors);
  }

  if (data.horario) {
    errors.push(...validateString(data.horario, { min: 3, max: 500, fieldName: 'Horario' }).errors);
  }

  // Paso 2
  errors.push(...validateEnum(data.municipio, MUNICIPIOS_LA_HABANA, { fieldName: 'Municipio' }).errors);
  errors.push(...validateString(data.direccion, { min: 3, max: 250, fieldName: 'Dirección' }).errors);
  errors.push(...validateLatitude(data.lat).errors);
  errors.push(...validateLongitude(data.lng).errors);

  // Paso 3
  if (!data.fileLegal || data.fileLegal.trim() === '') {
    errors.push('Debes adjuntar tu documento legal.');
  }

  if (!data.acceptedTerms) {
    errors.push('Debes aceptar la declaración de responsabilidad.');
  }

  // Datos del gestor
  if (data.nombreGestor) {
    errors.push(...validateName(data.nombreGestor, { fieldName: 'Nombre del gestor' }).errors);
  }
  if (data.emailGestor) {
    errors.push(...validateEmail(data.emailGestor).errors);
  }
  if (data.passwordGestor) {
    errors.push(...validatePassword(data.passwordGestor).errors);
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Valida solo el paso actual del wizard.
 */
export function validateSolicitudStep(step, data, horarios = []) {
  const errors = [];

  if (step === 1) {
    errors.push(...validateString(data.nombre, { min: 3, max: 120, fieldName: 'Nombre' }).errors);
    errors.push(...validateEnum(data.tipo, TIPOS_COCINA, { fieldName: 'Tipo de cocina' }).errors);
    errors.push(...validateEnum(data.precio, RANGOS_PRECIO, { fieldName: 'Rango de precios' }).errors);
    errors.push(...validatePhoneCU(data.telefono, { required: true }).errors);
    errors.push(...validateString(data.descripcion, { min: 10, max: 2000, fieldName: 'Descripción' }).errors);

    if (!horarios || horarios.length === 0) {
      errors.push('Debes definir al menos un rango de horario.');
    }
  }

  if (step === 2) {
    errors.push(...validateEnum(data.municipio, MUNICIPIOS_LA_HABANA, { fieldName: 'Municipio' }).errors);
    errors.push(...validateString(data.direccion, { min: 3, max: 250, fieldName: 'Dirección' }).errors);
    errors.push(...validateLatitude(data.lat).errors);
    errors.push(...validateLongitude(data.lng).errors);
  }

  if (step === 3) {
    if (!data.fileLegal) errors.push('Debes adjuntar tu documento legal.');
    if (!data.acceptedTerms) errors.push('Debes aceptar la declaración.');
  }

  return { ok: errors.length === 0, errors };
}
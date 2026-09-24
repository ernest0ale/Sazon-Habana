/**
 * ============================================
 * RESTAURANTE.VALIDATOR.JS
 * ============================================
 */

import {
  validateString,
  validateEnum,
  validatePhoneCU,
  validateUrl,
  validateLatitude,
  validateLongitude,
  validateArray
} from '@/lib/security/validators';
import { TIPOS_COCINA, RANGOS_PRECIO, MUNICIPIOS_LA_HABANA } from '@/lib/utils/constants';

export function validateRestauranteForm(data) {
  const errors = [];

  errors.push(...validateString(data.nombre, { min: 3, max: 120, fieldName: 'Nombre' }).errors);
  errors.push(...validateEnum(data.tipo, TIPOS_COCINA, { fieldName: 'Tipo de cocina' }).errors);
  errors.push(...validateEnum(data.precio, RANGOS_PRECIO, { fieldName: 'Rango de precios' }).errors);
  errors.push(...validateEnum(data.municipio, MUNICIPIOS_LA_HABANA, { fieldName: 'Municipio' }).errors);
  errors.push(...validateString(data.direccion, { min: 3, max: 250, fieldName: 'Dirección' }).errors);
  errors.push(...validatePhoneCU(data.telefono, { required: true }).errors);
  errors.push(...validateString(data.descripcion, { min: 10, max: 2000, fieldName: 'Descripción' }).errors);
  errors.push(...validateString(data.horario, { min: 3, max: 500, fieldName: 'Horario' }).errors);
  errors.push(...validateLatitude(data.lat).errors);
  errors.push(...validateLongitude(data.lng).errors);

  if (data.img) {
    errors.push(...validateUrl(data.img, { fieldName: 'URL de imagen' }).errors);
  }

  if (data.galeria) {
    errors.push(...validateArray(data.galeria, { max: 10, fieldName: 'Galería' }).errors);
  }

  return { ok: errors.length === 0, errors };
}

export function validateRestauranteUpdate(data) {
  const errors = [];

  if (data.nombre !== undefined) {
    errors.push(...validateString(data.nombre, { min: 3, max: 120, fieldName: 'Nombre' }).errors);
  }
  if (data.descripcion !== undefined) {
    errors.push(...validateString(data.descripcion, { min: 10, max: 2000, fieldName: 'Descripción' }).errors);
  }
  if (data.telefono !== undefined) {
    errors.push(...validatePhoneCU(data.telefono, { required: true }).errors);
  }
  if (data.direccion !== undefined) {
    errors.push(...validateString(data.direccion, { min: 3, max: 250, fieldName: 'Dirección' }).errors);
  }
  if (data.horario !== undefined) {
    errors.push(...validateString(data.horario, { min: 3, max: 500, fieldName: 'Horario' }).errors);
  }

  return { ok: errors.length === 0, errors };
}
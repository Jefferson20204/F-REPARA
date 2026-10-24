import { ApiError } from './ApiError';
import { isRecord } from './apiClient';

/** Extrae `datos` del envoltorio { exito, mensaje, datos }; falla si el backend indica exito=false. */
export function unwrapDatos(payload: unknown): unknown {
  if (!isRecord(payload)) {
    throw new ApiError('invalid-response', 'Respuesta sin el formato esperado.');
  }
  if (payload.exito === false) {
    const message = typeof payload.mensaje === 'string' && payload.mensaje !== '' ? payload.mensaje : 'La operación no se completó.';
    throw new ApiError('client', message);
  }
  return payload.datos;
}

export function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' ? value : null;
}

export function readNumber(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

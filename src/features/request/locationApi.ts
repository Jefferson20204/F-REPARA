import { request, isRecord } from '../../core/api/apiClient';
import { ApiError } from '../../core/api/ApiError';
import { readNumber, readString, unwrapDatos } from '../../core/api/envelope';
import { getActiveRequestId } from './activeRequest';
import { geocodeAddress, type Point } from './geocode';

export interface RequestLocation {
  address: string;
  point: Point | null;
}

/** Ubicacion de la solicitud en curso: coordenadas del back o, si faltan, geocodificando la direccion. */
export async function fetchActiveRequestLocation(signal: AbortSignal): Promise<RequestLocation> {
  const id = getActiveRequestId();
  if (id === null) throw new ApiError('client', 'No hay una solicitud activa.');

  const datos = unwrapDatos(await request('/solicitudes/mis-solicitudes', { signal }));
  if (!Array.isArray(datos)) {
    throw new ApiError('invalid-response', 'La lista de solicitudes no tiene el formato esperado.');
  }

  const record = datos.find((item) => isRecord(item) && readNumber(item, 'idSolicitud') === id);
  if (!isRecord(record)) throw new ApiError('client', 'No se encontro la solicitud en curso.');

  const address = readString(record, 'direccionServicio') ?? '';
  const lat = readNumber(record, 'latitud');
  const lng = readNumber(record, 'longitud');

  if (lat !== null && lng !== null) return { address, point: { lat, lng } };
  if (address === '') return { address, point: null };
  return { address, point: await geocodeAddress(address, signal) };
}
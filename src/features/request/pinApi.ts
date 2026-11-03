import { request, isRecord } from '../../core/api/apiClient';
import { ApiError } from '../../core/api/ApiError';
import { unwrapDatos } from '../../core/api/envelope';
import { getActiveRequestId } from './activeRequest';

function requireRequestId(): number {
  const id = getActiveRequestId();
  if (id === null) throw new ApiError('client', 'No hay una solicitud activa.');
  return id;
}

/** GET /pin/solicitud/{id}: devuelve el PIN activo de la solicitud en curso. */
export async function fetchActivePin(signal: AbortSignal): Promise<string> {
  const datos = unwrapDatos(await request('/pin/solicitud/' + requireRequestId(), { signal }));
  const raw = isRecord(datos) ? (datos.codigoPin ?? datos.pin ?? datos.codigo) : undefined;
  const text = typeof raw === 'number' ? String(raw).padStart(4, '0') : typeof raw === 'string' ? raw : '';

  if (/^\d{4}$/.test(text)) return text;
  throw new ApiError(
    'client',
    text !== ''
      ? 'El servidor devolvio el PIN cifrado, asi que no se puede mostrar.'
      : 'La respuesta del servidor no incluye el PIN.',
  );
}

/** POST /pin/generar/{id} */
export async function generatePin(): Promise<void> {
  unwrapDatos(await request('/pin/generar/' + requireRequestId(), { method: 'POST' }));
}
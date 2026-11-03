import { request, isRecord } from '../../core/api/apiClient';
import { ApiError } from '../../core/api/ApiError';
import { readNumber, readString, unwrapDatos } from '../../core/api/envelope';
import { setActiveRequestId } from './activeRequest';
import { CATEGORY_ID, type RequestDraft } from './requestDraft';

/* El back solo tiene descripcionProblema: marca, modelo y horario viajan dentro del texto. */
export function buildDescription(draft: RequestDraft): string {
  const lines = ['Electrodomestico: ' + draft.appliance, 'Marca: ' + draft.brand];
  if (draft.model !== '') lines.push('Modelo: ' + draft.model);
  lines.push('Problema: ' + draft.problem);
  if (draft.suggestedAt !== '') lines.push('Horario sugerido: ' + draft.suggestedAt);
  return lines.join('\n');
}

/** POST /solicitudes/crear. Deja guardado el id de la solicitud creada. */
export async function createRequest(draft: RequestDraft): Promise<void> {
  const body = {
    idCategoria: CATEGORY_ID[draft.appliance],
    descripcionProblema: buildDescription(draft),
    direccionServicio: draft.address,
  };
  const datos = unwrapDatos(await request('/solicitudes/crear', { method: 'POST', body }));
  if (isRecord(datos)) {
    const id = readNumber(datos, 'idSolicitud');
    if (id !== null) setActiveRequestId(id);
  }
}

export type StatusTone = 'warning' | 'success' | 'danger';

export interface RequestSummary {
  id: number;
  title: string;
  description: string;
  statusCode: string;
  statusLabel: string;
  tone: StatusTone;
}

const STATUS: Record<string, { label: string; tone: StatusTone }> = {
  EN_CREACION: { label: 'En analisis', tone: 'warning' },
  PENDIENTE_ASIGNACION: { label: 'En analisis', tone: 'warning' },
  ACEPTADA: { label: 'Aceptada', tone: 'success' },
  PAGO_INICIAL_PENDIENTE: { label: 'Pago pendiente', tone: 'warning' },
  EN_CAMINO: { label: 'En camino', tone: 'success' },
  EN_DIAGNOSTICO: { label: 'En diagnostico', tone: 'success' },
  DIAGNOSTICO_NO_REPARABLE: { label: 'No reparable', tone: 'danger' },
  REPARACION_EN_PROCESO: { label: 'En reparacion', tone: 'success' },
  PAGO_FINAL_PENDIENTE: { label: 'Pago pendiente', tone: 'warning' },
  COMPLETADO: { label: 'Completado', tone: 'success' },
  CANCELADO: { label: 'Cancelado', tone: 'danger' },
};

function readLine(text: string, label: string): string | null {
  for (const line of text.split('\n')) {
    if (line.startsWith(label + ': ')) return line.slice(label.length + 2).trim();
  }
  return null;
}

function toSummary(record: Record<string, unknown>): RequestSummary | null {
  const id = readNumber(record, 'idSolicitud');
  if (id === null) return null;

  const text = readString(record, 'descripcionProblema') ?? '';
  const appliance = readLine(text, 'Electrodomestico');
  const brand = readLine(text, 'Marca');
  const model = readLine(text, 'Modelo');
  const problem = readLine(text, 'Problema');

  const device = [brand, model].filter((part): part is string => part !== null && part !== '').join(' ');
  const description = problem !== null ? (device !== '' ? device + ' - ' + problem : problem) : text;

  const statusCode = readString(record, 'estado') ?? '';
  const status = STATUS[statusCode];

  return {
    id,
    title: appliance !== null ? 'Reparacion de ' + appliance : 'Solicitud #' + id,
    description,
    statusCode,
    statusLabel: status?.label ?? 'En proceso',
    tone: status?.tone ?? 'warning',
  };
}

/** GET /solicitudes/mis-solicitudes (las mas recientes primero) */
export async function fetchMyRequests(signal: AbortSignal): Promise<RequestSummary[]> {
  const datos = unwrapDatos(await request('/solicitudes/mis-solicitudes', { signal }));
  if (!Array.isArray(datos)) {
    throw new ApiError('invalid-response', 'La lista de solicitudes no tiene el formato esperado.');
  }

  const list: RequestSummary[] = [];
  for (const item of datos) {
    if (!isRecord(item)) continue;
    const summary = toSummary(item);
    if (summary !== null) list.push(summary);
  }
  return list.sort((a, b) => b.id - a.id);
}
import { request, isRecord } from '../../core/api/apiClient';
import { ApiError } from '../../core/api/ApiError';
import { readNumber, readString, unwrapDatos } from '../../core/api/envelope';

export type ApplicationStatus = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO';

export interface Application {
  id: number;
  especialidad: string;
  aniosExperiencia: number | null;
  estado: ApplicationStatus;
  motivoRechazo: string | null;
}

export interface ApplicationInput {
  especialidad: string;
  aniosExperiencia: number;
  cvUrl: string;
  certificadosUrl: string;
  dniDocumentoUrl: string;
}

function parseStatus(value: string | null): ApplicationStatus {
  if (value === 'PENDIENTE' || value === 'ACEPTADO' || value === 'RECHAZADO') return value;
  throw new ApiError('invalid-response', 'Estado de postulación desconocido.');
}

function parseApplication(raw: unknown): Application {
  if (!isRecord(raw)) throw new ApiError('invalid-response', 'Postulación sin el formato esperado.');
  const id = readNumber(raw, 'idPostulacion');
  if (id === null) throw new ApiError('invalid-response', 'Postulación sin identificador.');
  return {
    id,
    especialidad: readString(raw, 'especialidadDeclarada') ?? '',
    aniosExperiencia: readNumber(raw, 'aniosExperiencia'),
    estado: parseStatus(readString(raw, 'estado')),
    motivoRechazo: readString(raw, 'motivoRechazo'),
  };
}

/** GET /postulaciones/mis-postulaciones */
export async function fetchMyApplications(signal: AbortSignal): Promise<Application[]> {
  const datos = unwrapDatos(await request('/postulaciones/mis-postulaciones', { signal }));
  if (!Array.isArray(datos)) throw new ApiError('invalid-response', 'Lista de postulaciones inválida.');
  return datos.map(parseApplication);
}

/** La más reciente (mayor id), o null si nunca postuló. */
export function latestApplication(list: readonly Application[]): Application | null {
  return list.reduce<Application | null>((latest, item) => (latest === null || item.id > latest.id ? item : latest), null);
}

/** POST /postulaciones/crear → PostulacionPeticion. No existe endpoint de subida de archivos: los documentos se envían como URL. */
export async function createApplication(input: ApplicationInput): Promise<Application> {
  const body: Record<string, string | number> = {
    especialidadDeclarada: input.especialidad,
    aniosExperiencia: input.aniosExperiencia,
    cvUrl: input.cvUrl,
  };
  if (input.certificadosUrl !== '') body.certificadosUrl = input.certificadosUrl;
  if (input.dniDocumentoUrl !== '') body.dniDocumentoUrl = input.dniDocumentoUrl;

  const datos = unwrapDatos(await request('/postulaciones/crear', { method: 'POST', body }));
  return parseApplication(datos);
}

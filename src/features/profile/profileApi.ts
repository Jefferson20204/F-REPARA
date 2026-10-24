import { request, isRecord } from '../../core/api/apiClient';
import { ApiError } from '../../core/api/ApiError';
import { readNumber, readString, unwrapDatos } from '../../core/api/envelope';

export interface Profile {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  esTecnico: boolean;
}

/** GET /usuarios/perfil → UsuarioRespuesta */
export async function fetchProfile(signal: AbortSignal): Promise<Profile> {
  const datos = unwrapDatos(await request('/usuarios/perfil', { signal }));
  if (!isRecord(datos)) throw new ApiError('invalid-response', 'Perfil sin el formato esperado.');

  const id = readNumber(datos, 'idUsuario');
  const correo = readString(datos, 'correo');
  if (id === null || correo === null) throw new ApiError('invalid-response', 'Perfil incompleto.');

  return {
    id,
    correo,
    nombres: readString(datos, 'nombres') ?? '',
    apellidos: readString(datos, 'apellidos') ?? '',
    rol: readString(datos, 'rol') ?? '',
    esTecnico: datos.esTecnico === true,
  };
}

import { request, isRecord } from '../../core/api/apiClient';
import { ApiError } from '../../core/api/ApiError';
import { digitsOnly, type LoginForm, type RegisterForm } from './validation';

/*
 * ADAPTADOR DEL CONTRATO. Es el ÚNICO lugar con nombres de campos del backend.
 * Verificado contra openapi-repara.json (RegistroPeticion, LoginPeticion, LoginRespuesta).
 */

interface LoginRequest {
  correo: string;
  contrasena: string;
}

interface RegistroRequest {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string; // el backend exige mínimo 6; la UI exige 8 según el prototipo
  telefono: string;
  dni: string;
}

/**
 * El prototipo tiene un solo campo "Nombre completo", pero el backend exige nombres y apellidos.
 * Heurística: 2 palabras = 1 + 1; 3 = 1 + 2; 4 o más = las dos últimas son apellidos.
 */
export function splitFullName(fullName: string): { nombres: string; apellidos: string } {
  const words = fullName.trim().split(/\s+/);
  const apellidosCount = words.length >= 3 ? 2 : 1;
  return {
    nombres: words.slice(0, words.length - apellidosCount).join(' '),
    apellidos: words.slice(words.length - apellidosCount).join(' '),
  };
}

/** Devuelve el JWT. rol, idUsuario y esTecnico se leen de sus claims (ver jwt.ts). */
export async function login(form: LoginForm): Promise<string> {
  const body: LoginRequest = { correo: form.correo, contrasena: form.contrasena };
  const data = await request('/autenticacion/login', { method: 'POST', body, auth: false });

  // LoginRespuesta.datos.token, dentro del envoltorio { exito, mensaje, datos }.
  if (isRecord(data) && isRecord(data.datos) && typeof data.datos.token === 'string' && data.datos.token !== '') {
    return data.datos.token;
  }
  throw new ApiError('invalid-response', 'La respuesta de login no incluye el token.');
}

/** No devuelve sesión: el registro solo responde con el usuario creado. */
export async function register(form: RegisterForm): Promise<void> {
  const body: RegistroRequest = {
    ...splitFullName(form.nombre),
    correo: form.correo.trim(),
    telefono: digitsOnly(form.telefono),
    dni: form.documento.trim(),
    contrasena: form.contrasena,
  };
  await request('/autenticacion/registro', { method: 'POST', body, auth: false });
}

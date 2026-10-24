import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config';
import { authStorage } from '../storage/authStorage';
import { ApiError } from './ApiError';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: Method;
  body?: unknown;
  /** false para rutas públicas (login, registro): sin Bearer y sin logout global en 401. */
  auth?: boolean;
  signal?: AbortSignal;
}

type Listener = () => void;
const unauthorizedListeners = new Set<Listener>();

/** El AuthProvider se suscribe aquí para cerrar sesión ante un 401 en rutas protegidas. */
export function subscribeUnauthorized(listener: Listener): () => void {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'string' && payload.trim() !== '') return payload.trim();
  if (isRecord(payload)) {
    for (const key of ['mensaje', 'message', 'error']) {
      const value = payload[key];
      if (typeof value === 'string' && value.trim() !== '') return value.trim();
    }
  }
  return fallback;
}

function parseBody(text: string): unknown {
  if (text === '') return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/** Devuelve el cuerpo sin tipar: cada servicio valida lo que recibe. */
export async function request(path: string, options: RequestOptions = {}): Promise<unknown> {
  const { method = 'GET', body, auth = true, signal } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = authStorage.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort(), { once: true });

  let response: Response;
  let text: string;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    text = await response.text();
  } catch {
    throw timedOut
      ? new ApiError('timeout', 'Tiempo de espera agotado')
      : new ApiError('network', 'Sin conexión');
  } finally {
    clearTimeout(timer);
  }

  const payload = parseBody(text);
  if (response.ok) return payload;

  const { status } = response;
  if (status === 401) {
    if (auth) unauthorizedListeners.forEach((listener) => listener());
    throw new ApiError('unauthorized', 'No autorizado', status);
  }
  if (status === 403) throw new ApiError('forbidden', 'Acceso denegado', status);
  if (status >= 500) throw new ApiError('server', 'Error del servidor', status);
  throw new ApiError('client', extractMessage(payload, 'La solicitud no es válida.'), status);
}

import { isRecord } from '../../core/api/apiClient';

export interface SessionUser {
  id: number;
  rol: string;
  esTecnico: boolean;
}

export interface Session {
  token: string;
  user: SessionUser;
  /** Epoch en ms; null si el token no trae `exp`. */
  expiresAt: number | null;
}

function decodePayload(token: string): Record<string, unknown> | null {
  const part = token.split('.')[1];
  if (!part) return null;
  try {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const json: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return isRecord(json) ? json : null;
  } catch {
    return null;
  }
}

/** Normaliza "TÉCNICO", "tecnico", "ROLE_TECNICO"... a "TECNICO". */
export function normalizeRole(rol: string): string {
  return rol
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/^ROLE_/, '');
}

export function isTechnician(user: SessionUser): boolean {
  return user.esTecnico || normalizeRole(user.rol) === 'TECNICO';
}

export function isAdmin(user: SessionUser): boolean {
  return normalizeRole(user.rol) === 'ADMIN';
}

/**
 * Construye la sesión desde los claims documentados (idUsuario, rol, esTecnico).
 * Devuelve null si el token es ilegible, no trae esos claims o ya expiró.
 */
export function sessionFromToken(token: string): Session | null {
  const claims = decodePayload(token);
  if (!claims) return null;

  const id = Number(claims.idUsuario);
  if (!Number.isFinite(id) || typeof claims.rol !== 'string') return null;

  const expiresAt = typeof claims.exp === 'number' ? claims.exp * 1000 : null;
  if (expiresAt !== null && expiresAt <= Date.now()) return null;

  return {
    token,
    expiresAt,
    user: { id, rol: claims.rol, esTecnico: claims.esTecnico === true },
  };
}

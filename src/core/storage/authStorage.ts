/**
 * Persistencia mínima de sesión: SOLO el token y el modo actual.
 * localStorage no está cifrado: cualquier script en la WebView puede leerlo.
 * Es una decisión del proyecto (compatibilidad con Capacitor); si se endurece
 * más adelante, solo cambia este archivo.
 */
export type AppMode = 'client' | 'technician';

const TOKEN_KEY = 'repara.token';
const MODE_KEY = 'repara.currentMode';

export function isAppMode(value: unknown): value is AppMode {
  return value === 'client' || value === 'technician';
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Almacenamiento no disponible: la sesión vivirá solo en memoria.
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nada que limpiar.
  }
}

export const authStorage = {
  getToken: (): string | null => read(TOKEN_KEY),
  setToken: (token: string): void => write(TOKEN_KEY, token),
  getMode: (): AppMode | null => {
    const value = read(MODE_KEY);
    return isAppMode(value) ? value : null;
  },
  setMode: (mode: AppMode): void => write(MODE_KEY, mode),
  clearMode: (): void => remove(MODE_KEY),
  clear: (): void => {
    remove(TOKEN_KEY);
    remove(MODE_KEY);
  },
};

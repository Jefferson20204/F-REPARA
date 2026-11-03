/* Id de la solicitud en curso. sessionStorage para que sobreviva a una recarga de la pagina. */
const KEY = 'repara.activeRequestId';

export function getActiveRequestId(): number | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export function setActiveRequestId(id: number): void {
  try {
    sessionStorage.setItem(KEY, String(id));
  } catch {
    // Almacenamiento no disponible: no hay nada que hacer.
  }
}
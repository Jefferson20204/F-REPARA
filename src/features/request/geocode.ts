import { isRecord } from '../../core/api/apiClient';

export interface Point {
  lat: number;
  lng: number;
}

/** Busca una direccion con Nominatim (OpenStreetMap). Devuelve null si no la encuentra. */
export async function geocodeAddress(address: string, signal: AbortSignal): Promise<Point | null> {
  const query = encodeURIComponent(address + ', Lima');
  const url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pe&q=' + query;

  try {
    const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!response.ok) return null;

    const data: unknown = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const first: unknown = data[0];
    if (!isRecord(first)) return null;

    const lat = Number(first.lat);
    const lng = Number(first.lon);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  } catch {
    return null;
  }
}
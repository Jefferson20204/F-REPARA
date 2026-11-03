/* Datos de ejemplo hasta que el back exponga el tecnico asignado y su ubicacion. */
export const SAMPLE_TECHNICIAN = {
  name: 'Miguel Torres',
  role: 'Tecnico especialista',
  vehicle: 'Motocicleta Honda Gris - EP-4893',
  etaMinutes: 25,
};

export const SAMPLE_HOME = { lat: -12.1211, lng: -77.0297 };
export const SAMPLE_TECHNICIAN_POSITION = { lat: -12.1265, lng: -77.0345 };

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
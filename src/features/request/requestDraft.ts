export type Appliance =
  | 'Lavadora'
  | 'Refrigeradora'
  | 'Cocina'
  | 'Microondas'
  | 'Secadora'
  | 'Otros';

export const APPLIANCES: readonly Appliance[] = [
  'Lavadora',
  'Refrigeradora',
  'Cocina',
  'Microondas',
  'Secadora',
  'Otros',
];

/* Ids de la tabla categorias (seed de repara_db.sql). Secadora comparte categoria con Lavadoras. */
export const CATEGORY_ID: Record<Appliance, number> = {
  Lavadora: 2,
  Refrigeradora: 1,
  Cocina: 3,
  Microondas: 4,
  Secadora: 2,
  Otros: 7,
};

export interface RequestDraft {
  appliance: Appliance;
  brand: string;
  model: string;
  problem: string;
  photos: File[];
  address: string;
  /* Valor de datetime-local; vacio si no se eligio. */
  suggestedAt: string;
}

/* Borrador en memoria: lo comparten las pantallas de nueva solicitud, resumen y edicion. */
let current: RequestDraft | null = null;

export function getDraft(): RequestDraft | null {
  return current;
}

export function saveDraft(draft: RequestDraft): void {
  current = draft;
}

export function clearDraft(): void {
  current = null;
}
export const TRANSFER_FEE = 15;
export const DIAGNOSIS_FEE = 20;
export const INITIAL_TOTAL = TRANSFER_FEE + DIAGNOSIS_FEE;

/* Presupuesto de reparacion de ejemplo, hasta que el back lo exponga. */
export const REPAIR_PART_COST = 85;
export const REPAIR_LABOR_COST = 60;
export const REPAIR_TOTAL = REPAIR_PART_COST + REPAIR_LABOR_COST;

export function money(value: number): string {
  return 'S/ ' + value.toFixed(2);
}
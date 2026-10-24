import type { FieldErrors } from '../auth/validation';

export interface ApplicationForm {
  especialidad: string;
  anios: string;
  cvUrl: string;
  certificadosUrl: string;
  dniDocumentoUrl: string;
}
export type ApplicationField = keyof ApplicationForm;

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateApplication(form: ApplicationForm): FieldErrors<ApplicationField> {
  const errors: FieldErrors<ApplicationField> = {};
  if (form.especialidad.trim().length < 3) errors.especialidad = 'Indica tu especialidad (ej. Refrigeración).';
  if (!/^\d{1,2}$/.test(form.anios.trim())) errors.anios = 'Ingresa tus años de experiencia (0 a 99).';

  if (!isHttpUrl(form.cvUrl.trim())) errors.cvUrl = 'Ingresa un enlace válido a tu CV (https://…).';
  for (const field of ['certificadosUrl', 'dniDocumentoUrl'] as const) {
    const value = form[field].trim();
    if (value !== '' && !isHttpUrl(value)) errors[field] = 'Ingresa un enlace válido (https://…).';
  }
  return errors;
}

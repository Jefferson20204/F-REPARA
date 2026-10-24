export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export interface LoginForm {
  correo: string;
  contrasena: string;
}
export type LoginField = keyof LoginForm;

export interface RegisterForm {
  nombre: string;
  correo: string;
  telefono: string;
  documento: string;
  contrasena: string;
  confirmar: string;
}
export type RegisterField = keyof RegisterForm;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PE = /^9\d{8}$/;
const DOCUMENT = /^\d{8}$/;

export const digitsOnly = (value: string): string => value.replace(/\D/g, '');

export function validateLogin(form: LoginForm): FieldErrors<LoginField> {
  const errors: FieldErrors<LoginField> = {};
  if (!EMAIL.test(form.correo.trim())) errors.correo = 'Ingresa un correo válido.';
  if (form.contrasena === '') errors.contrasena = 'Ingresa tu contraseña.';
  return errors;
}

export function validateRegister(form: RegisterForm): FieldErrors<RegisterField> {
  const errors: FieldErrors<RegisterField> = {};
  if (form.nombre.trim().split(/\s+/).length < 2) errors.nombre = 'Ingresa tu nombre y apellido.';
  if (!EMAIL.test(form.correo.trim())) errors.correo = 'Ingresa un correo válido.';
  if (!PHONE_PE.test(digitsOnly(form.telefono))) {
    errors.telefono = 'Ingresa un celular de 9 dígitos que empiece con 9.';
  }
  if (!DOCUMENT.test(form.documento.trim())) {
    errors.documento = 'Ingresa un documento de 8 dígitos.';
  }
  if (form.contrasena.length < 8) errors.contrasena = 'Mínimo 8 caracteres.';
  if (form.confirmar !== form.contrasena) errors.confirmar = 'Las contraseñas no coinciden.';
  return errors;
}

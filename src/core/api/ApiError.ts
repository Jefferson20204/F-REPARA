export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'client'
  | 'server'
  | 'invalid-response';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;

  constructor(kind: ApiErrorKind, message: string, status: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

/** Mensaje en español apto para mostrar al usuario. */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'network':
        return 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.';
      case 'timeout':
        return 'El servidor tardó demasiado en responder. Inténtalo de nuevo.';
      case 'unauthorized':
        return 'Tu sesión expiró. Inicia sesión nuevamente.';
      case 'forbidden':
        return 'No tienes permisos para realizar esta acción.';
      case 'server':
        return 'El servidor tuvo un problema. Inténtalo en unos minutos.';
      case 'invalid-response':
        return 'Recibimos una respuesta inesperada del servidor.';
      case 'client':
        return error.message;
    }
  }
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}

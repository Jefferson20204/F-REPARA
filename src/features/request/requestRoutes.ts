/* Pantalla del flujo del cliente que corresponde a cada estado. null: aun no hay pantalla. */
export function routeForStatus(statusCode: string): string | null {
  switch (statusCode) {
    case 'ACEPTADA':
    case 'PAGO_INICIAL_PENDIENTE':
      return '/cliente/solicitud/tecnico-asignado';
    case 'EN_CAMINO':
    case 'EN_DIAGNOSTICO':
    case 'REPARACION_EN_PROCESO':
      return '/cliente/solicitud/seguimiento';
    default:
      return null;
  }
}
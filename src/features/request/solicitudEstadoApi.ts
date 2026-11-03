import { request } from '../../core/api/apiClient';
import { unwrapDatos } from '../../core/api/envelope';

/** POST /solicitudes/{id}/estado */
export async function changeRequestStatus(requestId: number, status: string): Promise<void> {
  unwrapDatos(
    await request('/solicitudes/' + requestId + '/estado', {
      method: 'POST',
      body: { estado: status },
    }),
  );
}
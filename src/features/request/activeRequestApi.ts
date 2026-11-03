import { ApiError } from '../../core/api/ApiError';
import { getActiveRequestId } from './activeRequest';
import { fetchMyRequests, type RequestSummary } from './solicitudesApi';

/** La solicitud en curso, con su estado real. */
export async function fetchActiveRequest(signal: AbortSignal): Promise<RequestSummary> {
  const id = getActiveRequestId();
  if (id === null) throw new ApiError('client', 'No hay una solicitud activa.');

  const list = await fetchMyRequests(signal);
  const found = list.find((item) => item.id === id);
  if (found === undefined) throw new ApiError('client', 'No se encontro la solicitud en curso.');
  return found;
}
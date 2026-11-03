import { request, isRecord } from '../../core/api/apiClient';
import { ApiError } from '../../core/api/ApiError';
import { readNumber, readString, unwrapDatos } from '../../core/api/envelope';

export interface ChatMessage {
  id: number;
  mine: boolean;
  text: string;
}

function toMessage(record: Record<string, unknown>, userId: number): ChatMessage | null {
  const id = readNumber(record, 'idMensaje');
  const text = readString(record, 'mensaje');
  if (id === null || text === null) return null;

  const nested = isRecord(record.emisor) ? readNumber(record.emisor, 'idUsuario') : null;
  const senderId = readNumber(record, 'idEmisor') ?? nested;
  return { id, mine: senderId === userId, text };
}

/** GET /chat/solicitud/{id} (de mas antiguo a mas reciente) */
export async function fetchChatMessages(
  requestId: number,
  userId: number,
  signal: AbortSignal,
): Promise<ChatMessage[]> {
  const datos = unwrapDatos(await request('/chat/solicitud/' + requestId, { signal }));
  if (!Array.isArray(datos)) {
    throw new ApiError('invalid-response', 'La lista de mensajes no tiene el formato esperado.');
  }

  const list: ChatMessage[] = [];
  for (const item of datos) {
    if (!isRecord(item)) continue;
    const message = toMessage(item, userId);
    if (message !== null) list.push(message);
  }
  return list.sort((a, b) => a.id - b.id);
}

/** POST /chat/enviar */
export async function sendChatMessage(requestId: number, text: string): Promise<void> {
  unwrapDatos(
    await request('/chat/enviar', {
      method: 'POST',
      body: { idSolicitud: requestId, mensaje: text, tipoMensaje: 'TEXTO' },
    }),
  );
}

/** POST /chat/solicitud/{id}/marcar-leidos */
export async function markChatRead(requestId: number): Promise<void> {
  unwrapDatos(await request('/chat/solicitud/' + requestId + '/marcar-leidos', { method: 'POST' }));
}
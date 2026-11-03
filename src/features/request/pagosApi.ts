import { request, isRecord } from '../../core/api/apiClient';
import { ApiError } from '../../core/api/ApiError';
import { readNumber, readString, unwrapDatos } from '../../core/api/envelope';

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
}

export interface PaymentReceipt {
  reference: string | null;
  paidAt: string | null;
  amount: number | null;
}

/* Lo que la pantalla de metodo de pago le pasa a la de pago confirmado. */
export interface PaymentResultState {
  methodTitle: string;
  receipt: PaymentReceipt;
}

/** GET /pagos/metodos */
export async function fetchPaymentMethods(signal: AbortSignal): Promise<PaymentMethod[]> {
  const datos = unwrapDatos(await request('/pagos/metodos', { signal }));
  if (!Array.isArray(datos)) {
    throw new ApiError('invalid-response', 'La lista de metodos de pago no tiene el formato esperado.');
  }

  const methods: PaymentMethod[] = [];
  for (const item of datos) {
    if (!isRecord(item)) continue;
    const id = readNumber(item, 'idMetodo') ?? readNumber(item, 'idMetodoPago') ?? readNumber(item, 'id');
    const name = readString(item, 'nombre');
    if (id === null || name === null) continue;
    methods.push({ id, name, description: readString(item, 'descripcion') ?? '' });
  }
  return methods;
}

async function pay(path: string, methodId: number): Promise<PaymentReceipt> {
  const datos = unwrapDatos(await request(path, { method: 'POST', body: { idMetodoPago: methodId } }));
  const record = isRecord(datos) ? datos : {};
  return {
    reference: readString(record, 'referenciaTransaccion'),
    paidAt: readString(record, 'fechaPago'),
    amount: readNumber(record, 'monto'),
  };
}

/** POST /pagos/inicial/{idSolicitud} */
export function payInitial(requestId: number, methodId: number): Promise<PaymentReceipt> {
  return pay('/pagos/inicial/' + requestId, methodId);
}

/** POST /pagos/final/{idSolicitud} */
export function payFinal(requestId: number, methodId: number): Promise<PaymentReceipt> {
  return pay('/pagos/final/' + requestId, methodId);
}
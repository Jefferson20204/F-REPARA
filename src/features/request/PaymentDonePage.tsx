import { useLocation, useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { isRecord } from '../../core/api/apiClient';
import type { PaymentResultState } from './pagosApi';
import { INITIAL_TOTAL, money } from './pricing';
import '../../styles/paymentDone.css';

function readResult(state: unknown): PaymentResultState | null {
  if (!isRecord(state) || typeof state.methodTitle !== 'string' || !isRecord(state.receipt)) return null;
  const receipt = state.receipt;
  return {
    methodTitle: state.methodTitle,
    receipt: {
      reference: typeof receipt.reference === 'string' ? receipt.reference : null,
      paidAt: typeof receipt.paidAt === 'string' ? receipt.paidAt : null,
      amount: typeof receipt.amount === 'number' ? receipt.amount : null,
    },
  };
}

function formatPaidAt(value: string | null): string {
  if (value === null) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function PaymentDonePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = readResult(location.state);

  const amount = result?.receipt.amount ?? INITIAL_TOTAL;
  const method = result?.methodTitle ?? '-';
  const reference = result?.receipt.reference ?? null;
  const paidAt = formatPaidAt(result?.receipt.paidAt ?? null);

  return (
    <div className="screen">
      <main className="screen__main pd-main">
        <div className="pd-halo">
          <div className="pd-core">
            <Check size={30} />
          </div>
        </div>

        <h1 className="pd-title">Pago confirmado!</h1>
        <p className="pd-text">El traslado ya esta financiado y asegurado.</p>

        <section className="pd-card">
          <p className="pd-card__label">RESUMEN DE COMPROBANTE</p>
          <div className="pd-row">
            <span>Monto pagado</span>
            <span className="pd-amount">{money(amount)}</span>
          </div>
          <div className="pd-row">
            <span>Metodo de pago</span>
            <span className="pd-value">{method}</span>
          </div>
          <div className="pd-row">
            <span>Codigo de referencia</span>
            <span className="pd-value">{reference !== null ? '#' + reference : '-'}</span>
          </div>
          <div className="pd-row">
            <span>Fecha y hora</span>
            <span className="pd-value">{paidAt}</span>
          </div>
        </section>
      </main>

      <div className="pd-actions">
        <button
          type="button"
          className="btn btn--client"
          onClick={() => void navigate('/cliente/solicitud/seguimiento')}
        >
          Ver seguimiento del tecnico
        </button>
      </div>
    </div>
  );
}
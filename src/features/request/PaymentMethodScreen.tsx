import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { describeError } from '../../core/api/ApiError';
import { useResource } from '../../core/hooks/useResource';
import { getActiveRequestId } from './activeRequest';
import {
  fetchPaymentMethods,
  type PaymentMethod,
  type PaymentReceipt,
  type PaymentResultState,
} from './pagosApi';
import { money } from './pricing';
import '../../styles/paymentMethod.css';

interface MethodLook {
  title: string;
  subtitle: string;
  tone: 'yape' | 'plin' | 'card';
  letter: string;
}

function describeMethod(method: PaymentMethod): MethodLook {
  switch (method.name.toUpperCase()) {
    case 'YAPE':
      return { title: 'Yape', subtitle: 'Pago rapido instantaneo', tone: 'yape', letter: 'Y' };
    case 'PLIN':
      return { title: 'Plin', subtitle: 'Transferencia con celular', tone: 'plin', letter: 'P' };
    case 'TARJETA':
      return {
        title: 'Tarjeta de Credito / Debito',
        subtitle: 'Visa, Mastercard, Amex',
        tone: 'card',
        letter: 'T',
      };
    default:
      return {
        title: method.name,
        subtitle: method.description,
        tone: 'card',
        letter: method.name.charAt(0).toUpperCase(),
      };
  }
}

interface Props {
  title: string;
  subtitle: string;
  amount: number;
  pay: (requestId: number, methodId: number) => Promise<PaymentReceipt>;
  onPaid: (result: PaymentResultState) => void;
  showSupport?: boolean;
}

export function PaymentMethodScreen({ title, subtitle, amount, pay, onPaid, showSupport = false }: Props) {
  const navigate = useNavigate();
  const { state, reload } = useResource(fetchPaymentMethods);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = state.status === 'ready' ? state.data : [];
  const effectiveId = selectedId ?? methods[0]?.id ?? null;

  async function submit() {
    if (effectiveId === null || paying) return;

    const requestId = getActiveRequestId();
    if (requestId === null) {
      setError('No hay una solicitud activa. Crea una solicitud primero.');
      return;
    }

    const method = methods.find((item) => item.id === effectiveId);
    if (method === undefined) return;

    setPaying(true);
    setError(null);
    try {
      const receipt = await pay(requestId, effectiveId);
      onPaid({ methodTitle: describeMethod(method).title, receipt });
    } catch (caught) {
      setError(describeError(caught));
      setPaying(false);
    }
  }

  return (
    <div className="screen">
      <header className="screen-header pm-header">
        <button
          type="button"
          className="screen-header__back"
          aria-label="Volver"
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="screen-header__title">{title}</h1>
      </header>
      <p className="pm-subtitle">{subtitle}</p>

      {state.status === 'loading' && <p className="muted">Cargando metodos de pago...</p>}

      {state.status === 'error' && (
        <div className="alert alert--error" role="alert">
          <p>{state.message}</p>
          <button type="button" className="btn btn--outline" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      {state.status === 'ready' && methods.length === 0 && (
        <p className="muted">No hay metodos de pago disponibles.</p>
      )}

      <div className="pm-list" role="radiogroup" aria-label="Metodo de pago">
        {methods.map((method) => {
          const look = describeMethod(method);
          const selected = method.id === effectiveId;
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={selected ? 'pm-option pm-option--on' : 'pm-option'}
              onClick={() => setSelectedId(method.id)}
            >
              <span className={'pm-badge pm-badge--' + look.tone}>
                {look.tone === 'card' ? <CreditCard size={20} /> : look.letter}
              </span>
              <span className="pm-text">
                <span className="pm-title">{look.title}</span>
                <span className="pm-sub">{look.subtitle}</span>
              </span>
              <span className="pm-radio" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="pm-actions">
        {error !== null && (
          <div className="alert alert--error" role="alert">
            <p>{error}</p>
          </div>
        )}
        <button
          type="button"
          className="btn btn--client"
          disabled={effectiveId === null || paying}
          onClick={() => void submit()}
        >
          {paying ? 'Procesando...' : 'Pagar ' + money(amount)}
        </button>
        {showSupport && (
          /* Sin pantalla de soporte todavia. */
          <button type="button" className="btn btn--outline" disabled>
            Soporte tecnico
          </button>
        )}
      </div>
    </div>
  );
}
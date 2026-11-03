import { useNavigate } from 'react-router';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import { StepTracker } from './StepTracker';
import { DIAGNOSIS_FEE, INITIAL_TOTAL, TRANSFER_FEE, money } from './pricing';
import '../../styles/payment.css';

export default function PaymentChargePage() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <header className="screen-header pay-header">
        <button
          type="button"
          className="screen-header__back"
          aria-label="Volver"
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="screen-header__title">Pago de traslado + diagnostico</h1>
      </header>
      <p className="pay-subtitle">Autoriza el envio del tecnico a tu hogar</p>

      <StepTracker current={1} />

      <section className="pay-card">
        <p className="pay-card__label">DETALLE DEL COBRO INICIAL</p>
        <div className="pay-row">
          <span>Traslado a domicilio</span>
          <span>{money(TRANSFER_FEE)}</span>
        </div>
        <div className="pay-row">
          <span>Diagnostico tecnico inicial</span>
          <span>{money(DIAGNOSIS_FEE)}</span>
        </div>
        <div className="pay-total">
          <span>Total a pagar</span>
          <span className="pay-total__amount">{money(INITIAL_TOTAL)}</span>
        </div>
      </section>

      <div className="pay-note" role="note">
        <CircleAlert size={18} />
        <p>
          Este pago cubre la llegada del especialista y el diagnostico. El costo de repuestos y mano
          de obra se cotizara despues de la inspeccion.
        </p>
      </div>

      <div className="pay-actions">
        <button
          type="button"
          className="btn btn--client"
          onClick={() => void navigate('/cliente/solicitud/metodo-pago')}
        >
          Seleccionar metodo de pago
        </button>
      </div>
    </div>
  );
}
import { useNavigate } from 'react-router';
import { payFinal } from './pagosApi';
import { PaymentMethodScreen } from './PaymentMethodScreen';
import { REPAIR_TOTAL, money } from './pricing';

export default function RepairPaymentPage() {
  const navigate = useNavigate();

  return (
    <PaymentMethodScreen
      title="Pago de reparacion"
      subtitle={'Monto total a pagar: ' + money(REPAIR_TOTAL)}
      amount={REPAIR_TOTAL}
      pay={payFinal}
      onPaid={() => void navigate('/cliente/solicitud/reparacion-completa', { replace: true })}
      showSupport
    />
  );
}
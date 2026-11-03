import { useNavigate } from 'react-router';
import { payInitial } from './pagosApi';
import { PaymentMethodScreen } from './PaymentMethodScreen';
import { INITIAL_TOTAL, money } from './pricing';

export default function PaymentMethodPage() {
  const navigate = useNavigate();

  return (
    <PaymentMethodScreen
      title="Metodo de pago"
      subtitle={'Monto a pagar: ' + money(INITIAL_TOTAL)}
      amount={INITIAL_TOTAL}
      pay={payInitial}
      onPaid={(result) =>
        void navigate('/cliente/solicitud/pago-confirmado', { replace: true, state: result })
      }
    />
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar } from 'lucide-react';
import { describeError } from '../../core/api/ApiError';
import { useResource } from '../../core/hooks/useResource';
import { getActiveRequestId } from './activeRequest';
import { fetchActiveRequest } from './activeRequestApi';
import { REPAIR_LABOR_COST, REPAIR_PART_COST, REPAIR_TOTAL, money } from './pricing';
import { changeRequestStatus } from './solicitudEstadoApi';
import '../../styles/diagnosis.css';

/* Datos de ejemplo: el diagnostico lo registra el tecnico (informes_tecnico) y el back aun no lo expone. */
const SAMPLE_PROBLEM = 'Motor de bomba de agua danado';
const SAMPLE_DETAIL =
  'Se requiere reemplazo completo del componente para reestablecer el ciclo de centrifugado y eliminar ruidos metalicos.';
const SAMPLE_PART = 'Bomba original';
const SAMPLE_ESTIMATE = '1-2 horas';

/* Titulo "Reparacion de Lavadora" -> "lavadora". */
function applianceWord(title: string): string {
  const prefix = 'Reparacion de ';
  return title.startsWith(prefix) ? title.slice(prefix.length).toLowerCase() : 'electrodomestico';
}

export default function DiagnosisPage() {
  const navigate = useNavigate();
  const { state } = useResource(fetchActiveRequest);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appliance = state.status === 'ready' ? applianceWord(state.data.title) : 'electrodomestico';

  async function cancelRequest() {
    const id = getActiveRequestId();
    if (id === null) {
      setError('No hay una solicitud activa.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await changeRequestStatus(id, 'CANCELADO');
      void navigate('/cliente', { replace: true });
    } catch (caught) {
      setError(describeError(caught));
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <header className="screen-header dg-header">
        <button
          type="button"
          className="screen-header__back"
          aria-label="Volver"
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="screen-header__title">Diagnostico tecnico</h1>
      </header>
      <p className="dg-subtitle">{'Resultados de la inspeccion de tu ' + appliance}</p>

      <section className="dg-card">
        <p className="dg-label">PROBLEMA DETECTADO</p>
        <p className="dg-problem">{SAMPLE_PROBLEM}</p>
        <p className="dg-detail">{SAMPLE_DETAIL}</p>
      </section>

      <section className="dg-card">
        <p className="dg-label">PRESUPUESTO ESTIMADO</p>
        <div className="dg-row">
          <span>{'Repuesto (' + SAMPLE_PART + ')'}</span>
          <span>{money(REPAIR_PART_COST)}</span>
        </div>
        <div className="dg-row">
          <span>Mano de obra certificada</span>
          <span>{money(REPAIR_LABOR_COST)}</span>
        </div>
        <div className="dg-total">
          <span>Total reparacion</span>
          <span className="dg-total__amount">{money(REPAIR_TOTAL)}</span>
        </div>
      </section>

      <div className="dg-note" role="note">
        <Calendar size={16} />
        <span>{'Tiempo de reparacion estimado: ' + SAMPLE_ESTIMATE}</span>
      </div>

      <div className="dg-actions">
        {error !== null && (
          <div className="alert alert--error" role="alert">
            <p>{error}</p>
          </div>
        )}

        {!confirming ? (
          <>
            <button
              type="button"
              className="btn btn--client"
              onClick={() => void navigate('/cliente/solicitud/pago-reparacion')}
            >
              Aceptar reparacion
            </button>
            {/* El back no tiene agenda todavia. */}
            <button type="button" className="btn btn--outline" disabled>
              Agendar para otro dia
            </button>
            <button type="button" className="dg-reject" onClick={() => setConfirming(true)}>
              Rechazar y cancelar
            </button>
          </>
        ) : (
          <>
            <p className="dg-confirm">Seguro que deseas cancelar la solicitud? Esta accion no se puede deshacer.</p>
            <button
              type="button"
              className="btn btn--danger"
              disabled={busy}
              onClick={() => void cancelRequest()}
            >
              {busy ? 'Cancelando...' : 'Si, cancelar solicitud'}
            </button>
            <button
              type="button"
              className="btn btn--outline"
              disabled={busy}
              onClick={() => setConfirming(false)}
            >
              Volver
            </button>
          </>
        )}
      </div>
    </div>
  );
}
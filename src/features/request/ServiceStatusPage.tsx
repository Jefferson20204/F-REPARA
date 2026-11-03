import { useNavigate } from 'react-router';
import { ArrowLeft, Check, ShieldCheck, Star } from 'lucide-react';
import { useResource } from '../../core/hooks/useResource';
import { fetchActiveRequest } from './activeRequestApi';
import { StepTracker } from './StepTracker';
import { SAMPLE_TECHNICIAN, initials } from './technicianSample';
import '../../styles/serviceStatus.css';

/* Datos de ejemplo hasta que el back exponga avance y tiempos del servicio. */
const SAMPLE_RATING = 4.8;
const SAMPLE_DIAGNOSIS_ETA = 'Tiempo estimado restante: 15-30 minutos.';
const SAMPLE_REPAIR_PROGRESS = 55;
const SAMPLE_REPAIR_ETA = 'Faltan ~40 min';

const BASE_DONE = ['Solicitud creada', 'Tecnico asignado', 'Tecnico en camino', 'Tecnico llego'];

type Phase = 'diagnosis' | 'repair';

function phaseFor(statusCode: string): Phase {
  return statusCode === 'REPARACION_EN_PROCESO' || statusCode === 'PAGO_FINAL_PENDIENTE'
    ? 'repair'
    : 'diagnosis';
}

/* Titulo "Reparacion de Lavadora" -> "lavadora". */
function applianceWord(title: string): string {
  const prefix = 'Reparacion de ';
  return title.startsWith(prefix) ? title.slice(prefix.length).toLowerCase() : 'electrodomestico';
}

export default function ServiceStatusPage() {
  const navigate = useNavigate();
  const { state, reload } = useResource(fetchActiveRequest);
  const tech = SAMPLE_TECHNICIAN;
  const firstName = tech.name.split(/\s+/)[0] ?? tech.name;

  const request = state.status === 'ready' ? state.data : null;
  const phase = request !== null ? phaseFor(request.statusCode) : 'diagnosis';
  const appliance = request !== null ? applianceWord(request.title) : 'electrodomestico';

  const done = phase === 'repair' ? [...BASE_DONE, 'En diagnostico'] : BASE_DONE;
  const current = phase === 'repair' ? 'En reparacion (Activo)' : 'En diagnostico (Revisando...)';

  return (
    <div className="screen">
      <header className="screen-header ss-header">
        <button
          type="button"
          className="screen-header__back"
          aria-label="Volver"
          onClick={() => void navigate('/cliente')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="screen-header__title">Estado del servicio</h1>
      </header>
      <p className="ss-subtitle">Seguimiento en tiempo real de tu reparacion</p>

      <StepTracker current={phase === 'repair' ? 4 : 3} />

      {state.status === 'error' && (
        <div className="alert alert--error" role="alert">
          <p>{state.message}</p>
          <button type="button" className="btn btn--outline" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      <section className="ss-card">
        <p className="ss-card__label">PROGRESO DEL SERVICIO</p>
        <ul className="ss-list">
          {done.map((label) => (
            <li key={label} className="ss-item">
              <Check size={16} className="ss-check" />
              <span>{label}</span>
            </li>
          ))}
          <li className="ss-item ss-item--now">
            <span className="ss-dot" />
            <strong>{current}</strong>
          </li>
        </ul>
      </section>

      <section className="ss-tech">
        <div className="ss-avatar" aria-hidden="true">{initials(tech.name)}</div>
        <div>
          <p className="ss-name">
            <span>{tech.name}</span>
            <ShieldCheck size={15} className="ss-verified" />
          </p>
          <p className="ss-meta">
            <span className="ss-rating">
              <Star size={11} />
              {SAMPLE_RATING.toFixed(1)}
            </span>
            <span>Tecnico asignado</span>
          </p>
        </div>
      </section>

      <section className="ss-info">
        {phase === 'diagnosis' ? (
          <>
            <p className="ss-info__title">
              <span className="ss-info__dot" />
              {firstName + ' esta revisando tu ' + appliance}
            </p>
            <p className="ss-info__text">{SAMPLE_DIAGNOSIS_ETA}</p>
          </>
        ) : (
          <>
            <p className="ss-info__title">
              <span className="ss-info__dot" />
              {firstName + ' esta reparando tu ' + appliance}
            </p>
            <div
              className="ss-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={SAMPLE_REPAIR_PROGRESS}
            >
              <div className="ss-bar__fill" style={{ width: SAMPLE_REPAIR_PROGRESS + '%' }} />
            </div>
            <p className="ss-info__row">
              <span>{'Progreso de ensamble: ' + SAMPLE_REPAIR_PROGRESS + '%'}</span>
              <span>{SAMPLE_REPAIR_ETA}</span>
            </p>
          </>
        )}
      </section>

      <div className="ss-actions">
        {/* Sin pantalla de soporte todavia. */}
        <button type="button" className="btn btn--outline" disabled>
          Soporte tecnico
        </button>
      </div>
    </div>
  );
}
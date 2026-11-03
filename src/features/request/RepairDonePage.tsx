import { useNavigate } from 'react-router';
import { CircleCheck, ShieldCheck, WashingMachine } from 'lucide-react';
import { useResource } from '../../core/hooks/useResource';
import { fetchActiveRequest } from './activeRequestApi';
import { SAMPLE_TECHNICIAN, initials } from './technicianSample';
import '../../styles/repairDone.css';

/* Datos de ejemplo: el informe del tecnico (informes_tecnico) aun no se expone en el back. */
const SAMPLE_WORK = 'Reemplazo de motor de bomba de agua';
const SAMPLE_DURATION = '1h 45min';
const WARRANTY_DAYS = 90;

function warrantyUntil(): string {
  const date = new Date();
  date.setDate(date.getDate() + WARRANTY_DAYS);
  return date.toLocaleDateString('es-PE', { dateStyle: 'long' });
}

/* "Reparacion de Lavadora" + "Samsung WA19T - falla..." -> "Lavadora Samsung WA19T". */
function deviceName(title: string, description: string): string {
  const prefix = 'Reparacion de ';
  const appliance = title.startsWith(prefix) ? title.slice(prefix.length) : 'Electrodomestico';
  const device = (description.split(' - ')[0] ?? '').trim();
  return device !== '' && device !== description ? appliance + ' ' + device : appliance;
}

export default function RepairDonePage() {
  const navigate = useNavigate();
  const { state } = useResource(fetchActiveRequest);
  const tech = SAMPLE_TECHNICIAN;

  const device =
    state.status === 'ready' ? deviceName(state.data.title, state.data.description) : 'Electrodomestico';

  return (
    <div className="screen">
      <main className="screen__main rd-main">
        <div className="rd-halo">
          <CircleCheck size={34} />
        </div>

        <h1 className="rd-title">Reparacion completada!</h1>
        <p className="rd-text">Tu electrodomestico ha quedado como nuevo gracias a nuestro experto.</p>

        <section className="rd-card">
          <p className="rd-label">DETALLE DEL SERVICIO</p>

          <p className="rd-small">Electrodomestico</p>
          <p className="rd-strong rd-device">
            <WashingMachine size={18} />
            <span>{device}</span>
          </p>

          <p className="rd-small rd-gap">Trabajo realizado</p>
          <p className="rd-strong">{SAMPLE_WORK}</p>

          <div className="rd-person">
            <div className="rd-avatar" aria-hidden="true">{initials(tech.name)}</div>
            <div className="rd-person__text">
              <p className="rd-person__name">{tech.name}</p>
              <p className="rd-person__role">Tecnico Especialista</p>
            </div>
            <span className="rd-chip">{SAMPLE_DURATION}</span>
          </div>
        </section>

        <section className="rd-warranty">
          <ShieldCheck size={22} className="rd-warranty__icon" />
          <div>
            <p className="rd-warranty__title">{'Garantia de ' + WARRANTY_DAYS + ' dias activa'}</p>
            <p className="rd-warranty__text">
              {'Esta reparacion esta respaldada frente a fallas del mismo componente. Valida hasta el ' +
                warrantyUntil() +
                '.'}
            </p>
          </div>
        </section>
      </main>

      <div className="rd-actions">
        <button
          type="button"
          className="btn btn--client"
          onClick={() => void navigate('/cliente/solicitud/calificar')}
        >
          Finalizar servicio
        </button>
      </div>
    </div>
  );
}
import { useNavigate } from 'react-router';
import { useResource } from '../../core/hooks/useResource';
import { fetchActivePin } from './pinApi';
import { SAMPLE_TECHNICIAN, initials } from './technicianSample';
import '../../styles/arrival.css';

export default function ArrivalPage() {
  const navigate = useNavigate();
  const { state } = useResource(fetchActivePin);
  const tech = SAMPLE_TECHNICIAN;
  const firstName = tech.name.split(/\s+/)[0] ?? tech.name;
  const pinText = state.status === 'ready' ? state.data : state.status === 'loading' ? '....' : '----';

  return (
    <div className="screen">
      <main className="screen__main ar-main">
        <div className="ar-ring">
          <div className="ar-avatar" aria-hidden="true">{initials(tech.name)}</div>
        </div>

        <h1 className="ar-title">Tu tecnico ha llegado!</h1>
        <p className="ar-text">{tech.name + ' esta afuera de tu domicilio listo para iniciar la revision.'}</p>

        <section className="ar-card">
          <p className="ar-card__label">{'Comparte tu PIN de confirmacion con ' + firstName}</p>
          <p className="ar-pin">{pinText}</p>
          {state.status === 'error' && <p className="ar-error">{state.message}</p>}
          <p className="ar-note">
            Este PIN valida la identidad del tecnico y autoriza el inicio del diagnostico.
          </p>
        </section>
      </main>

      <div className="ar-actions">
        <button
          type="button"
          className="btn btn--client"
          onClick={() => void navigate('/cliente/solicitud/estado')}
        >
          Comenzar diagnostico
        </button>
      </div>
    </div>
  );
}
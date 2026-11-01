import { ArrowRight, Bell, Droplets, Search, WashingMachine, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useResource } from '../../core/hooks/useResource';
import { fetchMyRequests } from '../request/solicitudesApi';
import '../../styles/clientHome.css';

const MAX_RECENT = 3;

export function ClientHomeView({ firstName }: { firstName: string }) {
  const navigate = useNavigate();
  const { state, reload } = useResource(fetchMyRequests);
  const greeting = firstName ? 'Hola, ' + firstName + ' \u{1F44B}' : 'Hola \u{1F44B}';

  return (
    <div className="ch">
      <header className="ch-header">
        <div>
          <h1 className="ch-greeting">{greeting}</h1>
          <p className="ch-subtitle">Que servicios necesitas hoy?</p>
        </div>
        <button type="button" className="ch-bell" aria-label="Notificaciones">
          <Bell size={20} />
        </button>
      </header>

      <div className="ch-search">
        <Search size={20} className="ch-search__icon" />
        <input
          type="search"
          className="ch-search__input"
          placeholder="Buscar tecnico, especialidad..."
          aria-label="Buscar tecnico o especialidad"
        />
      </div>

      <h2 className="ch-section-title">Especialidades</h2>
      <div className="ch-list">
        <button
          type="button"
          className="ch-spec ch-spec--active"
          onClick={() => void navigate('/cliente/solicitud/nueva')}
        >
          <span className="ch-spec__icon">
            <WashingMachine size={24} />
          </span>
          <span className="ch-spec__text">
            <span className="ch-spec__title">Electrodomesticos</span>
            <span className="ch-spec__desc">Lavadoras, refrigeradoras, etc.</span>
          </span>
          <ArrowRight size={20} />
        </button>

        <button type="button" className="ch-spec" disabled>
          <span className="ch-spec__icon">
            <Droplets size={24} />
          </span>
          <span className="ch-spec__text">
            <span className="ch-spec__title">Plomeria y Gas</span>
            <span className="ch-spec__desc">Tuberias, griferia, fugas</span>
          </span>
          <span className="ch-badge">Proximamente</span>
        </button>

        <button type="button" className="ch-spec" disabled>
          <span className="ch-spec__icon">
            <Zap size={24} />
          </span>
          <span className="ch-spec__text">
            <span className="ch-spec__title">Electricidad</span>
            <span className="ch-spec__desc">Cortocircuitos, llaves, cableado</span>
          </span>
          <span className="ch-badge">Proximamente</span>
        </button>
      </div>

      <h2 className="ch-section-title">Solicitudes recientes</h2>
      <div className="ch-list">
        {state.status === 'loading' && <p className="ch-state">Cargando solicitudes...</p>}

        {state.status === 'error' && (
          <div className="alert alert--error" role="alert">
            <p>{state.message}</p>
            <button type="button" className="btn btn--outline" onClick={reload}>
              Reintentar
            </button>
          </div>
        )}

        {state.status === 'ready' && state.data.length === 0 && (
          <p className="ch-state">Aun no tienes solicitudes.</p>
        )}

        {state.status === 'ready' &&
          state.data.slice(0, MAX_RECENT).map((item) => (
            <article key={item.id} className="ch-request">
              <div className="ch-request__top">
                <WashingMachine size={20} className="ch-request__icon" />
                <span className="ch-request__title">{item.title}</span>
                <span className={'chip chip--' + item.tone}>{item.statusLabel}</span>
              </div>
              <p className="ch-request__desc">{item.description}</p>
            </article>
          ))}
      </div>
    </div>
  );
}
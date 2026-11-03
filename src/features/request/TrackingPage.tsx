import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { describeError } from '../../core/api/ApiError';
import { useResource } from '../../core/hooks/useResource';
import type { Point } from './geocode';
import { fetchActiveRequestLocation } from './locationApi';
import { fetchActivePin, generatePin } from './pinApi';
import { StepTracker } from './StepTracker';
import { SAMPLE_TECHNICIAN, initials } from './technicianSample';
import { TrackingMap } from './TrackingMap';
import '../../styles/tracking.css';

/* Posicion de ejemplo del tecnico, a unos 800 m de la direccion, hasta que el back exponga su ubicacion. */
function sampleTechnicianPosition(home: Point): Point {
  return { lat: home.lat - 0.006, lng: home.lng - 0.005 };
}

export default function TrackingPage() {
  const navigate = useNavigate();
  const { state, reload } = useResource(fetchActivePin);
  const placeResource = useResource(fetchActiveRequestLocation);
  const placeState = placeResource.state;
  const [generating, setGenerating] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const tech = SAMPLE_TECHNICIAN;

  const home = placeState.status === 'ready' ? placeState.data.point : null;

  async function createPin() {
    setGenerating(true);
    setPinError(null);
    try {
      await generatePin();
      reload();
    } catch (caught) {
      setPinError(describeError(caught));
    } finally {
      setGenerating(false);
    }
  }

  const pinText = state.status === 'ready' ? state.data : state.status === 'loading' ? '....' : '----';

  const mapMessage =
    placeState.status === 'loading'
      ? 'Cargando mapa...'
      : placeState.status === 'error'
        ? placeState.message
        : 'No pudimos ubicar tu direccion en el mapa.';

  return (
    <div className="screen">
      <header className="screen-header tk-header">
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
      <p className="tk-subtitle">Seguimiento en tiempo real de tu reparacion</p>

      <StepTracker current={2} />

      <div className="tk-mapwrap">
        {home !== null ? (
          <TrackingMap home={home} technician={sampleTechnicianPosition(home)} />
        ) : (
          <div className="tk-map-empty">{mapMessage}</div>
        )}
        <div className="tk-banner">
          <span className="tk-banner__dot" />
          <span>{tech.name + ' esta en camino'}</span>
        </div>
      </div>

      <section className="tk-sheet">
        <div className="tk-person">
          <div className="tk-avatar" aria-hidden="true">{initials(tech.name)}</div>
          <div className="tk-person__text">
            <p className="tk-name">{tech.name}</p>
            <p className="tk-vehicle">{tech.vehicle}</p>
          </div>
          <div className="tk-eta">
            <span className="tk-eta__value">{'~' + tech.etaMinutes + ' min'}</span>
            <span className="tk-eta__label">hora de llegada</span>
          </div>
        </div>

        <div className="tk-pin">
          <p className="tk-pin__code">{pinText}</p>
          <p className="tk-pin__label">PIN de confirmacion</p>
          <p className="tk-pin__hint">Compartelo cuando llegue el tecnico</p>
          {state.status === 'error' && (
            <button
              type="button"
              className="link tk-pin__generate"
              disabled={generating}
              onClick={() => void createPin()}
            >
              {generating ? 'Generando...' : 'Generar PIN'}
            </button>
          )}
          {state.status === 'error' && <p className="tk-pin__error">{pinError ?? state.message}</p>}
        </div>

        <div className="tk-actions">
          <button
            type="button"
            className="btn tk-soft"
            onClick={() => void navigate('/cliente/solicitud/chat')}
          >
            Enviar mensaje
          </button>
          {/* Sin telefono del tecnico en el back todavia. */}
          <button type="button" className="btn btn--client" disabled>
            Llamar tecnico
          </button>
        </div>
      </section>
    </div>
  );
}
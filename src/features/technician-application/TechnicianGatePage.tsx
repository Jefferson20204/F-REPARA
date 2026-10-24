import { Navigate, useLocation, useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { useResource } from '../../core/hooks/useResource';
import { useAuth } from '../auth/useAuth';
import { fetchMyApplications, latestApplication, type Application } from './applicationApi';
import { ReviewIllustration } from './ReviewIllustration';

function wasJustSubmitted(state: unknown): boolean {
  return typeof state === 'object' && state !== null && 'justSubmitted' in state;
}

export default function TechnicianGatePage() {
  const { isTechnician, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, reload } = useResource(fetchMyApplications);

  // Ya es técnico: no necesita postular; el selector de modo permite entrar.
  if (isTechnician) return <Navigate to="/modo" replace />;

  const goClientHome = () => void navigate('/cliente');
  const latest: Application | null = state.status === 'ready' ? latestApplication(state.data) : null;

  return (
    <div className="screen">
      <ScreenHeader title="Trabaja con nosotros" onBack={() => void navigate('/cliente/perfil')} />

      {state.status === 'loading' && <p className="muted">Consultando tu postulación…</p>}

      {state.status === 'error' && (
        <div className="alert alert--error" role="alert">
          <p>{state.message}</p>
          <Button variant="outline" onClick={reload}>Reintentar</Button>
        </div>
      )}

      {state.status === 'ready' && latest?.estado === 'PENDIENTE' && (
        <div className="status-view">
          <ReviewIllustration />
          <h2 className="status-view__title">
            {wasJustSubmitted(location.state) ? '¡Recibimos tu postulación!' : 'Tu postulación está en evaluación'}
          </h2>
          <p className="status-view__text">
            Gracias por querer ser parte de RePara. Estamos revisando tu información con mucho cuidado. Cuando sea aprobada,
            vuelve a iniciar sesión y podrás elegir cómo ingresar.
          </p>
          <Button variant="client" onClick={goClientHome}>Volver al inicio</Button>
        </div>
      )}

      {state.status === 'ready' && latest?.estado === 'ACEPTADO' && (
        <div className="status-view">
          <ReviewIllustration tone="emerald" />
          <h2 className="status-view__title">¡Tu postulación fue aprobada!</h2>
          <p className="status-view__text">
            Para activar tu Modo Técnico, cierra sesión y vuelve a iniciar sesión.
          </p>
          <Button variant="technician" onClick={logout}>Cerrar sesión</Button>
          <Button variant="outline" onClick={goClientHome}>Volver al inicio</Button>
        </div>
      )}

      {state.status === 'ready' && (latest === null || latest.estado === 'RECHAZADO') && (
        <div className="status-view">
          <h2 className="status-view__title">Conviértete en técnico de RePara</h2>
          <p className="status-view__text">
            Postula con tu experiencia y recibe solicitudes de reparación de electrodomésticos en Lima. Revisaremos tu
            postulación antes de habilitar el Modo Técnico.
          </p>
          {latest?.estado === 'RECHAZADO' && (
            <div className="alert alert--error" role="status">
              Tu postulación anterior fue rechazada{latest.motivoRechazo ? `: ${latest.motivoRechazo}` : '.'} Puedes volver a postular.
            </div>
          )}
          <Button variant="client" onClick={() => void navigate('/cliente/tecnico/postular')}>Postular ahora</Button>
          <Button variant="outline" onClick={goClientHome}>Volver</Button>
        </div>
      )}
    </div>
  );
}

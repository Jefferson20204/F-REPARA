import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../auth/useAuth';
import { TechnicianModeRow } from '../technician-application/TechnicianModeRow';
import type { Profile } from './profileApi';
import { useProfile } from './useProfile';

function initialsOf(profile: Profile): string {
  const letters = `${profile.nombres.charAt(0)}${profile.apellidos.charAt(0)}`.trim();
  return (letters || profile.correo.charAt(0)).toUpperCase();
}

export default function ProfilePage() {
  const { mode, isTechnician, setMode, logout } = useAuth();
  const { state, reload } = useProfile();
  const navigate = useNavigate();

  function openTechnicianMode(): void {
    if (isTechnician) {
      setMode('technician');
      void navigate('/tecnico');
    } else {
      void navigate('/cliente/tecnico');
    }
  }

  function backToClientMode(): void {
    setMode('client');
    void navigate('/cliente');
  }

  return (
    <>
      {state.status === 'loading' && <p className="muted">Cargando perfil…</p>}

      {state.status === 'error' && (
        <div className="alert alert--error" role="alert">
          <p>{state.message}</p>
          <Button variant="outline" onClick={reload}>Reintentar</Button>
        </div>
      )}

      {state.status === 'ready' && (
        <div className="profile-header">
          <span className="avatar" aria-hidden="true">{initialsOf(state.data)}</span>
          <div>
            <h1 className="profile-header__name">{`${state.data.nombres} ${state.data.apellidos}`.trim()}</h1>
            <p className="profile-header__email">{state.data.correo}</p>
          </div>
        </div>
      )}

      <h2 className="section-label">{mode === 'technician' ? 'Modo de uso' : 'Trabaja con nosotros'}</h2>
      {mode === 'technician' ? (
        <Button variant="outline" onClick={backToClientMode}>Cambiar a Modo Cliente</Button>
      ) : (
        <div className="list-card">
          <TechnicianModeRow onToggle={openTechnicianMode} />
        </div>
      )}

      <div className="profile-logout">
        <Button variant="danger" onClick={logout}>Cerrar sesión</Button>
      </div>
    </>
  );
}

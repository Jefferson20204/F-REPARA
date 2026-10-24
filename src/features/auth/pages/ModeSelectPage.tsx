import { useNavigate } from 'react-router';
import { UserRound, Wrench } from 'lucide-react';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { Button } from '../../../components/ui/Button';
import type { AppMode } from '../../../core/storage/authStorage';
import { useAuth } from '../useAuth';

/* Pantalla sin captura en el prototipo: extiende tarjetas redondeadas y botones del sistema visual. */
export default function ModeSelectPage() {
  const { setMode, logout, isTechnician } = useAuth();
  const navigate = useNavigate();

  function choose(mode: AppMode) {
    setMode(mode);
    void navigate(mode === 'client' ? '/cliente' : '/tecnico', { replace: true });
  }

  return (
    <div className="screen">
      <main className="screen__main">
        <BrandLogo />
        <h1 className="screen__title">¿Cómo deseas ingresar hoy?</h1>

        <div className="mode-list">
          <Button variant="client" className="mode-card" onClick={() => choose('client')}>
            <span className="mode-card__icon"><UserRound size={22} /></span>
            <span>
              <div className="mode-card__title">Modo Cliente</div>
              <div className="mode-card__desc">Solicita y sigue tus reparaciones</div>
            </span>
          </Button>

          {isTechnician && (
            <Button variant="technician" className="mode-card" onClick={() => choose('technician')}>
              <span className="mode-card__icon"><Wrench size={22} /></span>
              <span>
                <div className="mode-card__title">Modo Técnico</div>
                <div className="mode-card__desc">Atiende solicitudes y gestiona tu disponibilidad</div>
              </span>
            </Button>
          )}
        </div>
      </main>

      <footer className="screen__footer">
        <Button variant="danger" onClick={logout}>Cerrar sesión</Button>
      </footer>
    </div>
  );
}

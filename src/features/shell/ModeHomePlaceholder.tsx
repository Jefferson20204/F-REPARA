import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../auth/useAuth';

/**
 * PLACEHOLDER de navegación: confirma sesión y modo. No muestra datos inventados.
 * Se reemplaza por Home (cliente) y panel de trabajo (técnico) en la Fase 3/4.
 */
export function ModeHomePlaceholder({ title }: { title: string }) {
  const { session, isTechnician, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="screen">
      <main className="screen__main">
        <div className="placeholder-card">
          <span className="placeholder-card__badge">{title}</span>
          <p>Sesión iniciada (usuario #{session?.user.id}). Esta pantalla se implementará en el siguiente incremento.</p>
        </div>
        <div className="stack">
          {isTechnician && (
            <Button variant="outline" onClick={() => void navigate('/modo')}>Cambiar de modo</Button>
          )}
          <Button variant="danger" onClick={logout}>Cerrar sesión</Button>
        </div>
      </main>
    </div>
  );
}

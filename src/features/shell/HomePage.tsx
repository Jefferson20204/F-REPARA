import { Button } from '../../components/ui/Button';
import type { AppMode } from '../../core/storage/authStorage';
import { useProfile } from '../profile/useProfile';

/* Por ahora solo muestra lo que ya mostraba el inicio de sesión: saludo y modo con el que ingresó. */
export default function HomePage({ mode }: { mode: AppMode }) {
  const { state, reload } = useProfile();
  const firstName = state.status === 'ready' ? (state.data.nombres.trim().split(/\s+/)[0] ?? '') : '';

  return (
    <>
      <h1 className="page-title">{firstName ? `Hola, ${firstName} 👋` : 'Hola 👋'}</h1>
      <p className="page-subtitle">
        {mode === 'client' ? 'Iniciaste sesión como cliente.' : 'Iniciaste sesión como técnico.'}
      </p>

      {state.status === 'error' && (
        <div className="alert alert--error" role="alert">
          <p>{state.message}</p>
          <Button variant="outline" onClick={reload}>Reintentar</Button>
        </div>
      )}
    </>
  );
}

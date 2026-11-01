import { Button } from '../../components/ui/Button';
import type { AppMode } from '../../core/storage/authStorage';
import { useProfile } from '../profile/useProfile';
import { ClientHomeView } from './ClientHomeView';

export default function HomePage({ mode }: { mode: AppMode }) {
  const { state, reload } = useProfile();
  const firstName = state.status === 'ready' ? (state.data.nombres.trim().split(/\s+/)[0] ?? '') : '';

  const errorAlert =
    state.status === 'error' ? (
      <div className="alert alert--error" role="alert">
        <p>{state.message}</p>
        <Button variant="outline" onClick={reload}>Reintentar</Button>
      </div>
    ) : null;

  if (mode === 'client') {
    return (
      <>
        <ClientHomeView firstName={firstName} />
        {errorAlert}
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">{firstName ? `Hola, ${firstName} 👋` : 'Hola 👋'}</h1>
      <p className="page-subtitle">Iniciaste sesión como técnico.</p>
      {errorAlert}
    </>
  );
}
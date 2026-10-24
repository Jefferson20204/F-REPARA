import { Wrench } from 'lucide-react';
import { useResource } from '../../core/hooks/useResource';
import { fetchMyApplications, latestApplication, type ApplicationStatus } from './applicationApi';

const CHIP: Record<ApplicationStatus, { text: string; className: string }> = {
  PENDIENTE: { text: 'En evaluación', className: 'chip chip--warning' },
  ACEPTADO: { text: 'Aprobada', className: 'chip chip--success' },
  RECHAZADO: { text: 'Rechazada', className: 'chip chip--danger' },
};

/** Fila "Modo Técnico" del Perfil (cliente). El interruptor siempre está apagado: encenderlo lleva al flujo de postulación o al modo técnico. */
export function TechnicianModeRow({ onToggle }: { onToggle: () => void }) {
  const { state } = useResource(fetchMyApplications);
  const latest = state.status === 'ready' ? latestApplication(state.data) : null;
  const chip = latest ? CHIP[latest.estado] : null;

  return (
    <button type="button" role="switch" aria-checked={false} className="list-row" onClick={onToggle}>
      <Wrench size={20} aria-hidden="true" />
      <span className="list-row__label">Modo Técnico</span>
      {chip && <span className={chip.className}>{chip.text}</span>}
      <span className="switch" aria-hidden="true"><span className="switch__thumb" /></span>
    </button>
  );
}

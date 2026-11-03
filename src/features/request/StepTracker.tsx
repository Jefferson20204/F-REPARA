import { Check } from 'lucide-react';
import '../../styles/stepTracker.css';

const STEPS = ['Pago', 'Transito', 'Diagnostico', 'Reparacion'] as const;

/* current: paso actual, de 1 a 4. Los anteriores se muestran como completados. */
export function StepTracker({ current }: { current: number }) {
  return (
    <ol className="st" aria-label="Progreso del servicio">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const state = number < current ? 'done' : number === current ? 'active' : 'todo';
        return (
          <li
            key={label}
            className={'st-step st-step--' + state}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            <span className="st-dot">{state === 'done' ? <Check size={16} /> : number}</span>
            <span className="st-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
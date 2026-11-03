import { useNavigate } from 'react-router';
import { CircleCheck, ShieldCheck, Star } from 'lucide-react';
import '../../styles/technicianAssigned.css';

interface AssignedTechnician {
  name: string;
  rating: number;
  jobs: string;
  specialty: string;
  transfer: number;
  diagnosis: number;
}

/* Datos de ejemplo: reemplazar cuando el back exponga el tecnico asignado a la solicitud. */
const SAMPLE: AssignedTechnician = {
  name: 'Miguel Torres',
  rating: 4.8,
  jobs: '120+ trabajos',
  specialty: 'Linea Blanca (Lavadoras, Refrigeradoras, Secadoras)',
  transfer: 15,
  diagnosis: 20,
};

function money(value: number): string {
  return 'S/ ' + value.toFixed(2);
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

export default function TechnicianAssignedPage() {
  const navigate = useNavigate();
  const tech = SAMPLE;
  const total = tech.transfer + tech.diagnosis;

  return (
    <div className="screen">
      <header className="ta-header">
        <div className="ta-check">
          <CircleCheck size={28} />
        </div>
        <h1 className="ta-title">Tecnico asignado!</h1>
        <p className="ta-subtitle">Un especialista ha aceptado tu solicitud de revision</p>
      </header>

      <section className="ta-card">
        <div className="ta-person">
          <div className="ta-avatar" aria-hidden="true">{initials(tech.name)}</div>
          <div>
            <p className="ta-name">
              <span>{tech.name}</span>
              <ShieldCheck size={16} className="ta-verified" />
            </p>
            <p className="ta-meta">
              <span className="ta-rating">
                <Star size={12} />
                {tech.rating.toFixed(1)}
              </span>
              <span>{tech.jobs}</span>
            </p>
          </div>
        </div>
        <div className="ta-specialty">
          <p className="ta-specialty__label">Especialidad:</p>
          <p>{tech.specialty}</p>
        </div>
      </section>

      <section className="ta-payment">
        <p className="ta-payment__label">RESUMEN DEL PRIMER PAGO</p>
        <div className="ta-row">
          <span>Traslado a domicilio</span>
          <span>{money(tech.transfer)}</span>
        </div>
        <div className="ta-row">
          <span>Diagnostico tecnico inicial</span>
          <span>{money(tech.diagnosis)}</span>
        </div>
        <div className="ta-total">
          <span>Total visita inicial</span>
          <span className="ta-total__amount">{money(total)}</span>
        </div>
      </section>

      <div className="ta-actions">
        {/* TODO: llevar al pago cuando exista esa pantalla. */}
        <button type="button" className="btn ta-btn" onClick={() => void navigate('/cliente/solicitud/pago')}>
          Empezar
        </button>
        <p className="ta-secure">Pago seguro garantizado por Reparo Peru</p>
      </div>
    </div>
  );
}
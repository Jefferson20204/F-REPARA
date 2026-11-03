import { useNavigate } from 'react-router';
import { Sparkles } from 'lucide-react';
import '../../styles/rating.css';

export default function RatingSentPage() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <main className="screen__main rs2-main">
        <div className="rs2-halo">
          <Sparkles size={44} />
        </div>
        <h1 className="rs2-title">Gracias por tu calificacion</h1>
        <p className="rs2-text">
          Tu opinion es de gran valor para nosotros y nos ayuda a mantener los altos estandares de
          Reparo Peru.
        </p>
      </main>

      <div className="rt-actions">
        <button
          type="button"
          className="btn btn--client"
          onClick={() => void navigate('/cliente', { replace: true })}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
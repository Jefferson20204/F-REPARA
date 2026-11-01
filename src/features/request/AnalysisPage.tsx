import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck, Wrench } from 'lucide-react';
import '../../styles/analysis.css';

const STEP_PERCENT = 2;
const TICK_MS = 100;
const FINISH_DELAY_MS = 800;

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((current) => Math.min(100, current + STEP_PERCENT));
    }, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const timeout = setTimeout(() => {
      void navigate('/cliente', { replace: true });
    }, FINISH_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [progress, navigate]);

  return (
    <div className="screen">
      <main className="screen__main an-main">
        <div className="an-halo">
          <div className="an-core">
            <Wrench size={44} />
          </div>
        </div>

        <h1 className="an-title">Analizando tu solicitud...</h1>
        <p className="an-text">Estamos revisando las fotos y detalles de tu electrodomestico</p>

        <div
          className="an-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="an-fill" style={{ width: progress + '%' }} />
        </div>
        <p className="an-percent">{progress + '% completado'}</p>
      </main>

      <footer className="an-footer">
        <ShieldCheck size={16} />
        <span>Buscando tecnicos certificados cerca de ti</span>
      </footer>
    </div>
  );
}
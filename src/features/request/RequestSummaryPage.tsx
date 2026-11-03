import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, MapPin, WashingMachine } from 'lucide-react';
import { describeError } from '../../core/api/ApiError';
import { clearDraft, getDraft } from './requestDraft';
import { createRequest } from './solicitudesApi';
import '../../styles/requestSummary.css';

function formatSuggested(value: string): string {
  if (value === '') return 'Sin horario sugerido';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return 'Sugerido: ' + date.toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function RequestSummaryPage() {
  const navigate = useNavigate();
  const draft = getDraft();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previews = useMemo(
    () => (draft === null ? [] : draft.photos.map((file) => URL.createObjectURL(file))),
    [draft],
  );
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  if (draft === null) return <Navigate to="/cliente/solicitud/nueva" replace />;

  async function confirm() {
    if (draft === null || sending) return;
    setSending(true);
    setError(null);
    try {
      await createRequest(draft);
      clearDraft();
      void navigate('/cliente/solicitud/analisis', { replace: true });
    } catch (caught) {
      setError(describeError(caught));
      setSending(false);
    }
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <button
          type="button"
          className="screen-header__back"
          aria-label="Volver"
          onClick={() => void navigate('/cliente/solicitud/nueva')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="screen-header__title">Resumen de solicitud</h1>
      </header>

      <section className="rs-card">
        <div className="rs-section">
          <p className="rs-label">ELECTRODOMESTICO</p>
          <div className="rs-appliance">
            <WashingMachine size={24} className="rs-appliance__icon" />
            <div>
              <p className="rs-appliance__title">{draft.appliance + ' ' + draft.brand}</p>
              {draft.model !== '' && <p className="rs-appliance__sub">{'Modelo: ' + draft.model}</p>}
            </div>
          </div>
        </div>

        <div className="rs-section">
          <p className="rs-label">PROBLEMA REPORTADO</p>
          <p className="rs-problem">{'"' + draft.problem + '"'}</p>
        </div>

        {previews.length > 0 && (
          <div className="rs-section">
            <p className="rs-label">{'FOTOS ADJUNTAS (' + previews.length + ')'}</p>
            <div className="rs-photos">
              {previews.map((url, index) => (
                <img key={url} src={url} alt={'Foto ' + (index + 1)} />
              ))}
            </div>
          </div>
        )}

        <div className="rs-section">
          <div className="rs-info">
            <MapPin size={18} />
            <span>{draft.address}</span>
          </div>
          <div className="rs-info">
            <Calendar size={18} />
            <span>{formatSuggested(draft.suggestedAt)}</span>
          </div>
        </div>
      </section>

      <div className="rs-actions">
        {error !== null && (
          <div className="alert alert--error" role="alert">
            <p>{error}</p>
          </div>
        )}
        <button type="button" className="btn btn--client" disabled={sending} onClick={() => void confirm()}>
          {sending ? 'Enviando...' : 'Confirmar solicitud'}
        </button>
        <button
          type="button"
          className="btn btn--outline"
          disabled={sending}
          onClick={() => void navigate('/cliente/solicitud/editar')}
        >
          Editar detalles
        </button>
      </div>
    </div>
  );
}
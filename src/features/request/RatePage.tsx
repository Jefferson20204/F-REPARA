import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Star } from 'lucide-react';
import { SAMPLE_TECHNICIAN, initials } from './technicianSample';
import '../../styles/rating.css';

const TAGS = ['Puntual', 'Profesional', 'Buen precio', 'Limpio', 'Amable'];
const STAR_VALUES = [1, 2, 3, 4, 5];

export default function RatePage() {
  const navigate = useNavigate();
  const tech = SAMPLE_TECHNICIAN;
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  function toggleTag(tag: string) {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  function submit() {
    if (stars === 0) return;
    /* TODO: enviar al back cuando exista el endpoint de calificaciones (tabla calificaciones). */
    void navigate('/cliente/solicitud/calificacion-enviada', { replace: true });
  }

  return (
    <div className="screen">
      <header className="screen-header rt-header">
        <button
          type="button"
          className="screen-header__back"
          aria-label="Volver"
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="screen-header__title">Calificar servicio</h1>
      </header>

      <div className="rt-tech">
        <div className="rt-avatar" aria-hidden="true">{initials(tech.name)}</div>
        <p className="rt-name">{tech.name}</p>
        <p className="rt-ask">Como calificarias el servicio tecnico brindado?</p>

        <div className="rt-stars" role="radiogroup" aria-label="Calificacion">
          {STAR_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={value === stars}
              aria-label={value + ' de 5 estrellas'}
              className={value <= stars ? 'rt-star rt-star--on' : 'rt-star'}
              onClick={() => setStars(value)}
            >
              <Star size={36} />
            </button>
          ))}
        </div>
      </div>

      <p className="rt-question">Que destaco de su atencion?</p>
      <div className="rt-tags">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={tags.includes(tag)}
            className={tags.includes(tag) ? 'rt-tag rt-tag--on' : 'rt-tag'}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <label className="rt-question" htmlFor="rt-comment">Como fue tu experiencia? (Opcional)</label>
      <textarea
        id="rt-comment"
        className="rt-comment"
        placeholder="Escribe aqui tus comentarios adicionales..."
        maxLength={300}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />

      <div className="rt-actions">
        <button type="button" className="btn btn--client" disabled={stars === 0} onClick={submit}>
          Enviar calificacion
        </button>
        <button type="button" className="rt-skip" onClick={() => void navigate('/cliente', { replace: true })}>
          Omitir
        </button>
      </div>
    </div>
  );
}
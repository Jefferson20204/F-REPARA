import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, MapPin, Plus, WashingMachine, X } from 'lucide-react';
import { getDraft, saveDraft } from './requestDraft';
import '../../styles/request.css';
import '../../styles/editRequest.css';

const MAX_PHOTOS = 3;

interface Errors {
  problem?: string;
  address?: string;
}

export default function EditRequestPage() {
  const navigate = useNavigate();
  const draft = getDraft();

  const [model, setModel] = useState(draft?.model ?? '');
  const [problem, setProblem] = useState(draft?.problem ?? '');
  const [photos, setPhotos] = useState<File[]>(draft?.photos ?? []);
  const [address, setAddress] = useState(draft?.address ?? '');
  const [suggestedAt, setSuggestedAt] = useState(draft?.suggestedAt ?? '');
  const [errors, setErrors] = useState<Errors>({});
  const fileInput = useRef<HTMLInputElement>(null);
  const dateInput = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => photos.map((file) => URL.createObjectURL(file)), [photos]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  if (draft === null) return <Navigate to="/cliente/solicitud/nueva" replace />;

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setPhotos((current) => [...current, ...files].slice(0, MAX_PHOTOS));
    event.target.value = '';
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
  }

  function openDatePicker() {
    const input = dateInput.current;
    if (input === null) return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (draft === null) return;

    const found: Errors = {};
    if (problem.trim().length < 10) found.problem = 'Describe la falla (minimo 10 caracteres)';
    if (address.trim() === '') found.address = 'La direccion es obligatoria';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    saveDraft({
      ...draft,
      model: model.trim(),
      problem: problem.trim(),
      photos,
      address: address.trim(),
      suggestedAt,
    });
    void navigate('/cliente/solicitud/resumen');
  }

  return (
    <div className="ed">
      <header className="screen-header">
        <button
          type="button"
          className="screen-header__back"
          aria-label="Volver"
          onClick={() => void navigate('/cliente/solicitud/resumen')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="screen-header__title">Editar detalles</h1>
      </header>

      <form onSubmit={submit} noValidate>
        <div className="field">
          <p className="ed-label">Electrodomestico</p>
          <div className="ed-readonly">
            <WashingMachine size={20} />
            <span>{draft.appliance + ' ' + draft.brand}</span>
          </div>
        </div>

        <div className="field">
          <label className="ed-label" htmlFor="ed-model">Modelo</label>
          <input
            id="ed-model"
            className="field__input"
            placeholder="Ej. WA19T"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />
        </div>

        <div className="field">
          <label className="ed-label" htmlFor="ed-problem">Problema reportado</label>
          <textarea
            id="ed-problem"
            className="field__input rq-textarea"
            value={problem}
            aria-invalid={errors.problem !== undefined}
            onChange={(event) => setProblem(event.target.value)}
          />
          {errors.problem && <span className="field__error">{errors.problem}</span>}
        </div>

        <div className="field">
          <p className="ed-label">Fotos adjuntas</p>
          <div className="rq-photos">
            {previews.map((url, index) => (
              <div key={url} className="rq-photo">
                <img src={url} alt={'Foto ' + (index + 1)} />
                <button
                  type="button"
                  className="rq-photo__remove"
                  aria-label={'Quitar foto ' + (index + 1)}
                  onClick={() => removePhoto(index)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                className="rq-photo-add ed-add"
                onClick={() => fileInput.current?.click()}
              >
                <Plus size={22} />
                <span>Anadir</span>
              </button>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={addPhotos}
          />
        </div>

        <div className="field">
          <label className="ed-label" htmlFor="ed-address">Direccion</label>
          <div className="field__box">
            <MapPin size={18} className="rq-icon" />
            <input
              id="ed-address"
              className="field__input rq-with-icon"
              value={address}
              aria-invalid={errors.address !== undefined}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
          {errors.address && <span className="field__error">{errors.address}</span>}
        </div>

        <div className="field">
          <label className="ed-label" htmlFor="ed-date">Horario sugerido</label>
          <div className="field__box">
            <button
              type="button"
              className="rq-icon-btn"
              aria-label="Abrir calendario"
              onClick={openDatePicker}
            >
              <Calendar size={18} />
            </button>
            <input
              id="ed-date"
              ref={dateInput}
              type="datetime-local"
              className="field__input rq-with-icon"
              value={suggestedAt}
              onChange={(event) => setSuggestedAt(event.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn--client ed-save">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
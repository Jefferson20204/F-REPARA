import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Camera, MapPin, X } from 'lucide-react';
import { APPLIANCES, getDraft, saveDraft, type Appliance } from './requestDraft';
   import '../../styles/request.css';

const MAX_PHOTOS = 3;

interface Errors {
  brand?: string;
  problem?: string;
  address?: string;
}

export default function NewRequestPage() {
  const navigate = useNavigate();
  const initial = getDraft();

  const [appliance, setAppliance] = useState<Appliance>(initial?.appliance ?? 'Lavadora');
  const [brand, setBrand] = useState(initial?.brand ?? '');
  const [model, setModel] = useState(initial?.model ?? '');
  const [problem, setProblem] = useState(initial?.problem ?? '');
  const [photos, setPhotos] = useState<File[]>(initial?.photos ?? []);
  const [address, setAddress] = useState(initial?.address ?? '');
  const [suggestedAt, setSuggestedAt] = useState(initial?.suggestedAt ?? '');
  const [errors, setErrors] = useState<Errors>({});
  const fileInput = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => photos.map((file) => URL.createObjectURL(file)), [photos]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setPhotos((current) => [...current, ...files].slice(0, MAX_PHOTOS));
    event.target.value = '';
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
  }

  function submit(event: FormEvent) {
    event.preventDefault();

    const found: Errors = {};
    if (brand.trim() === '') found.brand = 'La marca es obligatoria';
    if (problem.trim().length < 10) found.problem = 'Describe la falla (minimo 10 caracteres)';
    if (address.trim() === '') found.address = 'La direccion es obligatoria';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    saveDraft({
      appliance,
      brand: brand.trim(),
      model: model.trim(),
      problem: problem.trim(),
      photos,
      address: address.trim(),
      suggestedAt,
    });
    void navigate('/cliente/solicitud/resumen');
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <button
          type="button"
          className="screen-header__back"
          aria-label="Volver"
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="screen-header__title">Solicitar Reparacion</h1>
      </header>

      <form onSubmit={submit} noValidate>
        <div className="field">
          <span className="field__label">Que electrodomestico deseas reparar?</span>
          <div className="rq-chips">
            {APPLIANCES.map((item) => (
              <button
                key={item}
                type="button"
                className={item === appliance ? 'rq-chip rq-chip--on' : 'rq-chip'}
                aria-pressed={item === appliance}
                onClick={() => setAppliance(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="rq-brand">Marca</label>
          <input
            id="rq-brand"
            className="field__input"
            placeholder="Ej. Samsung, LG, Whirlpool"
            value={brand}
            aria-invalid={errors.brand !== undefined}
            onChange={(event) => setBrand(event.target.value)}
          />
          {errors.brand && <span className="field__error">{errors.brand}</span>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="rq-model">Modelo (Opcional)</label>
          <input
            id="rq-model"
            className="field__input"
            placeholder="Ej. WA19T"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="rq-problem">Describe la falla o problema</label>
          <textarea
            id="rq-problem"
            className="field__input rq-textarea"
            placeholder="Ej: Mi lavadora no centrifuga y hace ruidos extranos al intentar girar."
            value={problem}
            aria-invalid={errors.problem !== undefined}
            onChange={(event) => setProblem(event.target.value)}
          />
          {errors.problem && <span className="field__error">{errors.problem}</span>}
        </div>

        <div className="field">
          <span className="field__label">Agregar fotos (Max. {MAX_PHOTOS})</span>
          <div className="rq-photos">
            {photos.length < MAX_PHOTOS && (
              <button type="button" className="rq-photo-add" onClick={() => fileInput.current?.click()}>
                <Camera size={22} />
                <span>Subir foto</span>
              </button>
            )}
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
          <label className="field__label" htmlFor="rq-address">Direccion de atencion</label>
          <div className="field__box">
            <MapPin size={18} className="rq-icon" />
            <input
              id="rq-address"
              className="field__input rq-with-icon"
              placeholder="Ej. Av. Las Palmeras 450, Miraflores"
              value={address}
              aria-invalid={errors.address !== undefined}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
          {errors.address && <span className="field__error">{errors.address}</span>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="rq-date">Fecha y hora sugerida</label>
          <div className="field__box">
            <Calendar size={18} className="rq-icon" />
            <input
              id="rq-date"
              type="datetime-local"
              className="field__input rq-with-icon"
              value={suggestedAt}
              onChange={(event) => setSuggestedAt(event.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn--client rq-submit">
          Continuar al resumen
        </button>
      </form>
    </div>
  );
}
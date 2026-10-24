import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Button';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { TextField } from '../../components/ui/TextField';
import { describeError } from '../../core/api/ApiError';
import type { FieldErrors } from '../auth/validation';
import { createApplication } from './applicationApi';
import { validateApplication, type ApplicationField, type ApplicationForm } from './validation';

const EMPTY: ApplicationForm = { especialidad: '', anios: '', cvUrl: '', certificadosUrl: '', dniDocumentoUrl: '' };

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ApplicationForm>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<ApplicationField>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const bind = (field: ApplicationField) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const found = validateApplication(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await createApplication({
        especialidad: form.especialidad.trim(),
        aniosExperiencia: Number(form.anios.trim()),
        cvUrl: form.cvUrl.trim(),
        certificadosUrl: form.certificadosUrl.trim(),
        dniDocumentoUrl: form.dniDocumentoUrl.trim(),
      });
      // El backend devolvió la postulación creada: se confirma el envío y se muestra el estado de evaluación.
      await navigate('/cliente/tecnico', { replace: true, state: { justSubmitted: created.id } });
    } catch (error) {
      setSubmitError(describeError(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <ScreenHeader title="Postular como técnico" onBack={() => void navigate('/cliente/tecnico')} />

      <form onSubmit={(event) => void handleSubmit(event)} noValidate>
        <TextField label="Especialidad" placeholder="Ej: Refrigeración" value={form.especialidad} onChange={bind('especialidad')} error={errors.especialidad} />
        <TextField label="Años de experiencia" inputMode="numeric" maxLength={2} placeholder="Ej: 3" value={form.anios} onChange={bind('anios')} error={errors.anios} />
        <TextField
          label="Enlace a tu CV"
          type="url"
          inputMode="url"
          autoCapitalize="none"
          placeholder="https://…"
          hint="Por ahora los documentos se comparten por enlace (Drive, Dropbox, etc.)."
          value={form.cvUrl}
          onChange={bind('cvUrl')}
          error={errors.cvUrl}
        />
        <TextField label="Enlace a certificados (opcional)" type="url" inputMode="url" autoCapitalize="none" placeholder="https://…" value={form.certificadosUrl} onChange={bind('certificadosUrl')} error={errors.certificadosUrl} />
        <TextField label="Enlace a tu DNI (opcional)" type="url" inputMode="url" autoCapitalize="none" placeholder="https://…" value={form.dniDocumentoUrl} onChange={bind('dniDocumentoUrl')} error={errors.dniDocumentoUrl} />

        {submitError && <div className="alert alert--error" role="alert">{submitError}</div>}

        <Button type="submit" variant="client" disabled={submitting}>
          {submitting ? 'Enviando…' : 'Enviar postulación'}
        </Button>
      </form>
    </div>
  );
}

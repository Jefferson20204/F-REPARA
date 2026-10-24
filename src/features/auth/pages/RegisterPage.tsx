import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { describeError } from '../../../core/api/ApiError';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/ui/TextField';
import * as authApi from '../authApi';
import { validateRegister, type FieldErrors, type RegisterField, type RegisterForm } from '../validation';

const EMPTY: RegisterForm = { nombre: '', correo: '', telefono: '', documento: '', contrasena: '', confirmar: '' };

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const bind = (field: RegisterField) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const found = validateRegister(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await authApi.register(form);
      await navigate('/login', { replace: true, state: { registered: true } });
    } catch (error) {
      setSubmitError(describeError(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <main className="screen__main">
        <BrandLogo />
        <h1 className="screen__title">Crea tu cuenta gratis</h1>

        <form onSubmit={(event) => void handleSubmit(event)} noValidate>
          <TextField label="Nombre completo" autoComplete="name" placeholder="Juan Pérez" value={form.nombre} onChange={bind('nombre')} error={errors.nombre} />
          <TextField label="Correo electrónico" type="email" inputMode="email" autoComplete="email" placeholder="juan@correo.com" value={form.correo} onChange={bind('correo')} error={errors.correo} />
          <TextField label="Teléfono de contacto" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="987 654 321" value={form.telefono} onChange={bind('telefono')} error={errors.telefono} />
          <TextField label="Documento de identidad" inputMode="numeric" maxLength={8} placeholder="99999999" value={form.documento} onChange={bind('documento')} error={errors.documento} />
          <TextField label="Contraseña" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={form.contrasena} onChange={bind('contrasena')} error={errors.contrasena} />
          <TextField label="Confirmar contraseña" type="password" autoComplete="new-password" placeholder="Repite tu contraseña" value={form.confirmar} onChange={bind('confirmar')} error={errors.confirmar} />

          {submitError && <div className="alert alert--error" role="alert">{submitError}</div>}

          <Button type="submit" variant="client" disabled={submitting}>
            {submitting ? 'Creando cuenta…' : 'Registrarse'}
          </Button>
        </form>
      </main>

      <footer className="screen__footer">
        ¿Ya tienes una cuenta? <Link className="link" to="/login">Ya tengo una cuenta</Link>
      </footer>
    </div>
  );
}

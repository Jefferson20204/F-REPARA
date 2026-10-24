import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router';
import { ApiError, describeError } from '../../../core/api/ApiError';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { Button } from '../../../components/ui/Button';
import { GoogleIcon } from '../../../components/ui/GoogleIcon';
import { TextField } from '../../../components/ui/TextField';
import { useAuth } from '../useAuth';
import { validateLogin, type FieldErrors, type LoginField, type LoginForm } from '../validation';

function cameFromRegistration(state: unknown): boolean {
  return typeof state === 'object' && state !== null && 'registered' in state;
}

function loginErrorMessage(error: unknown): string {
  // El informe (PNF 05) documenta HTTP 400 por credenciales inválidas.
  if (error instanceof ApiError && (error.status === 400 || error.status === 401)) {
    return 'Correo o contraseña incorrectos.';
  }
  return describeError(error);
}

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState<LoginForm>({ correo: '', contrasena: '' });
  const [errors, setErrors] = useState<FieldErrors<LoginField>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const bind = (field: LoginField) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const found = validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    setNotice(null);
    try {
      // Si el login funciona, <PublicOnly> redirige (a /modo si es técnico, o a su inicio).
      await login({ correo: form.correo.trim(), contrasena: form.contrasena });
    } catch (error) {
      setSubmitError(loginErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <main className="screen__main">
        <BrandLogo />
        <h1 className="screen__title">Tu hogar en manos expertas</h1>

        {cameFromRegistration(location.state) && (
          <div className="alert alert--success" role="status">Cuenta creada. Ya puedes iniciar sesión.</div>
        )}

        <form onSubmit={(event) => void handleSubmit(event)} noValidate>
          <TextField
            label="Correo"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="ejemplo@correo.com"
            value={form.correo}
            onChange={bind('correo')}
            error={errors.correo}
          />
          <TextField
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.contrasena}
            onChange={bind('contrasena')}
            error={errors.contrasena}
          />

          <div className="link-row">
            {/* Sin endpoint de recuperación documentado: no se simula el flujo. */}
            <button type="button" className="link" onClick={() => setNotice('La recuperación de contraseña aún no está disponible en esta versión.')}>
              ¿Olvidé mi contraseña?
            </button>
          </div>

          {submitError && <div className="alert alert--error" role="alert">{submitError}</div>}
          {notice && <div className="alert alert--info" role="status">{notice}</div>}

          <Button type="submit" variant="client" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="divider">O continuar con</div>
        {/* Sin flujo de Google confirmado en el backend: se muestra pero no autentica. */}
        <Button variant="outline" onClick={() => setNotice('Google Sign-In aún no está disponible en esta versión.')}>
          <GoogleIcon /> Continuar con Google
        </Button>
      </main>

      <footer className="screen__footer">
        ¿No tienes una cuenta? <Link className="link" to="/registro">Crear cuenta</Link>
      </footer>
    </div>
  );
}

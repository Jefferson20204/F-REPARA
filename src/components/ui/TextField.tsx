import { useId, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
}

export function TextField({ label, error, type = 'text', ...rest }: TextFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>{label}</label>
      <div className="field__box">
        <input
          id={id}
          className={`field__input${isPassword ? ' field__input--with-action' : ''}`}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="field__action"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <span id={`${id}-error`} className="field__error" role="alert">{error}</span>}
    </div>
  );
}

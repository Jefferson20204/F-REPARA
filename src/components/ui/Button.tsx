import type { ButtonHTMLAttributes } from 'react';

type Variant = 'client' | 'technician' | 'outline' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'client', className = '', type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={`btn btn--${variant} ${className}`.trim()} {...rest} />;
}

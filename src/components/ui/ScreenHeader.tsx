import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  onBack: () => void;
}

export function ScreenHeader({ title, onBack }: Props) {
  return (
    <header className="screen-header">
      <button type="button" className="screen-header__back" onClick={onBack} aria-label="Volver">
        <ArrowLeft size={20} />
      </button>
      <h1 className="screen-header__title">{title}</h1>
    </header>
  );
}

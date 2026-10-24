import { Wrench } from 'lucide-react';

export function BrandLogo() {
  return (
    <div className="brand">
      <span className="brand__mark" aria-hidden="true"><Wrench size={20} /></span>
      <span className="brand__name">Reparo</span>
    </div>
  );
}

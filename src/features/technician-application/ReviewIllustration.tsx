/* Ilustración propia en SVG (mismo lenguaje de círculos concéntricos de la pantalla "Analizando tu solicitud"). Reemplazable por una imagen del prototipo. */
interface Props {
  tone?: 'blue' | 'emerald';
}

const TONES = {
  blue: { outer: '#dbeafe', inner: '#2563eb', soft: '#bfdbfe', line: '#93c5fd' },
  emerald: { outer: '#d1fae5', inner: '#047857', soft: '#a7f3d0', line: '#6ee7b7' },
} as const;

export function ReviewIllustration({ tone = 'blue' }: Props) {
  const c = TONES[tone];
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label="Postulación en revisión">
      <circle cx="100" cy="100" r="96" fill={c.outer} />
      <circle cx="100" cy="100" r="64" fill={c.inner} />
      <rect x="74" y="62" width="52" height="68" rx="8" fill="#fff" />
      <rect x="88" y="54" width="24" height="14" rx="5" fill={c.soft} />
      <rect x="84" y="80" width="32" height="5" rx="2.5" fill={c.line} />
      <rect x="84" y="92" width="32" height="5" rx="2.5" fill={c.line} />
      <rect x="84" y="104" width="20" height="5" rx="2.5" fill={c.line} />
      <circle cx="128" cy="128" r="20" fill="#fff" stroke={c.inner} strokeWidth="5" />
      <line x1="142" y1="142" x2="154" y2="154" stroke={c.inner} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

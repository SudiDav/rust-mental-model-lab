interface BrandMarkProps {
  className?: string;
  decorative?: boolean;
}

export function BrandMark({ className = 'size-10', decorative = false }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : 'Rust Mental Model Lab logo'}
    >
      <title>Rust Mental Model Lab logo</title>
      <rect x="5" y="5" width="54" height="54" rx="17" fill="#0d1820" stroke="#67e8f9" strokeOpacity="0.28" />
      <rect x="16" y="17" width="24" height="10" rx="4" fill="#22d3ee" fillOpacity="0.12" stroke="#67e8f9" strokeWidth="2" />
      <rect x="16" y="27" width="24" height="10" rx="4" fill="#34d399" fillOpacity="0.12" stroke="#6ee7b7" strokeWidth="2" />
      <rect x="16" y="37" width="24" height="10" rx="4" fill="#fbbf24" fillOpacity="0.12" stroke="#fcd34d" strokeWidth="2" />
      <path d="M41 18.5c6.5 2.8 10 7.2 10 13.5 0 6.4-3.5 10.8-10 13.5" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m43 42 3.8 3.8-5.2 1.6" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="21" cy="22" r="1.5" fill="#e0f2fe" />
      <circle cx="21" cy="32" r="1.5" fill="#d1fae5" />
      <circle cx="21" cy="42" r="1.5" fill="#fef3c7" />
    </svg>
  );
}

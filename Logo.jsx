export default function Logo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="chefgenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--accent)" />
          <stop offset="100%" stop-color="var(--accent-2)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#chefgenGrad)" />
      <g fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 28c-4.4 0-8 3.6-8 8s3.6 8 8 8h24c4.4 0 8-3.6 8-8s-3.6-8-8-8c0-6.6-5.4-12-12-12s-12 5.4-12 12z"/>
        <rect x="20" y="40" width="24" height="10" rx="4"/>
        <path d="M26 50v4m12-4v4"/>
      </g>
      <circle cx="46" cy="18" r="3" fill="#fff" opacity="0.9" />
    </svg>
  )
}

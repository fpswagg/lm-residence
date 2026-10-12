/** Monogramme L.M.: une porte en arche (« une maison, quatre portes ») et les initiales. */
export function Monogram({ className, title = "L.M. Résidence" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 88" className={className} role="img" aria-label={title} fill="none">
      <path
        data-arch
        d="M4 86 V32 A28 28 0 0 1 60 32 V86"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <text
        data-initials
        x="32"
        y="66"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-display)", fontSize: 30, fontStyle: "italic", fontVariationSettings: '"opsz" 72, "SOFT" 100, "WONK" 1', fontWeight: 350 }}
      >
        LM
      </text>
    </svg>
  )
}

import type { ReactNode } from "react"

/** Pages pas encore refaites (phases 3–4): fond sombre d'origine, sous l'en-tête fixe. */
export function LegacyPage({ children }: { children: ReactNode }) {
  return (
    <div data-theme="dark" className="bg-[#1a1612] pt-[var(--header-h)] text-[#f8f4ef]">
      {children}
    </div>
  )
}

"use client"

import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface Base {
  label: string
  error?: string
  hint?: string
  className?: string
}

const inputCls =
  "serif-text mt-1 block w-full rounded-none bg-transparent py-3 text-xl text-ebony outline-none placeholder:text-ebony/30 focus-visible:outline-none md:text-2xl"

function Frame({ id, label, error, hint, required, className, children }: Base & { id: string; required?: boolean; children: ReactNode }) {
  return (
    <div className={cn("group/f relative", className)} data-invalid={error ? "" : undefined}>
      <label htmlFor={id} className="label flex items-baseline justify-between gap-4 text-ebony/55 transition-colors duration-500 group-focus-within/f:text-ebony">
        <span>
          {label}
          {required && <span aria-hidden className="text-brass-deep"> *</span>}
        </span>
        {hint && <span className="normal-case tracking-normal text-ebony/40">{hint}</span>}
      </label>
      {children}
      <span aria-hidden className="relative block h-px bg-ebony/20">
        <span className="absolute inset-x-0 -top-px block h-[2px] origin-left scale-x-0 bg-ebony transition-transform duration-700 ease-expo group-focus-within/f:scale-x-100 group-data-[invalid]/f:scale-x-100 group-data-[invalid]/f:bg-terracotta" />
      </span>
      <p id={`${id}-err`} role={error ? "alert" : undefined} className="mt-2 min-h-[1.25rem] text-sm text-terracotta">
        {error}
      </p>
    </div>
  )
}

/** Champ texte: libellé en capitales, saisie en serif, filet qui se trace au focus. */
export function Field({ label, error, hint, className, id, required, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <Frame id={fid} label={label} error={error} hint={hint} required={required} className={className}>
      <input id={fid} required={required} aria-invalid={error ? true : undefined} aria-describedby={error ? `${fid}-err` : undefined} className={inputCls} {...rest} />
    </Frame>
  )
}

export function TextArea({ label, error, hint, className, id, required, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <Frame id={fid} label={label} error={error} hint={hint} required={required} className={className}>
      <textarea
        id={fid}
        required={required}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-err` : undefined}
        className={cn(inputCls, "resize-none leading-snug")}
        {...rest}
      />
    </Frame>
  )
}

/** Choix exclusif en pilules (remplace les listes déroulantes). */
export function Choice<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  className,
}: {
  legend: string
  name: string
  value: T
  options: { value: T; label: ReactNode; disabled?: boolean }[]
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <fieldset className={className}>
      <legend className="label text-ebony/55">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className={cn("relative", o.disabled && "pointer-events-none opacity-35")}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="label num inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-ebony/20 px-5 transition-colors duration-500 hover:border-ebony peer-checked:border-ebony peer-checked:bg-ebony peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brass-deep">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** Piège à robots: invisible pour les humains, rempli par les scripts. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Site web
        <input type="text" name="site" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  )
}

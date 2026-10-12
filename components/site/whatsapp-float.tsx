"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { WhatsAppIcon } from "./icons"
import { site, wa } from "@/lib/site"
import { cn } from "@/lib/utils"

/** Bouton WhatsApp flottant: apparaît après le premier écran, se retire près du pied de page. */
export function WhatsAppFloat() {
  const [show, setShow] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    const check = () => {
      const footer = document.querySelector("footer")
      const nearEnd = footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.9 : false
      setShow(window.scrollY > window.innerHeight * 0.6 && !nearEnd)
    }
    check()
    window.addEventListener("scroll", check, { passive: true })
    return () => window.removeEventListener("scroll", check)
  }, [pathname])
  return (
    <a
      href={wa(site.whatsapp, "Bonjour, je souhaite des informations sur L.M. Résidence.")}
      target="_blank"
      rel="noopener"
      aria-label="Écrire sur WhatsApp"
      tabIndex={show ? 0 : -1}
      className={cn(
        "fixed bottom-5 right-5 z-[60] flex size-14 items-center justify-center rounded-full bg-sage-deep text-paper shadow-[0_10px_30px_-10px_rgb(21_17_13/0.5)] transition-[transform,opacity,background-color] duration-700 ease-expo hover:bg-ebony sm:bottom-8 sm:right-8",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <WhatsAppIcon className="size-6" />
    </a>
  )
}

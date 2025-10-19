"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import logo from "@/public/logo.png"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/logements", label: "Nos Logements" },
    // { href: "/services", label: "Services" },
    { href: "/galerie", label: "Galerie" },
    { href: "/a-propos", label: "À Propos" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1612]/98 backdrop-blur-md border-b-2 border-[#5c3d2e] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Now with logo.png */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 bg-gradient-to-br from-[#5c3d2e] to-[#8b6f47] rounded-md flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 rounded-md"></div>
              <Image
                src={logo}
                alt="L.M. Résidence Logo"
                width={32}
                height={32}
                className="relative w-9 h-9 object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif font-bold text-xl text-[#cd9a51] block leading-tight">L.M. Résidence</span>
              <span className="font-sans text-xs text-[#b8956a] tracking-wider">Yaoundé</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300
                  ${
                    isActive(link.href)
                      ? "text-[#cd9a51] bg-[#2d1f15]"
                      : "text-[#b8956a] hover:text-[#cd9a51] hover:bg-[#2d1f15]/50"
                  }
                `}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#cd9a51] rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/reservation"
            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#cd9a51] to-[#b8956a] text-[#1a1612] font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Réserver
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 hover:bg-[#2d1f15] rounded-lg text-[#cd9a51] transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-[#5c3d2e] mt-2 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300
                  ${
                    isActive(link.href)
                      ? "text-[#cd9a51] bg-[#2d1f15]"
                      : "text-[#b8956a] hover:text-[#cd9a51] hover:bg-[#2d1f15]/50"
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservation"
              className="block px-4 py-3 text-center bg-gradient-to-r from-[#cd9a51] to-[#b8956a] text-[#1a1612] font-medium rounded-lg mt-4"
              onClick={() => setIsOpen(false)}
            >
              Réserver
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

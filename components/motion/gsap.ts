"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { CustomEase } from "gsap/CustomEase"
import { Draggable } from "gsap/Draggable"
import { InertiaPlugin } from "gsap/InertiaPlugin"
import { Flip } from "gsap/Flip"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Draggable, InertiaPlugin, Flip, useGSAP)
  // Courbes maison: "lm" = sortie longue et douce, "door" = ouverture de porte (lente, puis franche).
  CustomEase.create("lm", "0.16, 1, 0.3, 1")
  CustomEase.create("door", "0.76, 0, 0.24, 1")
  gsap.defaults({ ease: "lm", duration: 1.2 })
  ScrollTrigger.config({ ignoreMobileResize: true })
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Pointeur fin (souris): curseur, aimant, survols riches. */
export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin, Flip, useGSAP }

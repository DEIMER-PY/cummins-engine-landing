import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Registro único: cualquier módulo que anime importa GSAP desde aquí.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Tokens de motion. Movimiento pesado y amortiguado: es maquinaria, no rebota. */
export const motion = {
  ease: {
    out: "power3.out",
    pesado: "expo.out",
    lineal: "none",
  },
  scrub: 0.9,
  reveal: 0.95,
  stagger: { palabra: 0.05, linea: 0.11, tarjeta: 0.08 },
  inicioReveal: "top 82%",
} as const;

export const prefiereMenosMovimiento = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };

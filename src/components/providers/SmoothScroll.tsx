"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { gsap, prefiereMenosMovimiento, ScrollTrigger } from "@/lib/gsap";

let lenis: Lenis | null = null;

/** Instancia activa de Lenis (null con movimiento reducido o antes de montar). */
export const getLenis = () => lenis;

/** Bloquea o libera el scroll (preloader, menú móvil). */
export function bloquearScroll(bloqueado: boolean) {
  if (lenis) {
    if (bloqueado) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = bloqueado ? "hidden" : "";
}

/**
 * Scroll suave global. Lenis no lleva su propio bucle: lo conduce el ticker de
 * GSAP para que scroll y ScrollTrigger avancen en el mismo frame.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefiereMenosMovimiento()) return;

    const instancia = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      anchors: true,
      autoRaf: false,
    });
    const tick = (tiempo: number) => instancia.raf(tiempo * 1000);

    instancia.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis = instancia;

    return () => {
      gsap.ticker.remove(tick);
      instancia.destroy();
      lenis = null;
    };
  }, []);

  return children;
}

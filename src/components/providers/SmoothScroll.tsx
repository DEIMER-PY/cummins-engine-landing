"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, prefiereMenosMovimiento, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/** Instancia de Lenis (null con movimiento reducido o antes de montar). */
export const useLenis = () => useContext(LenisContext);

/**
 * Scroll suave global. Lenis no lleva su propio bucle: lo conduce el ticker de
 * GSAP para que scroll y ScrollTrigger avancen en el mismo frame.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

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
    setLenis(instancia);

    return () => {
      gsap.ticker.remove(tick);
      instancia.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

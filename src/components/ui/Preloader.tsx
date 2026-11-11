"use client";

import { useRef } from "react";
import { bloquearScroll } from "@/components/providers/SmoothScroll";
import { secuencias } from "@/data/sections";
import { gsap, prefiereMenosMovimiento, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getSequence } from "@/lib/sequence";
import { useUi } from "@/store/scene";

/**
 * Arranque: el contador sube como un motor cogiendo vueltas mientras llega la
 * primera pasada de frames del hero. Al terminar, la cortina sube y `listo`
 * dispara la coreografía de entrada.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const numero = useRef<HTMLSpanElement>(null);
  const setListo = useUi((s) => s.setListo);

  useGSAP(
    () => {
      const cortina = ref.current!;
      const cuenta = { v: 0 };
      const pintar = () => {
        if (numero.current) numero.current.textContent = String(Math.round(cuenta.v));
      };

      window.scrollTo(0, 0);
      bloquearScroll(true);

      const carga = getSequence(secuencias.bloque).load();
      const rapido = prefiereMenosMovimiento();

      // Sube solo hasta 88 y espera ahí a que los frames estén de verdad.
      const subida = gsap.to(cuenta, {
        v: 88,
        duration: rapido ? 0.2 : 1.8,
        ease: "power2.out",
        onUpdate: pintar,
      });

      void Promise.all([carga.catch(() => undefined), subida.then()]).then(() => {
        gsap
          .timeline({
            onComplete: () => {
              cortina.hidden = true;
            },
          })
          .to(cuenta, { v: 100, duration: 0.35, ease: "power1.in", onUpdate: pintar })
          .add(() => {
            // Con el scroll bloqueado el documento no mide bien: se libera y
            // se recalculan los triggers antes de descubrir la página.
            bloquearScroll(false);
            ScrollTrigger.refresh();
            setListo();
          }, "+=0.1")
          .to(cortina, {
            clipPath: "inset(0 0 100% 0)",
            duration: rapido ? 0.01 : 1,
            ease: "expo.inOut",
          });
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      role="status"
      aria-label="Cargando"
      className="bg-carter fixed inset-0 z-[60] flex flex-col justify-between p-5 sm:p-8"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <p className="text-acero max-w-[22ch] text-[0.95rem] leading-snug">
        Calentando 60 litros de diésel. Esto tarda un momento.
      </p>
      <p className="font-display text-monumental cifra leading-[0.8] font-black">
        <span ref={numero}>0</span>
        <span className="text-rojo">%</span>
      </p>
    </div>
  );
}

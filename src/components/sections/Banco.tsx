"use client";

import { useRef } from "react";
import { gsap, motion, useGSAP } from "@/lib/gsap";
import { getSequence } from "@/lib/sequence";
import { scene } from "@/store/scene";

/** Banco de pruebas del canvas: scrub de la secuencia sintética + efectos. */
export function Banco() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const seq = getSequence("prueba");
      scene.seqA = "prueba";
      void seq.load().then(() => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "+=300%",
              pin: true,
              anticipatePin: 1,
              scrub: motion.scrub,
            },
            defaults: { ease: "none" },
          })
          .to(scene, { frameA: seq.count - 1, duration: 3 }, 0)
          .to(scene, { lens: 1, duration: 0.5 }, 0.5)
          .to(scene, { heat: 1, duration: 0.5 }, 1.5)
          .to(scene, { heat: 0, lens: 0, glow: 1, duration: 0.5 }, 2.2);
      });
    },
    { scope: ref },
  );

  return (
    <>
      <section ref={ref} className="grid h-dvh place-items-center">
        <h1 className="text-titulo">Banco de pruebas</h1>
      </section>
      <section className="h-dvh" />
    </>
  );
}

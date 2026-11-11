"use client";

import { useRef } from "react";
import { cifras, engine, formato } from "@/data/engine";
import { secuencias } from "@/data/sections";
import { gsap, motion, prefiereMenosMovimiento, SplitText, useGSAP } from "@/lib/gsap";
import { getSequence } from "@/lib/sequence";
import { scene, useUi } from "@/store/scene";

/**
 * Hero: el bloque completo orbitando en penumbra.
 * Entrada (única coreografía automática de la página): titular por líneas y
 * cifras que cuentan. Después el scroll hace girar el motor y retira el texto.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const listo = useUi((s) => s.listo);

  // Scroll: órbita del motor y salida del texto.
  useGSAP(
    () => {
      const seq = getSequence(secuencias.bloque);
      scene.seqA = secuencias.bloque;
      if (prefiereMenosMovimiento()) return;

      void seq.load();

      // El timeline se crea de forma síncrona (dentro del contexto de useGSAP,
      // para que se limpie bien) y anima un progreso 0–1; el número real de
      // frames se lee en cada actualización, cuando el manifest ya ha llegado.
      const orbita = { p: 0 };
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-pin]",
            start: "top top",
            end: "+=220%",
            pin: true,
            anticipatePin: 1,
            scrub: motion.scrub,
          },
          defaults: { ease: "none" },
        })
        .to(
          orbita,
          {
            p: 1,
            duration: 1,
            onUpdate: () => {
              scene.frameA = orbita.p * Math.max(0, seq.count - 1);
            },
          },
          0,
        )
        .to(scene, { zoom: 1.08, duration: 1 }, 0)
        .to("[data-titular]", { yPercent: -35, autoAlpha: 0, duration: 0.3 }, 0.08)
        .to("[data-cifras]", { autoAlpha: 0, y: 40, duration: 0.25 }, 0.55)
        .to("[data-pista]", { autoAlpha: 0, duration: 0.08 }, 0);
    },
    { scope: ref },
  );

  // Entrada: se dispara cuando el preloader termina.
  useGSAP(
    () => {
      if (!listo || prefiereMenosMovimiento()) return;

      const titulo = ref.current!.querySelector<HTMLElement>("h1")!;
      const split = SplitText.create(titulo, {
        type: "lines",
        mask: "lines",
        linesClass: "linea",
      });
      const tl = gsap.timeline({ delay: 0.35 });

      tl.from(scene, { dim: 1, zoom: 1.18, duration: 2.2, ease: motion.ease.pesado }, 0)
        .from(
          split.lines,
          {
            yPercent: 108,
            duration: 1.25,
            ease: motion.ease.pesado,
            stagger: motion.stagger.linea,
          },
          0.25,
        )
        .from(
          "[data-entrada]",
          { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.08 },
          0.9,
        );

      gsap.utils.toArray<HTMLElement>("[data-cifra]").forEach((el, i) => {
        const fin = Number(el.dataset.cifra);
        const cuenta = { v: 0 };
        tl.to(
          cuenta,
          {
            v: fin,
            duration: 1.6,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = formato.format(Math.round(cuenta.v));
            },
          },
          0.9 + i * 0.08,
        );
      });
    },
    { scope: ref, dependencies: [listo] },
  );

  return (
    <section ref={ref} id="bloque" aria-labelledby="titulo-hero">
      <div
        data-pin
        className="relative flex h-dvh flex-col justify-end overflow-hidden px-4 pb-6 sm:px-8 sm:pb-8"
      >
        {/* Sombra inferior para que el texto se lea sobre cualquier frame */}
        <div
          aria-hidden
          className="from-carter via-carter/55 pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent"
        />

        <div data-titular className="relative">
          <p data-entrada className="text-entrada mb-3 font-medium">
            {engine.marca} {engine.modelo}, diésel {engine.configuracion} para minería
          </p>
          <h1 id="titulo-hero" className="text-titulo max-w-[13ch] uppercase">
            {engine.lema}
          </h1>
        </div>

        <div
          data-cifras
          className="border-beige/25 relative mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-5 sm:mt-12 sm:grid-cols-4"
        >
          {cifras.map(({ valor, unidad, etiqueta }) => (
            <p key={etiqueta} data-entrada className="flex flex-col">
              <span className="font-display cifra text-[clamp(2.2rem,1rem+3.6vw,4.2rem)] leading-none font-extrabold">
                <span data-cifra={valor}>{formato.format(valor)}</span>
                <span className="text-rojo-vivo ml-1.5 text-[0.42em] font-bold">
                  {unidad}
                </span>
              </span>
              <span className="text-beige/65 text-dato mt-1.5">{etiqueta}</span>
            </p>
          ))}
        </div>

        <p
          data-pista
          data-entrada
          className="text-beige/65 text-dato absolute top-24 right-4 hidden items-center gap-3 sm:right-8 md:flex"
        >
          Desliza para girar el motor
          <span
            aria-hidden
            className="bg-beige/40 relative block h-12 w-px overflow-hidden"
          >
            <span className="bg-rojo-vivo absolute inset-x-0 top-0 h-1/3 animate-[caer_1.8s_ease-in-out_infinite]" />
          </span>
        </p>
      </div>
    </section>
  );
}

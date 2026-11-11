"use client";

import { useRef } from "react";
import { getLenis } from "@/components/providers/SmoothScroll";
import { engine, formato, gama } from "@/data/engine";
import { secciones } from "@/data/sections";
import { gsap, prefiereMenosMovimiento, useGSAP } from "@/lib/gsap";

const placa = [
  ["Modelo", engine.modelo],
  ["Configuración", `${engine.configuracion}, ${engine.ciclo.toLowerCase()}`],
  ["Cilindrada", `${engine.cilindradaL} L`],
  ["Diámetro × carrera", `${engine.diametroMm} × ${engine.carreraMm} mm`],
  [
    "Potencia máxima",
    `${formato.format(engine.potenciaHp)} hp (${formato.format(engine.potenciaKw)} kW)`,
  ],
  ["Par máximo", `${formato.format(engine.parNm)} N·m`],
  ["Peso en orden de marcha", `${formato.format(engine.pesoKg)} kg`],
  ["N.º de serie", "Concepto 0001"],
] as const;

const hechoCon = [
  ["GSAP", "https://gsap.com/"],
  ["Lenis", "https://lenis.dev/"],
  ["Next.js", "https://nextjs.org/"],
  ["Tailwind CSS", "https://tailwindcss.com/"],
] as const;

/**
 * Cierre de la página: llamada a la acción, la placa de datos del motor a tamaño
 * real, navegación completa y el nombre del modelo a escala monumental.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return;
      // El nombre del modelo emerge desde abajo según se llega al final.
      gsap.from("[data-monumental]", {
        yPercent: 45,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-monumental]",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    { scope: ref },
  );

  const subir = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 2.4 });
    else window.scrollTo({ top: 0 });
  };

  return (
    <footer
      ref={ref}
      id="contacto"
      className="bg-carter relative z-10 overflow-hidden px-4 pt-24 sm:px-8 sm:pt-36"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-20">
          <div>
            <h2 className="text-titulo uppercase">Ponlo a trabajar en tu mina</h2>
            <p className="text-entrada text-beige/75 mt-6 max-w-[38ch]">
              La ficha completa, las curvas de par y la red de distribuidores están en el
              sitio oficial de Cummins.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={engine.url}
                target="_blank"
                rel="noreferrer"
                className="bg-rojo hover:bg-rojo-vivo flex h-14 items-center rounded-sm px-7 text-lg font-semibold transition-colors duration-300"
              >
                Ver el QSK60 en cummins.com
              </a>
              <a
                href="#ficha"
                className="border-beige/35 hover:border-beige flex h-14 items-center rounded-sm border px-7 text-lg font-semibold transition-colors duration-300"
              >
                Repasar la ficha
              </a>
            </div>
          </div>

          <div className="placa p-6 sm:p-8">
            <span className="remache absolute top-2.5 left-2.5" />
            <span className="remache absolute top-2.5 right-2.5" />
            <span className="remache absolute bottom-2.5 left-2.5" />
            <span className="remache absolute right-2.5 bottom-2.5" />
            <p className="font-display border-carter/40 flex items-baseline justify-between border-b-2 pb-3 text-4xl leading-none font-black">
              {engine.marca}
              <span className="text-dato font-sans font-medium">
                Placa de datos del motor
              </span>
            </p>
            <dl className="mt-1 grid sm:grid-cols-2 sm:gap-x-8">
              {placa.map(([nombre, valor]) => (
                <div key={nombre} className="border-carter/20 border-b py-2.5">
                  <dt className="text-carter/65 text-[0.74rem] leading-tight">
                    {nombre}
                  </dt>
                  <dd className="cifra text-[1.05rem] leading-snug font-semibold">
                    {valor}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="border-fundicion mt-20 grid gap-10 border-t pt-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <p className="text-beige/65 max-w-[40ch] text-[0.95rem]">
            Proyecto conceptual no oficial, hecho para explorar animación con scroll. No
            tiene relación con Cummins Inc.; Cummins y QSK60 son marcas de su propietario.
            Las imágenes del motor están generadas con IA y las cifras son orientativas.
          </p>

          <nav aria-label="Recorrido">
            <h3 className="font-sans text-[0.95rem] leading-normal font-semibold tracking-normal">
              Recorrido
            </h3>
            <ul className="text-beige/70 mt-3 space-y-1.5">
              {secciones.map(({ id, nombre }) => (
                <li key={id}>
                  <a href={`#${id}`} className="hover:text-beige transition-colors">
                    {nombre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-sans text-[0.95rem] leading-normal font-semibold tracking-normal">
              Gama QSK
            </h3>
            <ul className="text-beige/70 cifra mt-3 space-y-1.5">
              {gama.map(({ modelo, litros }) => (
                <li
                  key={modelo}
                  className={`flex justify-between gap-4 ${modelo === engine.modelo ? "text-rojo-vivo font-semibold" : ""}`}
                >
                  {modelo}
                  <span>{litros} L</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[0.95rem] leading-normal font-semibold tracking-normal">
              Hecho con
            </h3>
            <ul className="text-beige/70 mt-3 space-y-1.5">
              {hechoCon.map(([nombre, url]) => (
                <li key={nombre}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-beige transition-colors"
                  >
                    {nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-beige/60 text-dato mt-14 flex items-center justify-between gap-4">
          <p>2026, concepto de landing del {engine.modelo}</p>
          <button
            type="button"
            onClick={subir}
            className="border-beige/35 hover:border-beige hover:text-beige flex h-10 items-center rounded-sm border px-4 transition-colors"
          >
            Volver arriba
          </button>
        </div>
      </div>

      <p
        data-monumental
        aria-hidden
        className="font-display text-fundicion pointer-events-none -mb-[0.2em] text-center text-[clamp(7rem,31vw,34rem)] leading-[0.8] font-black tracking-tight whitespace-nowrap select-none"
      >
        {engine.modelo}
      </p>
    </footer>
  );
}

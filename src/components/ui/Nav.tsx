"use client";

import { useEffect, useRef, useState } from "react";
import { bloquearScroll } from "@/components/providers/SmoothScroll";
import { engine } from "@/data/engine";
import { secciones, type SeccionId } from "@/data/sections";
import { gsap, useGSAP } from "@/lib/gsap";

const MARCAS = 14;
const RALENTI = 650;
const CORTE = 2100;

/**
 * Barra de navegación construida como la placa de datos del motor.
 * Incluye un tacómetro que traduce la velocidad de scroll a rpm y una línea
 * de progreso del recorrido. Se esconde al bajar y vuelve al subir.
 */
export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const rpmRef = useRef<HTMLSpanElement>(null);
  const [activa, setActiva] = useState<SeccionId | null>(null);
  const [abierto, setAbierto] = useState(false);

  useGSAP(
    () => {
      const barra = ref.current!;
      const marcas = gsap.utils.toArray<HTMLElement>("[data-marca]", barra);
      const progreso = barra.querySelector<HTMLElement>("[data-progreso]")!;
      let rpm = RALENTI;
      let oculto = false;
      let ultimaActiva = 0;
      let yTick = window.scrollY;

      const mostrar = gsap.quickTo(barra, "yPercent", {
        duration: 0.5,
        ease: "power3.out",
      });

      const tick = (tiempo: number) => {
        const y = window.scrollY;
        const velocidad = Math.abs(y - yTick) * 60;
        yTick = y;
        const objetivo = RALENTI + Math.min(velocidad / 4200, 1) * (CORTE - RALENTI);
        rpm += (objetivo - rpm) * (objetivo > rpm ? 0.16 : 0.045);

        if (rpmRef.current) {
          rpmRef.current.textContent = String(Math.round(rpm / 10) * 10);
        }
        const encendidas = ((rpm - RALENTI) / (CORTE - RALENTI)) * MARCAS;
        marcas.forEach((marca, i) => {
          marca.style.opacity = i < encendidas ? "1" : "0.22";
        });

        const max = document.documentElement.scrollHeight - window.innerHeight;
        progreso.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;

        // Sección activa: basta comprobarlo unas veces por segundo.
        if (tiempo - ultimaActiva > 0.2) {
          ultimaActiva = tiempo;
          const centro = window.innerHeight / 2;
          let encontrada: SeccionId | null = null;
          for (const { id } of secciones) {
            const rect = document.getElementById(id)?.getBoundingClientRect();
            if (rect && rect.top <= centro && rect.bottom > centro) encontrada = id;
          }
          setActiva(encontrada);
        }
      };

      let anterior = window.scrollY;
      const alScroll = () => {
        const y = window.scrollY;
        const bajando = y > anterior && y > 160;
        anterior = y;
        if (bajando !== oculto) {
          oculto = bajando;
          mostrar(bajando ? -130 : 0);
        }
      };

      gsap.ticker.add(tick);
      window.addEventListener("scroll", alScroll, { passive: true });
      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("scroll", alScroll);
      };
    },
    { scope: ref },
  );

  useEffect(() => {
    bloquearScroll(abierto);
    if (!abierto) return;
    const cerrar = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", cerrar);
    return () => window.removeEventListener("keydown", cerrar);
  }, [abierto]);

  return (
    <>
      <header ref={ref} className="fixed inset-x-0 top-0 z-50 p-2 sm:p-3">
        <div className="placa mx-auto flex h-14 max-w-[1500px] items-center gap-4 overflow-hidden pr-2 pl-5 sm:gap-7">
          <span className="remache absolute top-1.5 left-1.5" />
          <span className="remache absolute bottom-1.5 left-1.5" />
          <span className="remache absolute top-1.5 right-1.5" />
          <span className="remache absolute right-1.5 bottom-1.5" />

          <a
            href="#bloque"
            className="font-display flex items-baseline gap-2 text-[1.7rem] leading-none font-black tracking-tight"
            aria-label={`${engine.marca} ${engine.modelo}, ir al inicio`}
          >
            {engine.marca}
            <span className="text-rojo">{engine.modelo}</span>
          </a>

          <nav aria-label="Secciones" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {secciones.map(({ id, nombre }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={activa === id ? "true" : undefined}
                    className="aria-[current]:bg-carter aria-[current]:text-beige hover:bg-carter/10 rounded-sm px-3 py-1.5 text-[0.9rem] font-medium transition-colors duration-300"
                  >
                    {nombre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className="border-carter/25 ml-auto hidden items-center gap-3 border-l pl-5 md:flex lg:ml-0"
            aria-hidden
          >
            <div className="flex h-5 items-end gap-[3px]">
              {Array.from({ length: MARCAS }, (_, i) => (
                <span
                  key={i}
                  data-marca
                  className={`w-[3px] rounded-[1px] ${i >= MARCAS - 3 ? "bg-rojo" : "bg-carter"}`}
                  style={{ height: `${38 + (i / (MARCAS - 1)) * 62}%`, opacity: 0.22 }}
                />
              ))}
            </div>
            <p className="cifra w-[5.2rem] text-[0.95rem] leading-none font-semibold">
              <span ref={rpmRef}>{RALENTI}</span>
              <span className="text-carter/60 ml-1 text-[0.72rem] font-medium">rpm</span>
            </p>
          </div>

          <a
            href="#contacto"
            className="bg-rojo text-beige hover:bg-carter ml-auto hidden h-10 items-center rounded-sm px-5 text-[0.9rem] font-semibold transition-colors duration-300 sm:flex md:ml-0"
          >
            Pedir ficha técnica
          </a>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            className="bg-carter text-beige ml-auto grid size-10 place-items-center rounded-sm sm:ml-0 lg:hidden"
          >
            <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
            <span aria-hidden className="relative block h-3 w-5">
              <span
                className={`absolute inset-x-0 top-0 h-0.5 bg-current transition-transform duration-300 ${abierto ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-current transition-transform duration-300 ${abierto ? "-translate-y-[5px] -rotate-45" : ""}`}
              />
            </span>
          </button>

          <span
            data-progreso
            className="bg-rojo absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0"
          />
        </div>
      </header>

      <div
        id="menu-movil"
        hidden={!abierto}
        className="bg-carter fixed inset-0 z-40 flex flex-col justify-between px-5 pt-28 pb-8 lg:hidden"
      >
        <ul>
          {secciones.map(({ id, nombre }, i) => (
            <li key={id} className="border-fundicion border-b">
              <a
                href={`#${id}`}
                onClick={() => setAbierto(false)}
                className="font-display flex items-baseline justify-between py-3 text-[clamp(2.4rem,11vw,4rem)] leading-none font-extrabold"
              >
                {nombre}
                <span className="cifra text-acero font-sans text-base font-normal">
                  {i + 1}/{secciones.length}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contacto"
          onClick={() => setAbierto(false)}
          className="bg-rojo text-beige flex h-14 items-center justify-center rounded-sm text-lg font-semibold"
        >
          Pedir ficha técnica
        </a>
      </div>
    </>
  );
}

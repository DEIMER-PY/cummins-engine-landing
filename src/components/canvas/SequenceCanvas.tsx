"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { getSequence } from "@/lib/sequence";
import { crearRenderer } from "@/lib/webgl/renderer";
import { scene } from "@/store/scene";

/**
 * Canvas único y fijo detrás de todo el contenido. Las secciones no dibujan:
 * solo escriben en `scene` (con tweens de GSAP) y este componente lo pinta
 * una vez por frame desde el ticker.
 */
export function SequenceCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const renderer = crearRenderer(canvas);
    const mouse = { x: 0.5, y: 0.5 };

    const ajustar = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        window.innerWidth <= 820 ? 1.5 : 2,
      );
      renderer.resize(
        Math.round(canvas.clientWidth * dpr),
        Math.round(canvas.clientHeight * dpr),
      );
    };
    const mover = (e: PointerEvent) => {
      scene.mouseX = e.clientX / window.innerWidth;
      scene.mouseY = e.clientY / window.innerHeight;
    };

    const pintar = (tiempo: number) => {
      // El cursor llega con inercia: la lente "pesa".
      mouse.x += (scene.mouseX - mouse.x) * 0.12;
      mouse.y += (scene.mouseY - mouse.y) * 0.12;

      const a = scene.seqA ? getSequence(scene.seqA) : null;
      const b = scene.seqB ? getSequence(scene.seqB) : null;

      renderer.draw({
        a: a?.nearest(scene.frameA) ?? null,
        b: b?.nearest(scene.frameB) ?? null,
        sizeA: a?.size ?? [16, 9],
        sizeB: b?.size ?? [16, 9],
        mix: scene.mix,
        heat: scene.heat,
        lens: scene.lens,
        glow: scene.glow,
        dim: scene.dim,
        zoom: scene.zoom,
        mouse: [mouse.x, mouse.y],
        time: tiempo,
      });
    };

    ajustar();
    window.addEventListener("resize", ajustar);
    window.addEventListener("pointermove", mover, { passive: true });
    gsap.ticker.add(pintar);

    return () => {
      window.removeEventListener("resize", ajustar);
      window.removeEventListener("pointermove", mover);
      gsap.ticker.remove(pintar);
      renderer.destroy();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-lvh w-full"
    />
  );
}

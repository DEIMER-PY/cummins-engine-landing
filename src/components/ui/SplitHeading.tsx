"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, motion, prefiereMenosMovimiento, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "scroll": se revela al entrar en pantalla. "manual": lo dispara el padre. */
  modo?: "scroll" | "manual";
  retraso?: number;
};

/**
 * Titular que sube línea a línea desde detrás de una máscara.
 * El texto permanece en el DOM y es legible sin JS.
 */
export function SplitHeading({
  as: Tag = "h2",
  children,
  className,
  modo = "scroll",
  retraso = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefiereMenosMovimiento()) return;

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (split) =>
          gsap.from(split.lines, {
            yPercent: 105,
            duration: motion.reveal,
            ease: motion.ease.pesado,
            stagger: motion.stagger.linea,
            delay: retraso,
            paused: modo === "manual",
            scrollTrigger:
              modo === "scroll"
                ? { trigger: el, start: motion.inicioReveal, once: true }
                : undefined,
          }),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

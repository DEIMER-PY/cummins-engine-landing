import { create } from "zustand";

/**
 * Estado de la escena que lee el canvas en cada frame.
 * Es un objeto mutable (no estado de React) a propósito: los tweens de GSAP
 * escriben aquí 60 veces por segundo y no debe provocar renders.
 */
export const scene = {
  /** Secuencia visible y su frame (fraccionario; el renderer redondea). */
  seqA: "",
  frameA: 0,
  /** Segunda secuencia para fundidos entre secciones. mix: 0 = A, 1 = B. */
  seqB: "",
  frameB: 0,
  mix: 0,

  /** 0–1: visión térmica en todo el encuadre. */
  heat: 0,
  /** 0–1: intensidad de la lente térmica que sigue al cursor. */
  lens: 0,
  /** 0–1: brillo cálido de combustión. */
  glow: 0,
  /** 0–1: oscurecido para dar legibilidad al texto superpuesto. */
  dim: 0,
  /** Escala del encuadre (parallax suave). */
  zoom: 1,

  mouseX: 0.5,
  mouseY: 0.5,
};

export type Scene = typeof scene;

export type Modo = "eco" | "peak";

/** Estado de interfaz que sí debe re-renderizar React. */
export const useUi = create<{
  modo: Modo;
  listo: boolean;
  setModo: (modo: Modo) => void;
  setListo: () => void;
}>((set) => ({
  modo: "eco",
  listo: false,
  setModo: (modo) => set({ modo }),
  setListo: () => set({ listo: true }),
}));

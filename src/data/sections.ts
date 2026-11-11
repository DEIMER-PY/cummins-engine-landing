/** Secciones del recorrido, en orden de página. `id` es el ancla del nav. */
export const secciones = [
  { id: "bloque", nombre: "Bloque" },
  { id: "despiece", nombre: "Despiece" },
  { id: "termica", nombre: "Térmica" },
  { id: "combustion", nombre: "Combustión" },
  { id: "campo", nombre: "En campo" },
  { id: "ficha", nombre: "Ficha" },
] as const;

export type SeccionId = (typeof secciones)[number]["id"];

/**
 * Secuencia de frames de cada escena (carpeta en public/sequences).
 * Mientras no existan los assets definitivos apuntan a la secuencia sintética.
 */
export const secuencias = {
  bloque: "prueba",
  despiece: "prueba",
  combustion: "prueba",
  campo: "prueba",
} as const;

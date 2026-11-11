/**
 * Ficha del Cummins QSK60 para minería.
 * Cifras tomadas de las hojas de especificaciones públicas de Cummins (versión
 * Tier 4 Final de mayor potencia). Son orientativas: este sitio es un concepto.
 */
export const engine = {
  marca: "Cummins",
  modelo: "QSK60",
  lema: "60 litros para mover montañas",
  configuracion: "V16",
  cilindros: 16,
  cilindradaL: 60,
  diametroMm: 159,
  carreraMm: 190,
  potenciaHp: 2850,
  potenciaKw: 2125,
  parNm: 11218,
  pesoKg: 9616,
  aspiracion: "Turbo de dos etapas con posenfriado",
  combustible: "Common rail modular de alta presión (MCRS)",
  ciclo: "Diésel de 4 tiempos",
  url: "https://www.cummins.com/engines/qsk60",
} as const;

/** Cifras protagonistas del hero. */
export const cifras = [
  { valor: engine.potenciaHp, unidad: "hp", etiqueta: "Potencia máxima" },
  { valor: engine.parNm, unidad: "N·m", etiqueta: "Par máximo" },
  { valor: engine.cilindradaL, unidad: "L", etiqueta: "Cilindrada" },
  { valor: engine.cilindros, unidad: "cil.", etiqueta: "En V" },
] as const;

/** Gama QSK de alta potencia (cilindrada aproximada en litros). */
export const gama = [
  { modelo: "QSK19", litros: 19 },
  { modelo: "QSK38", litros: 38 },
  { modelo: "QSK50", litros: 50 },
  { modelo: "QSK60", litros: 60 },
  { modelo: "QSK78", litros: 78 },
  { modelo: "QSK95", litros: 95 },
] as const;

export const formato = new Intl.NumberFormat("es-ES", { useGrouping: "always" });

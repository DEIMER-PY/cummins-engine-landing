export type Manifest = {
  name: string;
  fps: number;
  pad: number;
  ext: string;
  count: number;
  variants: Record<
    "desktop" | "mobile",
    { width: number; height: number; bytes: number }
  >;
};

type Oyente = (cargados: number, total: number) => void;

const CONCURRENCIA = 6;

/**
 * Secuencia de frames con carga progresiva.
 * Primero baja 1 de cada 8 frames (el scrub ya funciona, a saltos), después va
 * rellenando huecos (1/4, 1/2, todos). Mientras falte un frame se usa el más cercano.
 */
export class Sequence {
  readonly name: string;
  manifest: Manifest | null = null;
  frames: (ImageBitmap | null)[] = [];
  cargados = 0;

  private variante: "desktop" | "mobile" = "desktop";
  private promesa: Promise<void> | null = null;
  private oyentes = new Set<Oyente>();

  constructor(name: string) {
    this.name = name;
  }

  get count() {
    return this.manifest?.count ?? 0;
  }

  get size() {
    const v = this.manifest?.variants[this.variante];
    return v ? ([v.width, v.height] as const) : ([16, 9] as const);
  }

  onProgress(fn: Oyente) {
    this.oyentes.add(fn);
    return () => void this.oyentes.delete(fn);
  }

  /** Resuelve cuando la primera pasada (1/8) está lista; el resto sigue en segundo plano. */
  load(): Promise<void> {
    this.promesa ??= this.iniciar();
    return this.promesa;
  }

  /** Frame cargado más cercano al índice pedido. */
  nearest(indice: number): ImageBitmap | null {
    const n = this.frames.length;
    if (!n) return null;
    const i = Math.max(0, Math.min(n - 1, Math.round(indice)));
    for (let d = 0; d < n; d++) {
      const a = this.frames[i - d];
      if (a) return a;
      const b = this.frames[i + d];
      if (b) return b;
    }
    return null;
  }

  private async iniciar() {
    const base = `/sequences/${this.name}`;
    const manifest: Manifest = await (await fetch(`${base}/manifest.json`)).json();
    this.manifest = manifest;
    this.variante = window.innerWidth <= 820 ? "mobile" : "desktop";
    this.frames = new Array(manifest.count).fill(null);

    const url = (i: number) =>
      `${base}/${this.variante}/${String(i + 1).padStart(manifest.pad, "0")}.${manifest.ext}`;

    const pasadas: number[][] = [];
    const vistos = new Set<number>();
    for (const paso of [8, 4, 2, 1]) {
      const pasada: number[] = [];
      for (let i = 0; i < manifest.count; i += paso) {
        if (!vistos.has(i)) {
          vistos.add(i);
          pasada.push(i);
        }
      }
      pasadas.push(pasada);
    }

    const bajar = async (cola: number[]) => {
      const pendientes = [...cola];
      const trabajador = async () => {
        while (pendientes.length) {
          const i = pendientes.shift()!;
          try {
            const blob = await (await fetch(url(i))).blob();
            this.frames[i] = await createImageBitmap(blob);
          } catch {
            // Un frame perdido no rompe nada: nearest() usa el vecino.
          }
          this.cargados++;
          this.oyentes.forEach((fn) => fn(this.cargados, manifest.count));
        }
      };
      await Promise.all(Array.from({ length: CONCURRENCIA }, trabajador));
    };

    await bajar(pasadas[0]);
    void (async () => {
      for (const pasada of pasadas.slice(1)) await bajar(pasada);
    })();
  }
}

const registro = new Map<string, Sequence>();

export function getSequence(name: string) {
  let seq = registro.get(name);
  if (!seq) {
    seq = new Sequence(name);
    registro.set(name, seq);
  }
  return seq;
}

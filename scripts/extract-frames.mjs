#!/usr/bin/env node
/**
 * Convierte un vídeo en una secuencia de frames WebP lista para scroll.
 *
 *   pnpm frames <video> <nombre> [--fps 24] [--crop 0.04] [--from 0] [--to 8] [--q 74]
 *
 * Salida: public/sequences/<nombre>/{desktop,mobile}/0001.webp … + manifest.json
 *   --crop  fracción recortada por cada borde (elimina marcas de agua y bordes sucios)
 *   --from / --to  segundos de inicio y fin dentro del clip
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const [, , entrada, nombre, ...resto] = process.argv;
if (!entrada || !nombre) {
  console.error(
    "Uso: pnpm frames <video> <nombre> [--fps 24] [--crop 0.04] [--from 0] [--to 8] [--q 74]",
  );
  process.exit(1);
}

const opcion = (clave, porDefecto) => {
  const i = resto.indexOf(`--${clave}`);
  return i >= 0 ? Number(resto[i + 1]) : porDefecto;
};
const fps = opcion("fps", 24);
const crop = opcion("crop", 0);
const desde = opcion("from", 0);
const hasta = opcion("to", 0);
const calidad = opcion("q", 74);

const VARIANTES = { desktop: 1600, mobile: 900 };
const base = resolve("public/sequences", nombre);
rmSync(base, { recursive: true, force: true });

const manifest = { name: nombre, fps, pad: 4, ext: "webp", count: 0, variants: {} };

for (const [variante, ancho] of Object.entries(VARIANTES)) {
  const dir = join(base, variante);
  mkdirSync(dir, { recursive: true });

  const filtros = [
    crop > 0 && `crop=iw*${1 - crop * 2}:ih*${1 - crop * 2}`,
    `fps=${fps}`,
    `scale=${ancho}:-2:flags=lanczos`,
  ].filter(Boolean);

  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      ...(desde ? ["-ss", String(desde)] : []),
      ...(hasta ? ["-to", String(hasta)] : []),
      "-i",
      entrada,
      "-vf",
      filtros.join(","),
      "-c:v",
      "libwebp",
      "-quality",
      String(calidad),
      "-compression_level",
      "6",
      "-start_number",
      "1",
      join(dir, "%04d.webp"),
    ],
    { stdio: "inherit" },
  );

  const archivos = readdirSync(dir).filter((f) => f.endsWith(".webp"));
  const bytes = archivos.reduce((t, f) => t + statSync(join(dir, f)).size, 0);
  const dims = execFileSync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height",
    "-of",
    "csv=p=0",
    join(dir, archivos[0]),
  ])
    .toString()
    .trim()
    .split(",")
    .map(Number);

  manifest.count = archivos.length;
  manifest.variants[variante] = { width: dims[0], height: dims[1], bytes };
  console.log(
    `${nombre}/${variante}: ${archivos.length} frames, ${(bytes / 1e6).toFixed(1)} MB`,
  );
}

writeFileSync(join(base, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

# Pipeline de assets

```
Gemini (keyframe)  →  Gemini/Veo (clip 8 s)  →  ffmpeg (frames WebP)  →  public/sequences/<nombre>/
```

1. **Keyframe maestro** con el generador de imágenes de Gemini (16:9, fondo negro, luz lateral).
   Las variantes se piden adjuntando el maestro como referencia para mantener el mismo motor.
2. **Clip** imagen→vídeo con el keyframe como primer frame y un movimiento de cámara lento
   y continuo. Generar frames sueltos uno a uno no sirve: no son coherentes y el motor parpadea.
3. **Extracción**: los originales van a `assets-src/` (ignorado por git) y se convierten con

   ```bash
   pnpm frames assets-src/hero.mp4 hero --fps 24 --crop 0.04
   ```

   | Opción            | Por defecto   | Para qué                                                    |
   | ----------------- | ------------- | ----------------------------------------------------------- |
   | `--fps`           | 24            | Frames por segundo extraídos                                |
   | `--crop`          | 0             | Fracción recortada por borde (marca de agua, bordes sucios) |
   | `--from` / `--to` | clip completo | Tramo en segundos                                           |
   | `--q`             | 74            | Calidad WebP                                                |

   Resultado: `desktop/` (1600 px) y `mobile/` (900 px) con `0001.webp…` y un `manifest.json`
   (`count`, `pad`, dimensiones y peso por variante) que consume el cargador del cliente.

Los prompts exactos de cada asset están en [prompts.md](prompts.md). La secuencia `prueba`
es un degradado sintético para desarrollar el canvas sin depender de los assets finales.

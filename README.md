# Cummins QSK60 — landing cinematográfica

Recorrido interactivo por un motor diésel de minería, controlado por scroll: secuencias de
frames sobre canvas WebGL, GSAP ScrollTrigger y scroll suave con Lenis.

> Proyecto conceptual de pruebas, **no oficial** y sin relación con Cummins Inc.

## Stack

| Capa      | Herramienta                                                      |
| --------- | ---------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, export estático) + React 19 + TypeScript |
| Estilos   | Tailwind CSS v4 (tokens en `src/app/globals.css`)                |
| Animación | GSAP 3 (ScrollTrigger, SplitText) + `@gsap/react`                |
| Scroll    | Lenis, sincronizado con el ticker de GSAP                        |
| Render    | WebGL2 propio (sin Three.js) con fallback a Canvas 2D            |
| Assets    | Keyframes y clips generados con Gemini → frames WebP con ffmpeg  |

## Puesta en marcha

Requisitos: Node 20+, pnpm, y ffmpeg solo si vas a regenerar frames.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # genera ./out (estático)
pnpm preview    # sirve ./out
pnpm lint
pnpm format
pnpm frames     # mp4 de assets-src/ → public/sequences/ (ver docs/asset-pipeline.md)
```

## Documentación

- [Arquitectura](docs/architecture.md)
- [Sistema de diseño](docs/design-system.md)
- [Sistema de motion](docs/motion-system.md)
- [Pipeline de assets](docs/asset-pipeline.md)
- [Prompts de generación](docs/prompts.md)
- [Flujo de trabajo y convenciones](docs/contributing.md)

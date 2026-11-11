# Arquitectura

```
scroll (Lenis) ─► ScrollTrigger ─► tweens de GSAP ─► scene (objeto mutable)
                                                          │
                              gsap.ticker ─► SequenceCanvas ─► Renderer WebGL2 ─► <canvas> fijo
```

## Piezas

| Archivo                                     | Responsabilidad                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `src/lib/gsap.ts`                           | Registro único de plugins y tokens de motion                                        |
| `src/components/providers/SmoothScroll.tsx` | Lenis conducido por el ticker de GSAP                                               |
| `src/lib/sequence.ts`                       | Carga progresiva de frames y registro de secuencias                                 |
| `src/store/scene.ts`                        | `scene`: estado mutable que pinta el canvas. `useUi`: estado de React (modo, carga) |
| `src/lib/webgl/shaders.ts`                  | Vertex y fragment shader (GLSL ES 3.0)                                              |
| `src/lib/webgl/renderer.ts`                 | Renderer WebGL2 y fallback Canvas 2D                                                |
| `src/components/canvas/SequenceCanvas.tsx`  | Canvas fijo; un draw por frame                                                      |
| `src/components/sections/*`                 | Cada sección anima `scene` con su propio ScrollTrigger                              |

## Por qué un único canvas

Todas las secciones comparten un `<canvas>` fijo detrás del contenido. Las secciones **no
dibujan**: escriben valores en `scene` (frame actual, calor, lente, brillo…) mediante tweens
con `scrub`, y `SequenceCanvas` pinta una vez por frame desde `gsap.ticker`. Así:

- no hay renders de React durante el scroll;
- las transiciones entre secciones son fundidos dentro del shader (`seqA` → `seqB` con `mix`);
- solo existe un contexto WebGL.

## Carga progresiva

`Sequence.load()` baja primero 1 de cada 8 frames y resuelve; el resto se rellena en segundo
plano (1/4, 1/2, todos) con 6 descargas en paralelo. `nearest(i)` devuelve el frame cargado
más próximo, de modo que el scrub funciona desde el primer momento y gana fluidez al completarse.
En pantallas de hasta 820 px se usa la variante `mobile`.

## Shader

Un triángulo a pantalla completa y un fragment shader con estos uniforms:

| Uniform            | Origen en `scene`     | Efecto                                          |
| ------------------ | --------------------- | ----------------------------------------------- |
| `uA`, `uB`, `uMix` | `seqA`, `seqB`, `mix` | Frame actual y fundido con barrido de ruido     |
| `uHeat`            | `heat`                | Visión térmica en todo el encuadre              |
| `uLens`, `uMouse`  | `lens`, `mouseX/Y`    | Lente térmica que sigue al cursor (con inercia) |
| `uGlow`            | `glow`                | Brillo pulsante de combustión                   |
| `uDim`             | `dim`                 | Oscurecido para legibilidad del texto           |
| `uZoom`            | `zoom`                | Escala del encuadre                             |

La térmica mapea la luminancia a una paleta de cámara termográfica y refuerza aristas con un
gradiente de luminancia. El acabado añade viñeta y grano. La textura solo se sube a la GPU
cuando cambia el frame. Sin WebGL2 se cae a Canvas 2D (sin efectos).

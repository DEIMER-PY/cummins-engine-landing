# Sistema de motion

## Núcleo

- `src/lib/gsap.ts` registra los plugins **una sola vez** y exporta `gsap`, `ScrollTrigger`,
  `SplitText`, `useGSAP` y los tokens `motion`. Ningún componente importa `gsap` directamente.
- `src/components/providers/SmoothScroll.tsx` crea Lenis con `autoRaf: false` y lo conduce
  desde `gsap.ticker` (`lagSmoothing(0)`); cada evento de scroll llama a `ScrollTrigger.update`.
  Así el scroll suave y los triggers avanzan en el mismo frame.

## Tokens

| Token         | Valor              | Uso                       |
| ------------- | ------------------ | ------------------------- |
| `ease.pesado` | `expo.out`         | Reveals de titulares      |
| `ease.out`    | `power3.out`       | UI general                |
| `ease.lineal` | `none`             | Todo lo que va con scrub  |
| `scrub`       | `0.9`              | Secuencias fijadas        |
| `reveal`      | `0.95 s`           | Duración de reveals       |
| `stagger`     | 0.05 / 0.11 / 0.08 | Palabra / línea / tarjeta |

Carácter: masa e inercia. Sin rebotes ni elásticos.

## Reglas

1. Todo dentro de `useGSAP` con `scope`; la limpieza es automática.
2. Nunca se anima el elemento fijado (`pin`), solo sus hijos. `anticipatePin: 1`.
3. Los triggers se crean en orden de página; `ScrollTrigger.refresh()` tras fuentes y frames.
4. Las animaciones con `scrub` usan `ease: "none"`; no se combinan con `toggleActions`.
5. Solo `transform`, `opacity` y `clip-path`.
6. Una sola coreografía de entrada (el hero). El resto del movimiento responde al scroll
   o al cursor; no hay "fade-up" decorativo en cada bloque.

## Movimiento reducido

Con `prefers-reduced-motion: reduce` no se instancia Lenis, no hay pins ni splits y las
secuencias muestran un keyframe fijo. El contenido es legible sin JavaScript.

@AGENTS.md

# Proyecto

Landing cinematográfica del motor Cummins QSK60 (concepto no oficial, repo privado).
Lee `docs/architecture.md`, `docs/design-system.md` y `docs/motion-system.md` antes de tocar UI.

- Flujo de git: `docs/contributing.md` (features → `develop`, commits convencionales, PR).
- Sin Three.js: el render es WebGL2 propio en `src/lib/webgl`.
- Todo GSAP dentro de `useGSAP` con scope; nunca animar el elemento fijado (pin), solo sus hijos.
- Copys en español, frase normal (sin mayúsculas sostenidas).

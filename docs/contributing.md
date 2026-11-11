# Flujo de trabajo

- Rama por defecto: `develop`. Nunca se commitea directamente en ella.
- Una rama por feature: `feat/<nombre>`, `chore/<nombre>`, `fix/<nombre>`, `docs/<nombre>`.
- Commits convencionales (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `perf:`, `style:`),
  pequeños y en imperativo. Ámbito opcional: `feat(hero): ...`.
- Cada rama se sube al remoto y entra en `develop` mediante pull request.
- Antes de abrir el PR: `pnpm lint && pnpm build` sin errores.
- Toda feature actualiza la documentación de `docs/` que le afecte.

## Emoji por tipo de commit

Formato: `<emoji> <tipo>(<ámbito>): <descripción>` — por ejemplo `✨ feat(hero): add engine orbit sequence`.

| Emoji | Tipo | Cuándo |
|-------|------|--------|
| ✨ | `feat` | Funcionalidad nueva |
| 🐛 | `fix` | Corrección |
| 📝 | `docs` | Documentación |
| 🔧 | `chore` | Configuración y mantenimiento |
| ♻️ | `refactor` | Cambio interno sin efecto visible |
| ⚡ | `perf` | Rendimiento |
| 💄 | `style` | Ajustes visuales |
| 🍱 | `chore(assets)` | Imágenes, frames y vídeo |

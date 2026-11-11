# Flujo de trabajo

- Rama por defecto: `develop`. Nunca se commitea directamente en ella.
- Una rama por feature: `feat/<nombre>`, `chore/<nombre>`, `fix/<nombre>`, `docs/<nombre>`.
- Commits convencionales (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `perf:`, `style:`),
  pequeños y en imperativo. Ámbito opcional: `feat(hero): ...`.
- Cada rama se sube al remoto y entra en `develop` mediante pull request.
- Antes de abrir el PR: `pnpm lint && pnpm build` sin errores.
- Toda feature actualiza la documentación de `docs/` que le afecte.

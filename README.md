API docs are generated with TypeDoc and published as Markdown so they are easy to browse on GitHub.

Commands
- `npm run docs` — generate Markdown under `docs/api/`

Conventions
- Use JSDoc on exported types, functions, and classes. Prefer brief descriptions and `@example` blocks where helpful.
- Keep implementation details unexported or mark them `@internal` so they do not appear in the generated docs.

Entrypoint
- Docs are generated from `src/index.ts`, which re‑exports the public API surface.


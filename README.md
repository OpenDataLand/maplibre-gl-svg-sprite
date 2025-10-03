# maplibre-gl-svg-sprite &mdash; GitHub Pages branch

You are on the **`gh-pages`** branch, which serves the live demos for
[maplibre-gl-svg-sprite](https://github.com/opendataland/maplibre-gl-svg-sprite).

## What lives here?
- `/index.html` &mdash; entry page linking to each example.
- `/examples/` &mdash; the HTML demos copied from the main branch.
- `/dist/` &mdash; the compiled ESM bundle the examples import.

GitHub Pages is configured to serve this branch, so everything in the repository
root becomes publicly accessible at:
```
https://opendataland.github.io/maplibre-gl-svg-sprite/
```

## Updating the site
Updates should be made on the `main` branch. When you are ready to refresh the
public demos:

1. Checkout `main`
2. `npm install`
3. `npm run pages` (builds the bundle and copies `examples/` + `dist/` into `docs/`)
4. Checkout `gh-pages`
5. Replace the contents of this branch with the freshly generated `docs/`
   directory (e.g. `rsync -a --delete ../main/docs/ ./`)
6. Commit and push `gh-pages`.

This keeps `main` as the source of truth while `gh-pages` remains a static
snapshot served by GitHub Pages.

## Need the code?
Switch back to the [`main` branch](https://github.com/opendataland/maplibre-gl-svg-sprite/tree/main)
for source, TypeScript modules, tests, and build instructions.

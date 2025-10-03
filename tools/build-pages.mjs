import { mkdirSync, rmSync, cpSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const docsDir = resolve(root, 'docs');
const examplesSrc = resolve(root, 'examples');
const distSrc = resolve(root, 'dist');
const examplesDest = resolve(docsDir, 'examples');
const distDest = resolve(docsDir, 'dist');

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

ensureDir(docsDir);

rmSync(examplesDest, { recursive: true, force: true });
rmSync(distDest, { recursive: true, force: true });

cpSync(examplesSrc, examplesDest, { recursive: true });
cpSync(distSrc, distDest, { recursive: true });

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>maplibre-gl-svg-sprite — Examples</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 40px; line-height: 1.6; }
      h1 { margin-bottom: 0.4em; }
      ul { list-style: none; padding: 0; }
      li { margin: 0.3em 0; }
      a { color: #2563eb; text-decoration: none; }
      a:hover { text-decoration: underline; }
      .note { margin-top: 2em; font-size: 0.9em; color: #475569; }
    </style>
  </head>
  <body>
    <h1>maplibre-gl-svg-sprite — Live Examples</h1>
    <ul>
      <li><a href="examples/index.html">Examples Landing Page</a></li>
      <li><a href="examples/quickstart.html">Quickstart Demo</a></li>
      <li><a href="examples/maplibre-svg-protocol.html">SVG Protocol Parameters</a></li>
      <li><a href="examples/maplibre-styleimagemissing.html">styleimagemissing Workflow</a></li>
      <li><a href="examples/maplibre-icon-workflows.html">Icon Workflows Showcase</a></li>
      <li><a href="examples/maplibre-manual-protocol.html">Manual Protocol Example</a></li>
    </ul>
    <p class="note">API reference lives at <a href="api/README.md">docs/api</a>. Enable GitHub Pages for the <code>docs/</code> folder to serve this portal.</p>
  </body>
</html>`;

writeFileSync(resolve(docsDir, 'index.html'), indexHtml, 'utf8');

console.log('✅ Copied examples and dist assets into docs/ for GitHub Pages.');

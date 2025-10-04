import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const docsDir = resolve(root, 'docs');
const distDir = resolve(root, 'dist');
const examplesDir = resolve(root, 'examples');
const docsExamplesDir = resolve(docsDir, 'examples');
const docsDistDir = resolve(docsDir, 'dist');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

function runStep(label, command) {
  console.log(`\n> ${label}`);
  execSync(command, { cwd: root, stdio: 'inherit' });
}

function resetDir(dir) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
  mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  if (!existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
  }
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
}

function prettifyExampleName(file) {
  const friendly = {
    'index.html': 'Examples Overview',
    'quickstart.html': 'Quickstart Demo',
    'maplibre-quickstart.html': 'MapLibre Quickstart Demo',
    'maplibre-svg-protocol.html': 'SVG Protocol with Parameters',
    'maplibre-styleimagemissing.html': 'styleimagemissing Workflow',
    'maplibre-icon-workflows.html': 'Icon Workflows Showcase',
    'maplibre-manual-protocol.html': 'Manual Protocol Example',
    'maplibre-animated-svg.html': 'Animated SVG Helper'
  }[file];

  if (friendly) return friendly;

  const base = file.replace(/\.html$/i, '');
  const titled = base
    .split(/[-_]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .replace(/Maplibre/g, 'MapLibre')
    .replace(/Svg/g, 'SVG');
  return titled || file;
}

function buildIndexHtml(exampleLinks) {
  const docLinks = [
    { href: 'api/index.html', label: 'API Reference' }
  ];

  const docsList = docLinks
    .map(({ href, label }) => `          <li><a href="${href}">${label}</a></li>`)
    .join('\n');

  const examplesList = exampleLinks
    .map(({ href, label }) => `          <li><a href="${href}">${label}</a></li>`)
    .join('\n');

  const version = pkg.version || 'dev';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>maplibre-gl-svg-sprite &mdash; Documentation & Examples</title>
    <style>
      :root { color-scheme: light dark; }
      body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; margin: 48px auto; max-width: 780px; line-height: 1.6; color: #1f2937; padding: 0 16px; }
      h1 { margin-bottom: 0.2em; font-size: 2.25rem; }
      h2 { margin-top: 1.8em; font-size: 1.5rem; }
      ul { list-style: none; padding: 0; }
      li { margin: 0.4em 0; }
      a { color: #2563eb; text-decoration: none; font-weight: 600; }
      a:hover { text-decoration: underline; }
      code { background: rgba(148, 163, 184, 0.2); padding: 0.1em 0.3em; border-radius: 4px; }
      .meta { margin-top: 2.5em; font-size: 0.9em; color: #4b5563; }
    </style>
  </head>
  <body>
    <h1>maplibre-gl-svg-sprite</h1>
    <p>Docs and demos published from the <code>main</code> branch. Use the links below to explore the API reference and interactive examples.</p>
    <h2>Documentation</h2>
    <ul>
${docsList}
    </ul>
    <h2>Examples</h2>
    <ul>
${examplesList}
    </ul>
    <p class="meta">Site built from version <code>${version}</code>.</p>
  </body>
</html>`;
}

try {
  console.log('Resetting docs directory...');
  resetDir(docsDir);

  runStep('Building TypeScript bundle', 'npm run build');
  runStep('Generating API reference', 'npm run docs');

  if (!existsSync(distDir)) {
    throw new Error('Expected dist/ to exist after build.');
  }
  if (!existsSync(examplesDir)) {
    throw new Error('Expected examples/ to exist.');
  }

  console.log('\nCopying distribution bundle...');
  copyDir(distDir, docsDistDir);

  console.log('Copying examples...');
  copyDir(examplesDir, docsExamplesDir);

  const exampleFiles = readdirSync(examplesDir)
    .filter(name => name.endsWith('.html'))
    .sort((a, b) => a.localeCompare(b));

  const exampleLinks = exampleFiles.map(file => ({
    href: `examples/${file}`,
    label: prettifyExampleName(file)
  }));

  console.log('Writing docs index...');
  const indexHtml = buildIndexHtml(exampleLinks);
  writeFileSync(resolve(docsDir, 'index.html'), indexHtml, 'utf8');

  console.log('\ndocs/ ready for gh-pages deployment.');
} catch (error) {
  console.error('\nFailed to build gh-pages bundle.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

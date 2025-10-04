// Dynamically load library:
// - In Vite dev: from source TypeScript: /src/index.ts
// - In static preview: from compiled dist: ../dist/index.js
export async function loadLib() {
  try {
    return await import('/src/index.ts');
  } catch (e) {
    return await import('../dist/index.js');
  }
}


import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: '/examples/index.html'
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
      name: 'maplibreSvgSprite'
    },
    outDir: 'bundle',
    emptyOutDir: true,
    rollupOptions: {
      external: []
    }
  }
});

import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE ?? '/',
  server: {
    watch: {
      // WSL2 may miss edits made by Windows apps under /mnt/c without polling.
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(projectRoot, 'index.html'),
        services: resolve(projectRoot, 'services/index.html'),
      },
    },
  },
});

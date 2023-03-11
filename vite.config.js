// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'MyLibrary',
      fileName: 'my-library',
    },
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
});

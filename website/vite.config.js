import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The build goes into the backend, which serves it at the same URL as the API
// (see backend/src/app.js). Commit backend/public/web after `npm run build`.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/public/web',
    emptyOutDir: true,
    assetsDir: 'web-assets',
  },
  server: { port: 5173 },
});

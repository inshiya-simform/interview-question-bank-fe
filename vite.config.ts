import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    // Uploaded image urls may come back relative (/api/v1/uploads/images/<id>); forward them
    // to the API so <img> tags resolve in dev.
    server: VITE_API_URL ? { proxy: { '/api': new URL(VITE_API_URL).origin } } : undefined,
  };
});

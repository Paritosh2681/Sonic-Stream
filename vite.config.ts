import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This maps your local process.env.API_KEY usage to the actual environment variable during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
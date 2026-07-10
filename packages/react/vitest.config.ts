import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      './styles/variables.css': './src/components/DatabaseViewer/styles/variables.css',
      './styles/global.css': './src/components/DatabaseViewer/styles/global.css',
    },
  },
});

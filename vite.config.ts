/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const REPO_NAME = 'js-pro-routing';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));
import { defineConfig } from 'vite';

const REPO_NAME = 'js-pro-routing';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
}));
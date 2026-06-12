import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base = nome do repositório, para o deploy no GitHub Pages
// (https://pebot09.github.io/lovelau/)
export default defineConfig({
  plugins: [react()],
  base: '/lovelau/',
  server: {
    host: true,
  },
});

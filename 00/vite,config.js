import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Redireciona requisições de /api para o nosso servidor backend
      '/api': {
        target: 'http://localhost:3001', // A porta do nosso backend
        changeOrigin: true,
      },
    },
  },
});
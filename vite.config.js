import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Alias para resolver rutas
    },
  },
  server: {
    host: true, // Permite que el servidor sea accesible desde la red
    port: 5173, // Asegúrate de que el puerto esté disponible
    strictPort: true, // Si el puerto está ocupado, no intenta otro
    hmr: {
      protocol: 'ws', // Configura el protocolo WebSocket
      host: 'localhost', // Asegúrate de que el host sea correcto
    },
  },
});

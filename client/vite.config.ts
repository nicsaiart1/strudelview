import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@stores': resolve(__dirname, './src/stores'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@themes': resolve(__dirname, './src/themes'),
    },
  },
  optimizeDeps: {
    include: ['three', 'tone'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          tone: ['tone'],
          react: ['react', 'react-dom'],
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  }
})

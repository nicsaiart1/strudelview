import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./client/src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@components': resolve(__dirname, './client/src/components'),
      '@stores': resolve(__dirname, './client/src/stores'),
      '@services': resolve(__dirname, './client/src/services'),
      '@types': resolve(__dirname, './client/src/types'),
      '@utils': resolve(__dirname, './client/src/utils'),
      '@hooks': resolve(__dirname, './client/src/hooks'),
      '@themes': resolve(__dirname, './client/src/themes'),
    },
  },
});
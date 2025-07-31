import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Audio API
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    createGain: vi.fn(),
    createOscillator: vi.fn(),
    createAnalyser: vi.fn(),
    createBuffer: vi.fn(),
    createBufferSource: vi.fn(),
    destination: {},
    resume: vi.fn(),
    suspend: vi.fn(),
    close: vi.fn(),
  })),
});

// Mock WebGL context
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextType) => {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return {
      createShader: vi.fn(),
      shaderSource: vi.fn(),
      compileShader: vi.fn(),
      createProgram: vi.fn(),
      attachShader: vi.fn(),
      linkProgram: vi.fn(),
      useProgram: vi.fn(),
      createBuffer: vi.fn(),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      vertexAttribPointer: vi.fn(),
      clear: vi.fn(),
      clearColor: vi.fn(),
      drawArrays: vi.fn(),
      getAttribLocation: vi.fn(),
      getUniformLocation: vi.fn(),
      uniform1f: vi.fn(),
      uniformMatrix4fv: vi.fn(),
    };
  }
  return null;
});

// Mock crypto.randomUUID for testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mock-uuid-1234'),
  },
});